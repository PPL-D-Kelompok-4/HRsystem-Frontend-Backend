import pool from '../config/database.js';

// Get all payrolls
export const getAllPayrolls = async (req, res) => {
  try {
    const {
      periode,
      department,
      status,
      search
    } = req.query;

    // Modifikasi SQL untuk menyertakan nama_Jabatan
    let sql = `
      SELECT g.*, 
             k.nama as employee_name, 
             d.nama_Departemen,
             j.nama_Jabatan
      FROM Gaji g
      JOIN Karyawan k ON g.employeeID = k.employeeID
      JOIN Departemen d ON k.departmentID = d.departmentID
      JOIN Jabatan j ON k.positionID = j.PositionID
    `;
    const params = [];

    if (periode) {
      sql += ' AND DATE_FORMAT(g.periode, "%Y-%m") = ?';
      params.push(periode);
    }
    if (department) {
      sql += ' AND d.nama_Departemen = ?';
      params.push(department);
    }
    if (status) {
      sql += ' AND g.status_Pembayaran = ?';
      params.push(status);
    }
    if (search) {
      sql += ' AND k.nama LIKE ?';
      params.push(`%${search}%`);
    }

    sql += ' ORDER BY g.periode DESC';

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching filtered payrolls:', error);
    res.status(500).json({
      message: 'Server error'
    });
  }
};

// Get payroll by ID
export const getPayrollById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT g.*, 
             k.nama AS employee_name, 
             j.nama_Jabatan, 
             d.nama_Departemen
      FROM Gaji g
      JOIN Karyawan k ON g.employeeID = k.employeeID
      JOIN Jabatan j ON k.positionID = j.PositionID
      JOIN Departemen d ON k.departmentID = d.departmentID
      WHERE g.payrollID = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Payroll not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching payroll:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get payrolls by employee ID
export const getPayrollsByEmployeeId = async (req, res) => {
  try {
    const {
      employeeId
    } = req.params;
    const [rows] = await pool.query(`
      SELECT g.*, k.nama as employee_name
      FROM Gaji g
      JOIN Karyawan k ON g.employeeID = k.employeeID
      WHERE g.employeeID = ?
      ORDER BY g.periode DESC
    `, [employeeId]);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching employee payrolls:', error);
    res.status(500).json({
      message: 'Server error'
    });
  }
};

// Create new payroll
export const createPayroll = async (req, res) => {
  try {
    const {
      employeeID,
      periode,
      gaji_Pokok,
      tunjangan,
      bonus,
      potongan,
      status_Pembayaran
    } = req.body;

    if (!employeeID || !periode || !gaji_Pokok) {
      return res.status(400).json({
        message: 'Employee ID, month, year, and base salary are required'
      });
    }

    const [employee] = await pool.query('SELECT * FROM Karyawan WHERE employeeID = ?', [employeeID]);
    if (employee.length === 0) {
      return res.status(404).json({
        message: 'Employee not found'
      });
    }

    const [existingPayroll] = await pool.query(
      'SELECT * FROM Gaji WHERE employeeID = ? AND periode = ?',
      [employeeID, periode]
    );

    if (existingPayroll.length > 0) {
      return res.status(400).json({
        message: 'Payroll already exists for this employee in the specified month and year'
      });
    }

    const tunjanganValue = tunjangan || 0;
    const bonusValue = bonus || 0;
    const potonganValue = potongan || 0;
    const totalGaji = parseFloat(gaji_Pokok) + parseFloat(tunjanganValue) + parseFloat(bonusValue) - parseFloat(potonganValue);

    const [result] = await pool.query(
      `INSERT INTO Gaji (
        employeeID, periode, gaji_Pokok, tunjangan, bonus, potongan, total_Gaji, status_Pembayaran
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employeeID,
        periode,
        gaji_Pokok,
        tunjanganValue,
        bonusValue,
        potonganValue,
        totalGaji,
        status_Pembayaran || 'Belum Lunas'
      ]
    );

    res.status(201).json({
      message: 'Payroll created successfully',
      payrollID: result.insertId
    });
  } catch (error) {
    console.error('Error creating payroll:', error);
    res.status(500).json({
      message: 'Server error'
    });
  }
};

// Update payroll
export const updatePayroll = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const {
      gaji_Pokok,
      tunjangan,
      bonus,
      potongan,
      status_Pembayaran
    } = req.body;

    const [payroll] = await pool.query('SELECT * FROM Gaji WHERE payrollID = ?', [id]);
    if (payroll.length === 0) {
      return res.status(404).json({
        message: 'Payroll not found'
      });
    }

    const updateData = {
      gaji_Pokok: gaji_Pokok || payroll[0].gaji_Pokok,
      tunjangan: tunjangan !== undefined ? tunjangan : payroll[0].tunjangan,
      bonus: bonus !== undefined ? bonus : payroll[0].bonus,
      potongan: potongan !== undefined ? potongan : payroll[0].potongan,
      status_Pembayaran: status_Pembayaran || payroll[0].status_Pembayaran
    };

    updateData.total_Gaji = parseFloat(updateData.gaji_Pokok) +
      parseFloat(updateData.tunjangan) +
      parseFloat(updateData.bonus) -
      parseFloat(updateData.potongan);

    await pool.query(
      `UPDATE Gaji SET 
        gaji_Pokok = ?, 
        tunjangan = ?, 
        bonus = ?, 
        potongan = ?, 
        total_Gaji = ?, 
        status_Pembayaran = ? 
      WHERE payrollID = ?`,
      [
        updateData.gaji_Pokok,
        updateData.tunjangan,
        updateData.bonus,
        updateData.potongan,
        updateData.total_Gaji,
        updateData.status_Pembayaran,
        id
      ]
    );

    res.json({
      message: 'Payroll updated successfully'
    });
  } catch (error) {
    console.error('Error updating payroll:', error);
    res.status(500).json({
      message: 'Server error'
    });
  }
};

// Delete payroll
export const deletePayroll = async (req, res) => {
  try {
    const {
      id
    } = req.params;

    const [result] = await pool.query('DELETE FROM Gaji WHERE payrollID = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Payroll not found'
      });
    }

    res.json({
      message: 'Payroll deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting payroll:', error);
    res.status(500).json({
      message: 'Server error'
    });
  }
};