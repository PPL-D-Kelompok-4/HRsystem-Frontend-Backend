import pool from '../config/database.js';

export const findAll = async () => {
  const [rows] = await pool.query(`
    SELECT g.*, k.nama as employee_name
    FROM Gaji g
    JOIN Karyawan k ON g.employeeID = k.employeeID
    ORDER BY g.tahun DESC, g.bulan DESC
  `);
  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.query(`
    SELECT g.*, k.nama as employee_name
    FROM Gaji g
    JOIN Karyawan k ON g.employeeID = k.employeeID
    WHERE g.payrollID = ?
  `, [id]);
  return rows[0];
};

export const findByEmployeeId = async (employeeId) => {
  const [rows] = await pool.query(`
    SELECT g.*, k.nama as employee_name
    FROM Gaji g
    JOIN Karyawan k ON g.employeeID = k.employeeID
    WHERE g.employeeID = ?
    ORDER BY g.tahun DESC, g.bulan DESC
  `, [employeeId]);
  return rows;
};

export const findByMonthYear = async (employeeId, month, year) => {
  const [rows] = await pool.query(
    'SELECT * FROM Gaji WHERE employeeID = ? AND bulan = ? AND tahun = ?',
    [employeeId, month, year]
  );
  return rows[0];
};

export const create = async (payrollData) => {
  const { 
    employeeID, 
    bulan, 
    tahun, 
    gaji_Pokok, 
    tunjangan, 
    potongan, 
    status_Pembayaran 
  } = payrollData;
  
  // Calculate total salary
  const tunjanganValue = tunjangan || 0;
  const potonganValue = potongan || 0;
  const totalGaji = parseFloat(gaji_Pokok) + parseFloat(tunjanganValue) - parseFloat(potonganValue);
  
  const [result] = await pool.query(
    `INSERT INTO Gaji (
      employeeID, bulan, tahun, gaji_Pokok, tunjangan, potongan, total_Gaji, status_Pembayaran
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      employeeID, 
      bulan, 
      tahun, 
      gaji_Pokok, 
      tunjanganValue, 
      potonganValue, 
      totalGaji, 
      status_Pembayaran || 'Belum Lunas'
    ]
  );
  
  return result.insertId;
};

export const update = async (id, payrollData) => {
  // Get current payroll data
  const [payroll] = await pool.query('SELECT * FROM Gaji WHERE payrollID = ?', [id]);
  if (!payroll[0]) return false;
  
  const { 
    gaji_Pokok, 
    tunjangan, 
    potongan, 
    status_Pembayaran 
  } = payrollData;
  
  // Prepare update data
  const updateData = {
    gaji_Pokok: gaji_Pokok || payroll[0].gaji_Pokok,
    tunjangan: tunjangan !== undefined ? tunjangan : payroll[0].tunjangan,
    potongan: potongan !== undefined ? potongan : payroll[0].potongan,
    status_Pembayaran: status_Pembayaran || payroll[0].status_Pembayaran
  };
  
  // Calculate total salary
  updateData.total_Gaji = parseFloat(updateData.gaji_Pokok) + 
                         parseFloat(updateData.tunjangan) - 
                         parseFloat(updateData.potongan);
  
  const [result] = await pool.query(
    `UPDATE Gaji SET 
      gaji_Pokok = ?, 
      tunjangan = ?, 
      potongan = ?, 
      total_Gaji = ?, 
      status_Pembayaran = ? 
    WHERE payrollID = ?`,
    [
      updateData.gaji_Pokok,
      updateData.tunjangan,
      updateData.potongan,
      updateData.total_Gaji,
      updateData.status_Pembayaran,
      id
    ]
  );
  
  return result.affectedRows > 0;
};

export const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM Gaji WHERE payrollID = ?', [id]);
  return result.affectedRows > 0;
};
