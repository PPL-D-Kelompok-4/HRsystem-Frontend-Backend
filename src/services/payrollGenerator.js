// services/payrollGenerator.js
import pool from '../config/database.js';
import { format } from 'date-fns';

export const payrollAutoGenerator = async () => {
  const today = new Date();
  const isAuto = today.getDate() === 1;
  const currentPeriod = format(today, 'yyyy-MM-01');

  const [employees] = await pool.query(`
    SELECT k.employeeID, j.gaji_Pokok, j.Tunjangan
    FROM Karyawan k
    JOIN Jabatan j ON k.positionID = j.PositionID
    WHERE k.status_Karyawan = 'Aktif'
  `);

  let created = 0;
  for (const emp of employees) {
    const [exists] = await pool.query(`
      SELECT 1 FROM Gaji WHERE employeeID = ? AND periode = ?
    `, [emp.employeeID, currentPeriod]);

    if (exists.length === 0) {
      const total = parseFloat(emp.gaji_Pokok) + parseFloat(emp.Tunjangan || 0);
      await pool.query(`
        INSERT INTO Gaji (
          employeeID, periode, gaji_Pokok, tunjangan, bonus, potongan, total_Gaji, status_Pembayaran
        ) VALUES (?, ?, ?, ?, 0, 0, ?, 'Belum Lunas')
      `, [emp.employeeID, currentPeriod, emp.gaji_Pokok, emp.Tunjangan, total]);
      created++;
    }
  }
  return { created, isAuto, periode: currentPeriod };
};
