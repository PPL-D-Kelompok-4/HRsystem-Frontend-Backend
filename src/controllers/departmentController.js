import pool from '../config/database.js';

// Get all departments
export const getAllDepartments = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Departemen');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get department by ID
export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM Departemen WHERE departmentID = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new department
export const createDepartment = async (req, res) => {
  try {
    const { nama_Departemen } = req.body;
    
    if (!nama_Departemen) {
      return res.status(400).json({ message: 'Department name is required' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO Departemen (nama_Departemen) VALUES (?)',
      [nama_Departemen]
    );
    
    res.status(201).json({ 
      message: 'Department created successfully',
      departmentID: result.insertId 
    });
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update department
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_Departemen } = req.body;
    
    if (!nama_Departemen) {
      return res.status(400).json({ message: 'Department name is required' });
    }
    
    const [result] = await pool.query(
      'UPDATE Departemen SET nama_Departemen = ? WHERE departmentID = ?',
      [nama_Departemen, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    res.json({ message: 'Department updated successfully' });
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete department
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if department has employees
    const [employees] = await pool.query('SELECT COUNT(*) as count FROM Karyawan WHERE departmentID = ?', [id]);
    
    if (employees[0].count > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete department with associated employees' 
      });
    }
    
    const [result] = await pool.query('DELETE FROM Departemen WHERE departmentID = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
