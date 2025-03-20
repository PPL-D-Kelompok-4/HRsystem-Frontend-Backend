import pool from '../config/database.js';

// Get all positions
export const getAllPositions = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Jabatan');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching positions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get position by ID
export const getPositionById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM Jabatan WHERE PositionID = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Position not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching position:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new position
export const createPosition = async (req, res) => {
  try {
    const { nama_Jabatan, gaji_Pokok, Tunjangan } = req.body;
    
    if (!nama_Jabatan || !gaji_Pokok) {
      return res.status(400).json({ 
        message: 'Position name and base salary are required' 
      });
    }
    
    const [result] = await pool.query(
      'INSERT INTO Jabatan (nama_Jabatan, gaji_Pokok, Tunjangan) VALUES (?, ?, ?)',
      [nama_Jabatan, gaji_Pokok, Tunjangan || 0]
    );
    
    res.status(201).json({ 
      message: 'Position created successfully',
      positionID: result.insertId 
    });
  } catch (error) {
    console.error('Error creating position:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update position
export const updatePosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_Jabatan, gaji_Pokok, Tunjangan } = req.body;
    
    // Check if position exists
    const [position] = await pool.query('SELECT * FROM Jabatan WHERE PositionID = ?', [id]);
    if (position.length === 0) {
      return res.status(404).json({ message: 'Position not found' });
    }
    
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
    
    res.json({ message: 'Position updated successfully' });
  } catch (error) {
    console.error('Error updating position:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete position
export const deletePosition = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if position has employees
    const [employees] = await pool.query('SELECT COUNT(*) as count FROM Karyawan WHERE positionID = ?', [id]);
    
    if (employees[0].count > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete position with associated employees' 
      });
    }
    
    const [result] = await pool.query('DELETE FROM Jabatan WHERE PositionID = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Position not found' });
    }
    
    res.json({ message: 'Position deleted successfully' });
  } catch (error) {
    console.error('Error deleting position:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
