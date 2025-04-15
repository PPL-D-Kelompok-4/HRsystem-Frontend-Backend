import pool from "../config/database.js";

export const findAll = async () => {
	const [rows] = await pool.query(`
    SELECT a.*, k.nama as employee_name
    FROM Kehadiran a
    JOIN Karyawan k ON a.employeeID = k.employeeID
    ORDER BY a.tanggal DESC, a.jam_Masuk DESC
  `);
	return rows;
};

export const findById = async (id) => {
	const [rows] = await pool.query(
		`
    SELECT a.*, k.nama as employee_name
    FROM Kehadiran a
    JOIN Karyawan k ON a.employeeID = k.employeeID
    WHERE a.attendanceID = ?
  `,
		[id]
	);
	return rows[0];
};

export const findByEmployeeId = async (employeeId) => {
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
	return rows;
};

export const findByDateRange = async (startDate, endDate) => {
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
	return rows;
};

export const findByEmployeeAndDate = async (employeeId, date) => {
	const [rows] = await pool.query(
		"SELECT * FROM Kehadiran WHERE employeeID = ? AND tanggal = ?",
		[employeeId, date]
	);
	return rows[0];
};

export const clockIn = async (employeeId) => {
	// Get current date and time
	const now = new Date();
	const currentDate = now.toISOString().split("T")[0];
	const currentTime = now.toTimeString().split(" ")[0];

	const [result] = await pool.query(
		"INSERT INTO Kehadiran (employeeID, tanggal, jam_Masuk, status) VALUES (?, ?, ?, ?)",
		[employeeId, currentDate, currentTime, "Hadir"]
	);

	return result.insertId;
};

export const clockOut = async (attendanceId, time) => {
	const clockOutTime = time || new Date().toTimeString().split(" ")[0];

	const [result] = await pool.query(
		"UPDATE Kehadiran SET jam_Keluar = ? WHERE attendanceID = ?",
		[clockOutTime, attendanceId]
	);

	return result.affectedRows > 0;
};

export const createOrUpdate = async (attendanceData) => {
	const { employeeID, tanggal, jam_Masuk, jam_Keluar, status } = attendanceData;

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

		return existingAttendance[0].attendanceID;
	} else {
		// Create new attendance record
		const [result] = await pool.query(
			"INSERT INTO Kehadiran (employeeID, tanggal, jam_Masuk, jam_Keluar, status) VALUES (?, ?, ?, ?, ?)",
			[employeeID, tanggal, jam_Masuk || null, jam_Keluar || null, status]
		);

		return result.insertId;
	}
};

export const remove = async (id) => {
	const [result] = await pool.query(
		"DELETE FROM Kehadiran WHERE attendanceID = ?",
		[id]
	);
	return result.affectedRows > 0;
};
