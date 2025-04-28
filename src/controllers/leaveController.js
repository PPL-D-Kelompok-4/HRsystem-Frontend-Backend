import pool from "../config/database.js";

// Get all leaves
export const getAllLeaves = async (req, res) => {
	try {
		const [rows] = await pool.query(`
			SELECT 
			c.leaveID AS id,
			k.nama AS employee,
			DATE_FORMAT(c.tanggal_Mulai, '%Y-%m-%d') AS startDate,
			DATE_FORMAT(c.tanggal_Selesai, '%Y-%m-%d') AS endDate,
			DATEDIFF(c.tanggal_Selesai, c.tanggal_Mulai) + 1 AS days,
			c.keterangan_Cuti AS reason,
			CASE
				WHEN c.keterangan_Cuti LIKE '%Sakit%' THEN 'Sick'
				WHEN c.keterangan_Cuti LIKE '%Ijin%' THEN 'Personal'
				ELSE 'Annual'
			END AS type,
			c.status,
			k.email AS contactInfo,
			'' AS rejectionReason
			FROM 
				Cuti c
			JOIN 
				Karyawan k ON c.employeeID = k.employeeID
			ORDER BY 
				c.leaveID ASC;

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
            SELECT 
                c.leaveID AS id,
                k.nama AS employee,
                DATE_FORMAT(c.tanggal_Mulai, '%Y-%m-%d') AS startDate,
                DATE_FORMAT(c.tanggal_Selesai, '%Y-%m-%d') AS endDate,
                DATEDIFF(c.tanggal_Selesai, c.tanggal_Mulai) + 1 AS days,
                c.keterangan_Cuti AS reason,
                CASE
                    WHEN c.keterangan_Cuti LIKE '%Sakit%' THEN 'Sick'
                    WHEN c.keterangan_Cuti LIKE '%Ijin%' THEN 'Personal'
                    ELSE 'Annual'
                END AS type,
                c.status,
                k.email AS contactInfo,
                '' AS rejectionReason
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
		const { tanggal_Mulai, tanggal_Selesai, keterangan_Cuti } = req.body;
		const employeeID = req.user.id;

		if (!employeeID || !tanggal_Mulai || !tanggal_Selesai) {
			return res.status(400).json({
				message: "Employee ID, start date, and end date are required",
			});
		}

		const today = new Date().toISOString().split("T")[0];

		const [result] = await pool.query(
			`INSERT INTO Cuti (
                employeeID, tanggal_Pengajuan, tanggal_Mulai, tanggal_Selesai, keterangan_Cuti, status
            ) VALUES (?, ?, ?, ?, ?, ?)`,
			[
				employeeID,
				today,
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

export const checkPendingLeave = async (req, res) => {
	try {
		const employeeID = req.user.id;

		const [rows] = await pool.query(
			`SELECT * FROM Cuti WHERE employeeID = ? AND status = 'Diajukan'`,
			[employeeID]
		);

		if (rows.length > 0) {
			return res.json({ hasPending: true });
		} else {
			return res.json({ hasPending: false });
		}
	} catch (error) {
		console.error("Error checking pending leave:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Update leave status
export const updateLeaveStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status, keterangan_Cuti } = req.body;

		const parseDateLocal = (date) => {
			if (date instanceof Date) {
				return new Date(date.getFullYear(), date.getMonth(), date.getDate());
			} else if (typeof date === "string") {
				const [year, month, day] = date.split("-").map(Number);
				return new Date(year, month - 1, day);
			} else {
				throw new Error("Invalid date format");
			}
		};

		const getDatesBetween = (startDate, endDate) => {
			const dates = [];
			let current = new Date(startDate);
			while (current <= endDate) {
				dates.push(new Date(current));
				current.setDate(current.getDate() + 1);
			}
			return dates;
		};

		const formatDateLocal = (date) => {
			const year = date.getFullYear();
			const month = (date.getMonth() + 1).toString().padStart(2, "0");
			const day = date.getDate().toString().padStart(2, "0");
			return `${year}-${month}-${day}`;
		};

		if (!status || !["Diajukan", "Disetujui", "Ditolak"].includes(status)) {
			return res.status(400).json({
				message: "Valid status is required (Diajukan, Disetujui, or Ditolak)",
			});
		}

		const [leave] = await pool.query("SELECT * FROM Cuti WHERE leaveID = ?", [
			id,
		]);
		if (leave.length === 0) {
			return res.status(404).json({ message: "Leave not found" });
		}

		const updateFields = ["status = ?"];
		const updateValues = [status];

		if (keterangan_Cuti !== undefined) {
			updateFields.push("keterangan_Cuti = ?");
			updateValues.push(keterangan_Cuti);
		}
		updateValues.push(id);

		await pool.query(
			`UPDATE Cuti SET ${updateFields.join(", ")} WHERE leaveID = ?`,
			updateValues
		);

		const startDate = parseDateLocal(leave[0].tanggal_Mulai);
		const endDate = parseDateLocal(leave[0].tanggal_Selesai);

		const dates = getDatesBetween(startDate, endDate);
		const employeeID = leave[0].employeeID;

		if (status === "Disetujui") {
			for (const date of dates) {
				const formattedDate = formatDateLocal(date);

				const [existingAttendance] = await pool.query(
					"SELECT * FROM Kehadiran WHERE employeeID = ? AND tanggal = ?",
					[employeeID, formattedDate]
				);

				if (existingAttendance.length === 0) {
					await pool.query(
						"INSERT INTO Kehadiran (employeeID, tanggal, status) VALUES (?, ?, ?)",
						[employeeID, formattedDate, "Cuti"]
					);
				}
			}
		} else if (status === "Ditolak") {
			const formattedDates = dates.map((date) => formatDateLocal(date));

			const [absensiCuti] = await pool.query(
				`SELECT * FROM Kehadiran WHERE employeeID = ? AND tanggal IN (${formattedDates
					.map(() => "?")
					.join(", ")}) AND status = 'Cuti'`,
				[employeeID, ...formattedDates]
			);

			if (absensiCuti.length > 0) {
				await pool.query(
					`DELETE FROM Kehadiran WHERE employeeID = ? AND tanggal IN (${formattedDates
						.map(() => "?")
						.join(", ")}) AND status = 'Cuti'`,
					[employeeID, ...formattedDates]
				);
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

		const [leave] = await pool.query("SELECT * FROM Cuti WHERE leaveID = ?", [
			id,
		]);
		if (leave.length === 0) {
			return res.status(404).json({ message: "Leave not found" });
		}

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
