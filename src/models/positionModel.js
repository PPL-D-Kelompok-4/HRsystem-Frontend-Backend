import pool from '../config/database.js';

export const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM Jabatan');
  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM Jabatan WHERE PositionID = ?', [id]);
  return rows[0];
};

export const create = async (positionData) => {
  const { nama_Jabatan, gaji_Pokok, Tunjangan } = positionData;
  
  const [result] = await pool.query(
    'INSERT INTO Jabatan (nama_Jabatan, gaji_Pokok, Tunjangan) VALUES (?, ?, ?)',
    [nama_Jabatan, gaji_Pokok, Tunjangan || 0]
  );
  
  return result.insertId;
};

export const update = async (id, positionData) => {
  const { nama_Jabatan, gaji_Pokok, Tunjangan } = positionData;
  
  // Get current position data
  const [position] = await pool.query('SELECT * FROM Jabatan WHERE PositionID = ?', [id]);
  if (!position[0]) return false;
  
  // Prepare update data
  const updateData = {
    nama_Jabatan: nama_Jabatan || position[0].nama_Jabatan,
    gaji_Pokok: gaji_Pokok || position[0].gaji_Pokok,
    Tunjangan: Tunjangan !== undefined ? Tunjangan : position[0].Tunjangan
  };
  
  const [result] = await pool.query(
    'UPDATE Jabatan SET nama_Jabatan = ?, gaji_Pokok = ?, Tunjangan = ? WHERE PositionID = ?',
    [updateData.nama_Jabatan, updateData.gaji_Pokok, updateData.Tunjangan, id]
  );
  
  return result.affectedRows > 0;
};

export const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM Jabatan WHERE PositionID = ?', [id]);
  return result.affectedRows > 0;
};

export const hasEmployees = async (id) => {
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM Karyawan WHERE positionID = ?', [id]);
  return rows[0].count > 0;
};
