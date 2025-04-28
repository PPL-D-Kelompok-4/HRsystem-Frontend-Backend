import pool from "../config/database.js";

// Get all attendances
export const getAllAttendances = async (req, res) => {
	try {
		const [rows] = await pool.query(`
      SELECT a.*, k.nama as employee_name
      FROM Kehadiran a
      JOIN Karyawan k ON a.employeeID = k.employeeID
      ORDER BY a.tanggal DESC, a.jam_Masuk DESC
    `);
		res.json(rows);
	} catch (error) {
		console.error("Error fetching attendances:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Get attendance by ID
export const getAttendanceById = async (req, res) => {
	try {
		const { id } = req.params;
		const [rows] = await pool.query(
			`
      SELECT a.*, k.nama as employee_name
      FROM Kehadiran a
      JOIN Karyawan k ON a.employeeID = k.employeeID
      WHERE a.attendanceID = ?
    `,
			[id]
		);

		if (rows.length === 0) {
			return res.status(404).json({ message: "Attendance not found" });
		}

		res.json(rows[0]);
	} catch (error) {
		console.error("Error fetching attendance:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Get attendances by employee ID
export const getAttendancesByEmployeeId = async (req, res) => {
	try {
		const { employeeId } = req.params;
		const [rows] = await pool.query(
			`
      SELECT a.*, k.nama as employee_name
      FROM Kehadiran a
      JOIN Karyawan k ON a.employeeID = k.employeeID
      WHERE a.employeeID = ?
      ORDER BY a.tanggal DESC, a.jam_Masuk DESC
    `,
			[employeeId]
		);

		res.json(rows);
	} catch (error) {
		console.error("Error fetching employee attendances:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Get attendances by date range
export const getAttendancesByDateRange = async (req, res) => {
	try {
		const { startDate, endDate } = req.query;

		if (!startDate || !endDate) {
			return res
				.status(400)
				.json({ message: "Start date and end date are required" });
		}

		const [rows] = await pool.query(
			`
      SELECT a.*, k.nama as employee_name
      FROM Kehadiran a
      JOIN Karyawan k ON a.employeeID = k.employeeID
      WHERE a.tanggal BETWEEN ? AND ?
      ORDER BY a.tanggal DESC, a.jam_Masuk DESC
    `,
			[startDate, endDate]
		);

		res.json(rows);
	} catch (error) {
		console.error("Error fetching attendances by date range:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Record clock in
export const clockIn = async (req, res) => {
	try {
		const { employeeID } = req.body;

		// Validate required fields
		if (!employeeID) {
			return res.status(400).json({ message: "Employee ID is required" });
		}

		// Check if employee exists
		const [employee] = await pool.query(
			"SELECT * FROM Karyawan WHERE employeeID = ?",
			[employeeID]
		);
		if (employee.length === 0) {
			return res.status(404).json({ message: "Employee not found" });
		}

		// Get current date and time
		const now = new Date();
		const currentDate = now.toISOString().split("T")[0];
		const currentTime = now.toTimeString().split(" ")[0];

		// Check if employee has already clocked in today
		const [existingAttendance] = await pool.query(
			"SELECT * FROM Kehadiran WHERE employeeID = ? AND tanggal = ?",
			[employeeID, currentDate]
		);

		if (existingAttendance.length > 0) {
			return res.status(400).json({
				message: "Employee has already clocked in today",
			});
		}

		// Record attendance
		const [result] = await pool.query(
			"INSERT INTO Kehadiran (employeeID, tanggal, jam_Masuk, status) VALUES (?, ?, ?, ?)",
			[employeeID, currentDate, currentTime, "Hadir"]
		);

		res.status(201).json({
			message: "Clock in recorded successfully",
			attendanceID: result.insertId,
		});
	} catch (error) {
		console.error("Error recording clock in:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Record clock out
export const clockOut = async (req, res) => {
	try {
		const { employeeID } = req.body;

		// Validate required fields
		if (!employeeID) {
			return res.status(400).json({ message: "Employee ID is required" });
		}

		// Get current date and time
		const now = new Date();
		const currentDate = now.toISOString().split("T")[0];
		const currentTime = now.toTimeString().split(" ")[0];

		// Check if employee has clocked in today
		const [attendance] = await pool.query(
			"SELECT * FROM Kehadiran WHERE employeeID = ? AND tanggal = ?",
			[employeeID, currentDate]
		);

		if (attendance.length === 0) {
			return res.status(400).json({
				message: "Employee has not clocked in today",
			});
		}

		// Check if employee has already clocked out
		if (attendance[0].jam_Keluar) {
			return res.status(400).json({
				message: "Employee has already clocked out today",
			});
		}

		// Update attendance with clock out time
		const [result] = await pool.query(
			"UPDATE Kehadiran SET jam_Keluar = ? WHERE attendanceID = ?",
			[currentTime, attendance[0].attendanceID]
		);

		res.json({ message: "Clock out recorded successfully" });
	} catch (error) {
		console.error("Error recording clock out:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Create or update attendance manually
export const createOrUpdateAttendance = async (req, res) => {
	try {
		const { employeeID, tanggal, jam_Masuk, jam_Keluar, status } = req.body;

		// Validate required fields
		if (!employeeID || !tanggal || !status) {
			return res.status(400).json({
				message: "Employee ID, date, and status are required",
			});
		}

		// Validate status
		if (!["Hadir", "Izin", "Sakit", "Cuti"].includes(status)) {
			return res.status(400).json({
				message: "Valid status is required (Hadir, Izin, Sakit, or Cuti)",
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

		// Check if attendance record already exists for this date
		const [existingAttendance] = await pool.query(
			"SELECT * FROM Kehadiran WHERE employeeID = ? AND tanggal = ?",
			[employeeID, tanggal]
		);

		if (existingAttendance.length > 0) {
			// Update existing attendance record
			const [result] = await pool.query(
				`UPDATE Kehadiran SET 
          jam_Masuk = ?, 
          jam_Keluar = ?, 
          status = ? 
        WHERE attendanceID = ?`,
				[
					jam_Masuk || existingAttendance[0].jam_Masuk,
					jam_Keluar || existingAttendance[0].jam_Keluar,
					status,
					existingAttendance[0].attendanceID,
				]
			);

			res.json({ message: "Attendance updated successfully" });
		} else {
			// Create new attendance record
			const [result] = await pool.query(
				"INSERT INTO Kehadiran (employeeID, tanggal, jam_Masuk, jam_Keluar, status) VALUES (?, ?, ?, ?, ?)",
				[employeeID, tanggal, jam_Masuk || null, jam_Keluar || null, status]
			);

			res.status(201).json({
				message: "Attendance created successfully",
				attendanceID: result.insertId,
			});
		}
	} catch (error) {
		console.error("Error creating/updating attendance:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Delete attendance
export const deleteAttendance = async (req, res) => {
	try {
		const { id } = req.params;

		const [result] = await pool.query(
			"DELETE FROM Kehadiran WHERE attendanceID = ?",
			[id]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Attendance not found" });
		}

		res.json({ message: "Attendance deleted successfully" });
	} catch (error) {
		console.error("Error deleting attendance:", error);
		res.status(500).json({ message: "Server error" });
	}
};
