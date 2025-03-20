import pool from '../config/database.js';
import bcrypt from 'bcrypt';

export const findAll = async () => {
  const [rows] = await pool.query(`
    SELECT k.*, d.nama_Departemen, j.nama_Jabatan 
    FROM Karyawan k
    LEFT JOIN Departemen d ON k.departmentID = d.departmentID
    LEFT JOIN Jabatan j ON k.positionID = j.PositionID
  `);
  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.query(`
    SELECT k.*, d.nama_Departemen, j.nama_Jabatan 
    FROM Karyawan k
    LEFT JOIN Departemen d ON k.departmentID = d.departmentID
    LEFT JOIN Jabatan j ON k.positionID = j.PositionID
    WHERE k.employeeID = ?
  `, [id]);
  return rows[0];
};

export const findByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM Karyawan WHERE email = ?', [email]);
  return rows[0];
};

export const create = async (employeeData) => {
  const { 
    nama, 
    email, 
    no_Telp, 
    password, 
    positionID, 
    departmentID, 
    status_Karyawan,
    tanggal_Bergabung
  } = employeeData;
  
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  // Set default values
  const status = status_Karyawan || 'Aktif';
  const joinDate = tanggal_Bergabung || new Date().toISOString().split('T')[0];
  
  const [result] = await pool.query(
    `INSERT INTO Karyawan (
      nama, email, no_Telp, password, positionID, departmentID, status_Karyawan, tanggal_Bergabung
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [nama, email, no_Telp, hashedPassword, positionID, departmentID, status, joinDate]
  );
  
  return result.insertId;
};

export const update = async (id, employeeData) => {
  // Get current employee data
  const [employee] = await pool.query('SELECT * FROM Karyawan WHERE employeeID = ?', [id]);
  if (!employee[0]) return false;
  
  const { 
    nama, 
    email, 
    no_Telp, 
    password, 
    positionID, 
    departmentID, 
    status_Karyawan,
    tanggal_Bergabung
  } = employeeData;
  
  // Prepare update data
  const updateData = {
    nama: nama || employee[0].nama,
    email: email || employee[0].email,
    no_Telp: no_Telp || employee[0].no_Telp,
    positionID: positionID || employee[0].positionID,
    departmentID: departmentID || employee[0].departmentID,
    status_Karyawan: status_Karyawan || employee[0].status_Karyawan,
    tanggal_Bergabung: tanggal_Bergabung || employee[0].tanggal_Bergabung
  };
  
  // If password is provided, hash it
  if (password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(password, salt);
  }
  
  // Build query dynamically
  const fields = Object.keys(updateData)
    .filter(key => updateData[key] !== undefined)
    .map(key => `${key} = ?`);
  
  const values = Object.keys(updateData)
    .filter(key => updateData[key] !== undefined)
    .map(key => updateData[key]);
  
  // Add ID to values array
  values.push(id);
  
  const [result] = await pool.query(
    `UPDATE Karyawan SET ${fields.join(', ')} WHERE employeeID = ?`,
    values
  );
  
  return result.affectedRows > 0;
};

export const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM Karyawan WHERE employeeID = ?', [id]);
  return result.affectedRows > 0;
};

export const setInactive = async (id) => {
  const [result] = await pool.query(
    'UPDATE Karyawan SET status_Karyawan = ? WHERE employeeID = ?',
    ['Non-Aktif', id]
  );
  return result.affectedRows > 0;
};

export const hasRelatedRecords = async (id) => {
  const [attendances] = await pool.query('SELECT COUNT(*) as count FROM Kehadiran WHERE employeeID = ?', [id]);
  const [leaves] = await pool.query('SELECT COUNT(*) as count FROM Cuti WHERE employeeID = ?', [id]);
  const [payrolls] = await pool.query('SELECT COUNT(*) as count FROM Gaji WHERE employeeID = ?', [id]);
  
  return attendances[0].count > 0 || leaves[0].count > 0 || payrolls[0].count > 0;
};

export const verifyPassword = async (user, password) => {
  return await bcrypt.compare(password, user.password);
};

export const changePassword = async (id, newPassword) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  
  const [result] = await pool.query(
    'UPDATE Karyawan SET password = ? WHERE employeeID = ?',
    [hashedPassword, id]
  );
  
  return result.affectedRows > 0;
};
