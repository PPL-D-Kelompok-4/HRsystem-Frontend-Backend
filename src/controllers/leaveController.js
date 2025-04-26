import pool from "../config/database.js";

// Get all leaves
export const getAllLeaves = async (req, res) => {
	try {
		const [rows] = await pool.query(`
      SELECT c.*, k.nama as employee_name
      FROM Cuti c
      JOIN Karyawan k ON c.employeeID = k.employeeID
      ORDER BY c.tanggal_Pengajuan DESC
    `);
		res.json(rows);
	} catch (error) {
		console.error("Error fetching leaves:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Get leave by ID
export const getLeaveById = async (req, res) => {
	try {
		const { id } = req.params;
		const [rows] = await pool.query(
			`
      SELECT c.*, k.nama as employee_name
      FROM Cuti c
      JOIN Karyawan k ON c.employeeID = k.employeeID
      WHERE c.leaveID = ?
    `,
			[id]
		);

		if (rows.length === 0) {
			return res.status(404).json({ message: "Leave not found" });
		}

		res.json(rows[0]);
	} catch (error) {
		console.error("Error fetching leave:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Get leaves by employee ID
export const getLeavesByEmployeeId = async (req, res) => {
	try {
		const { employeeId } = req.params;
		const [rows] = await pool.query(
			`
      SELECT c.*, k.nama as employee_name
      FROM Cuti c
      JOIN Karyawan k ON c.employeeID = k.employeeID
      WHERE c.employeeID = ?
      ORDER BY c.tanggal_Pengajuan DESC
    `,
			[employeeId]
		);

		res.json(rows);
	} catch (error) {
		console.error("Error fetching employee leaves:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Create new leave
export const createLeave = async (req, res) => {
	try {
		const { employeeID, tanggal_Mulai, tanggal_Selesai, keterangan_Cuti } =
			req.body;

		// Validate required fields
		if (!employeeID || !tanggal_Mulai || !tanggal_Selesai) {
			return res.status(400).json({
				message: "Employee ID, start date, and end date are required",
			});
		}

		// Check if employee exists
		const [employee] = await pool.query(
			"SELECT * FROM Karyawan WHERE employeeID = ?",
			[employeeID]
		);
		if (employee.length === 0) {
			return res.status(404).json({ message: "Employee not found" });
		}

		// Check if dates are valid
		const startDate = new Date(tanggal_Mulai);
		const endDate = new Date(tanggal_Selesai);
		const today = new Date();

		if (startDate > endDate) {
			return res
				.status(400)
				.json({ message: "Start date must be before end date" });
		}

		// Set application date to today
		const tanggal_Pengajuan = today.toISOString().split("T")[0];

		const [result] = await pool.query(
			`INSERT INTO Cuti (
        employeeID, tanggal_Pengajuan, tanggal_Mulai, tanggal_Selesai, keterangan_Cuti, status
      ) VALUES (?, ?, ?, ?, ?, ?)`,
			[
				employeeID,
				tanggal_Pengajuan,
				tanggal_Mulai,
				tanggal_Selesai,
				keterangan_Cuti || "",
				"Diajukan",
			]
		);

		res.status(201).json({
			message: "Leave request created successfully",
			leaveID: result.insertId,
		});
	} catch (error) {
		console.error("Error creating leave request:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Update leave status
export const updateLeaveStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status, keterangan_Cuti } = req.body;

		// Validate status
		if (!status || !["Diajukan", "Disetujui", "Ditolak"].includes(status)) {
			return res.status(400).json({
				message: "Valid status is required (Diajukan, Disetujui, or Ditolak)",
			});
		}

		// Check if leave exists
		const [leave] = await pool.query("SELECT * FROM Cuti WHERE leaveID = ?", [
			id,
		]);
		if (leave.length === 0) {
			return res.status(404).json({ message: "Leave not found" });
		}

		// Update leave status
		const updateFields = ["status = ?"];
		const updateValues = [status];

		// If keterangan_Cuti is provided, update it
		if (keterangan_Cuti !== undefined) {
			updateFields.push("keterangan_Cuti = ?");
			updateValues.push(keterangan_Cuti);
		}

		// Add ID to values array
		updateValues.push(id);

		const [result] = await pool.query(
			`UPDATE Cuti SET ${updateFields.join(", ")} WHERE leaveID = ?`,
			updateValues
		);

		// If leave is approved, create attendance records for the leave period
		if (status === "Disetujui") {
			const startDate = new Date(leave[0].tanggal_Mulai);
			const endDate = new Date(leave[0].tanggal_Selesai);

			// Loop through each day of the leave period
			for (
				let date = new Date(startDate);
				date <= endDate;
				date.setDate(date.getDate() + 1)
			) {
				const currentDate = date.toISOString().split("T")[0];

				// Check if attendance record already exists for this date
				const [existingAttendance] = await pool.query(
					"SELECT * FROM Kehadiran WHERE employeeID = ? AND tanggal = ?",
					[leave[0].employeeID, currentDate]
				);

				// If no attendance record exists, create one with status 'Cuti'
				if (existingAttendance.length === 0) {
					await pool.query(
						"INSERT INTO Kehadiran (employeeID, tanggal, status) VALUES (?, ?, ?)",
						[leave[0].employeeID, currentDate, "Cuti"]
					);
				}
			}
		}

		res.json({ message: "Leave status updated successfully" });
	} catch (error) {
		console.error("Error updating leave status:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Delete leave
export const deleteLeave = async (req, res) => {
	try {
		const { id } = req.params;

		// Check if leave exists
		const [leave] = await pool.query("SELECT * FROM Cuti WHERE leaveID = ?", [
			id,
		]);
		if (leave.length === 0) {
			return res.status(404).json({ message: "Leave not found" });
		}

		// Only allow deletion if status is 'Diajukan'
		if (leave[0].status !== "Diajukan") {
			return res.status(400).json({
				message: 'Only leave requests with status "Diajukan" can be deleted',
			});
		}

		const [result] = await pool.query("DELETE FROM Cuti WHERE leaveID = ?", [
			id,
		]);

		res.json({ message: "Leave request deleted successfully" });
	} catch (error) {
		console.error("Error deleting leave request:", error);
		res.status(500).json({ message: "Server error" });
	}
};
