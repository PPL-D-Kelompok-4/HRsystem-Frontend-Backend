import pool from '../config/database.js';

export const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM Departemen');
  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM Departemen WHERE departmentID = ?', [id]);
  return rows[0];
};

export const create = async (departmentData) => {
  const { nama_Departemen } = departmentData;
  const [result] = await pool.query(
    'INSERT INTO Departemen (nama_Departemen) VALUES (?)',
    [nama_Departemen]
  );
  return result.insertId;
};

export const update = async (id, departmentData) => {
  const { nama_Departemen } = departmentData;
  const [result] = await pool.query(
    'UPDATE Departemen SET nama_Departemen = ? WHERE departmentID = ?',
    [nama_Departemen, id]
  );
  return result.affectedRows > 0;
};

export const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM Departemen WHERE departmentID = ?', [id]);
  return result.affectedRows > 0;
};

export const hasEmployees = async (id) => {
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM Karyawan WHERE departmentID = ?', [id]);
  return rows[0].count > 0;
};
