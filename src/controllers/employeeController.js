import pool from '../config/database.js';
import bcrypt from 'bcrypt';

// Get all employees
export const getAllEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT k.*, d.nama_Departemen, j.nama_Jabatan 
      FROM Karyawan k
      LEFT JOIN Departemen d ON k.departmentID = d.departmentID
      LEFT JOIN Jabatan j ON k.positionID = j.PositionID
    `);
    
    // Remove password from response
    const employees = rows.map(emp => {
      const { password, ...employeeWithoutPassword } = emp;
      return employeeWithoutPassword;
    });
    
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT k.*, d.nama_Departemen, j.nama_Jabatan 
      FROM Karyawan k
      LEFT JOIN Departemen d ON k.departmentID = d.departmentID
      LEFT JOIN Jabatan j ON k.positionID = j.PositionID
      WHERE k.employeeID = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Remove password from response
    const { password, ...employeeWithoutPassword } = rows[0];
    
    res.json(employeeWithoutPassword);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new employee
export const createEmployee = async (req, res) => {
  try {
    const { 
      nama, 
      email, 
      no_Telp, 
      password, 
      positionID, 
      departmentID, 
      status_Karyawan,
      tanggal_Bergabung
    } = req.body;
    
    // Validate required fields
    if (!nama || !email || !password || !positionID || !departmentID) {
      return res.status(400).json({ 
        message: 'Name, email, password, position and department are required' 
      });
    }
    
    // Check if email already exists
    const [existingUser] = await pool.query('SELECT * FROM Karyawan WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
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
    
    res.status(201).json({ 
      message: 'Employee created successfully',
      employeeID: result.insertId 
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update employee
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nama, 
      email, 
      no_Telp, 
      password, 
      positionID, 
      departmentID, 
      status_Karyawan,
      tanggal_Bergabung
    } = req.body;
    
    // Check if employee exists
    const [employee] = await pool.query('SELECT * FROM Karyawan WHERE employeeID = ?', [id]);
    if (employee.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Check if email is being changed and if it already exists
    if (email && email !== employee[0].email) {
      const [existingUser] = await pool.query('SELECT * FROM Karyawan WHERE email = ? AND employeeID != ?', [email, id]);
      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
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
    
    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if employee exists
    const [employee] = await pool.query('SELECT * FROM Karyawan WHERE employeeID = ?', [id]);
    if (employee.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Check for related records
    const [attendances] = await pool.query('SELECT COUNT(*) as count FROM Kehadiran WHERE employeeID = ?', [id]);
    const [leaves] = await pool.query('SELECT COUNT(*) as count FROM Cuti WHERE employeeID = ?', [id]);
    const [payrolls] = await pool.query('SELECT COUNT(*) as count FROM Gaji WHERE employeeID = ?', [id]);
    
    if (attendances[0].count > 0 || leaves[0].count > 0 || payrolls[0].count > 0) {
      // Instead of deleting, set status to 'Non-Aktif'
      await pool.query('UPDATE Karyawan SET status_Karyawan = ? WHERE employeeID = ?', ['Non-Aktif', id]);
      return res.json({ 
        message: 'Employee has related records. Status changed to Non-Aktif instead of deletion.' 
      });
    }
    
    // If no related records, proceed with deletion
    const [result] = await pool.query('DELETE FROM Karyawan WHERE employeeID = ?', [id]);
    
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
