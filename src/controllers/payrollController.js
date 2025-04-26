import pool from '../config/database.js';

// Get all payrolls
export const getAllPayrolls = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT g.*, k.nama as employee_name
      FROM Gaji g
      JOIN Karyawan k ON g.employeeID = k.employeeID
      ORDER BY g.tahun DESC, g.bulan DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching payrolls:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get payroll by ID
export const getPayrollById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT g.*, k.nama as employee_name
      FROM Gaji g
      JOIN Karyawan k ON g.employeeID = k.employeeID
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
    const { employeeId } = req.params;
    const [rows] = await pool.query(`
      SELECT g.*, k.nama as employee_name
      FROM Gaji g
      JOIN Karyawan k ON g.employeeID = k.employeeID
      WHERE g.employeeID = ?
      ORDER BY g.tahun DESC, g.bulan DESC
    `, [employeeId]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching employee payrolls:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new payroll
export const createPayroll = async (req, res) => {
  try {
    const { 
      employeeID, 
      bulan, 
      tahun, 
      gaji_Pokok, 
      tunjangan, 
      potongan, 
      status_Pembayaran 
    } = req.body;
    
    // Validate required fields
    if (!employeeID || !bulan || !tahun || !gaji_Pokok) {
      return res.status(400).json({ 
        message: 'Employee ID, month, year, and base salary are required' 
      });
    }
    
    // Check if employee exists
    const [employee] = await pool.query('SELECT * FROM Karyawan WHERE employeeID = ?', [employeeID]);
    if (employee.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Check if payroll already exists for this employee in the given month/year
    const [existingPayroll] = await pool.query(
      'SELECT * FROM Gaji WHERE employeeID = ? AND bulan = ? AND tahun = ?',
      [employeeID, bulan, tahun]
    );
    
    if (existingPayroll.length > 0) {
      return res.status(400).json({ 
        message: 'Payroll already exists for this employee in the specified month and year' 
      });
    }
    
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
    
    res.status(201).json({ 
      message: 'Payroll created successfully',
      payrollID: result.insertId 
    });
  } catch (error) {
    console.error('Error creating payroll:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update payroll
export const updatePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      gaji_Pokok, 
      tunjangan, 
      potongan, 
      status_Pembayaran 
    } = req.body;
    
    // Check if payroll exists
    const [payroll] = await pool.query('SELECT * FROM Gaji WHERE payrollID = ?', [id]);
    if (payroll.length === 0) {
      return res.status(404).json({ message: 'Payroll not found' });
    }
    
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
    
    res.json({ message: 'Payroll updated successfully' });
  } catch (error) {
    console.error('Error updating payroll:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete payroll
export const deletePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query('DELETE FROM Gaji WHERE payrollID = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Payroll not found' });
    }
    
    res.json({ message: 'Payroll deleted successfully' });
  } catch (error) {
    console.error('Error deleting payroll:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
