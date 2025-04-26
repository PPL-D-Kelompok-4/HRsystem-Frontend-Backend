import pool from '../config/database.js';

export const findAll = async () => {
  const [rows] = await pool.query(`
    SELECT c.*, k.nama as employee_name
    FROM Cuti c
    JOIN Karyawan k ON c.employeeID = k.employeeID
    ORDER BY c.tanggal_Pengajuan DESC
  `);
  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.query(`
    SELECT c.*, k.nama as employee_name
    FROM Cuti c
    JOIN Karyawan k ON c.employeeID = k.employeeID
    WHERE c.leaveID = ?
  `, [id]);
  return rows[0];
};

export const findByEmployeeId = async (employeeId) => {
  const [rows] = await pool.query(`
    SELECT c.*, k.nama as employee_name
    FROM Cuti c
    JOIN Karyawan k ON c.employeeID = k.employeeID
    WHERE c.employeeID = ?
    ORDER BY c.tanggal_Pengajuan DESC
  `, [employeeId]);
  return rows;
};

export const create = async (leaveData) => {
  const { 
    employeeID, 
    tanggal_Mulai, 
    tanggal_Selesai, 
    keterangan_Cuti 
  } = leaveData;
  
  // Set application date to today
  const tanggal_Pengajuan = new Date().toISOString().split('T')[0];
  
  const [result] = await pool.query(
    `INSERT INTO Cuti (
      employeeID, tanggal_Pengajuan, tanggal_Mulai, tanggal_Selesai, keterangan_Cuti, status
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      employeeID, 
      tanggal_Pengajuan, 
      tanggal_Mulai, 
      tanggal_Selesai, 
      keterangan_Cuti || '', 
      'Diajukan'
    ]
  );
  
  return result.insertId;
};

export const updateStatus = async (id, statusData) => {
  const { status, keterangan_Cuti } = statusData;
  
  // Check if leave exists
  const [leave] = await pool.query('SELECT * FROM Cuti WHERE leaveID = ?', [id]);
  if (!leave[0]) return false;
  
  // Update leave status
  const updateFields = ['status = ?'];
  const updateValues = [status];
  
  // If keterangan_Cuti is provided, update it
  if (keterangan_Cuti !== undefined) {
    updateFields.push('keterangan_Cuti = ?');
    updateValues.push(keterangan_Cuti);
  }
  
  // Add ID to values array
  updateValues.push(id);
  
  const [result] = await pool.query(
    `UPDATE Cuti SET ${updateFields.join(', ')} WHERE leaveID = ?`,
    updateValues
  );
  
  return result.affectedRows > 0;
};

export const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM Cuti WHERE leaveID = ?', [id]);
  return result.affectedRows > 0;
};

export const createAttendanceForLeave = async (employeeId, startDate, endDate) => {
  // Convert dates to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Loop through each day of the leave period
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const currentDate = date.toISOString().split('T')[0];
    
    // Check if attendance record already exists for this date
    const [existingAttendance] = await pool.query(
      'SELECT * FROM Kehadiran WHERE employeeID = ? AND tanggal = ?',
      [employeeId, currentDate]
    );
    
    // If no attendance record exists, create one with status 'Cuti'
    if (existingAttendance.length === 0) {
      await pool.query(
        'INSERT INTO Kehadiran (employeeID, tanggal, status) VALUES (?, ?, ?)',
        [employeeId, currentDate, 'Cuti']
      );
    }
  }
  
  return true;
};
