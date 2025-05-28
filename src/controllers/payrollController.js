// payrollController.js
import pool from '../config/database.js';
import { format } from 'date-fns';
import PDFDocument from 'pdfkit';

// Get all payrolls (for Manage Salary page)
export const getAllPayrolls = async (req, res) => {
  try {
    const { periode, department, status, search } = req.query;
    let sql = `
      SELECT g.*, 
             k.nama as employee_name, 
             d.nama_Departemen,
             j.nama_Jabatan
      FROM Gaji g
      JOIN Karyawan k ON g.employeeID = k.employeeID
      JOIN Departemen d ON k.departmentID = d.departmentID
      JOIN Jabatan j ON k.positionID = j.PositionID
      WHERE 1=1
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
    sql += ' ORDER BY g.periode DESC, k.nama ASC';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching filtered payrolls:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get payroll by ID (for editing in Manage Salary)
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
    console.error('Error fetching payroll by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get payrolls by employee ID (typically for API, not directly for salary.ejs view)
export const getPayrollsByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const [rows] = await pool.query(`
      SELECT g.*, k.nama as employee_name
      FROM Gaji g
      JOIN Karyawan k ON g.employeeID = k.employeeID
      WHERE g.employeeID = ?
      ORDER BY g.periode DESC
    `, [employeeId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching employee payrolls by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to get and transform payrolls for the salary.ejs view
export const getPayrollsByEmployeeIdForView = async (employeeId) => {
    try {
        const [rows] = await pool.query(`
            SELECT g.payrollID,
                   g.periode, 
                   g.total_Gaji, 
                   g.status_Pembayaran,
                   g.gaji_Pokok,
                   g.tunjangan,
                   g.bonus,
                   g.potongan
            FROM Gaji g
            WHERE g.employeeID = ?
            ORDER BY g.periode DESC
        `, [employeeId]);

        return rows.map(slip => {
            const periodeDate = new Date(slip.periode);
            return {
                payrollID: slip.payrollID,
                period: format(periodeDate, "MMM\u00a0yyyy"),
                issueDate: format(periodeDate, "yyyy-MM-dd"),
                netPay: 'Rp' + Number(slip.total_Gaji).toLocaleString('id-ID'),
                status: slip.status_Pembayaran === 'Lunas' ? 'Paid' : 'Pending',
                gaji_Pokok: 'Rp' + Number(slip.gaji_Pokok).toLocaleString('id-ID'),
                tunjangan: 'Rp' + Number(slip.tunjangan).toLocaleString('id-ID'),
                bonus: 'Rp' + Number(slip.bonus).toLocaleString('id-ID'),
                potongan: 'Rp' + Number(slip.potongan).toLocaleString('id-ID'),
                total_Gaji_raw: slip.total_Gaji
            };
        });
    } catch (error) {
        console.error('Error fetching employee payrolls for view:', error);
        throw error;
    }
};

// Function to download all user payrolls as PDF
export const downloadAllUserPayrollsPDF = async (req, res) => {
    try {
        const employeeId = req.user.id;
        const year = req.query.year || new Date().getFullYear().toString();

        const [employeeDetailsRows] = await pool.query(`
            SELECT k.nama, k.employeeID AS nik, j.nama_Jabatan, d.nama_Departemen
            FROM Karyawan k
            JOIN Jabatan j ON k.positionID = j.PositionID
            JOIN Departemen d ON k.departmentID = d.departmentID
            WHERE k.employeeID = ?
        `, [employeeId]);

        if (employeeDetailsRows.length === 0) {
            return res.status(404).send('Employee not found.');
        }
        const employeeDetail = employeeDetailsRows[0];

        const [paySlipRows] = await pool.query(`
            SELECT 
                periode, gaji_Pokok, tunjangan, bonus, potongan, total_Gaji, status_Pembayaran
            FROM Gaji
            WHERE employeeID = ? AND YEAR(periode) = ?
            ORDER BY periode ASC
        `, [employeeId, year]);

        if (paySlipRows.length === 0) {
            return res.status(404).type('text/html').send(`No payslips found for <strong>${employeeDetail.nama}</strong> in year <strong>${year}</strong>. <a href="/salary">Go back</a>`);
        }

        const doc = new PDFDocument({ margin: 40, size: 'A4' });
        
        const fileName = `Payslips_${employeeDetail.nama.replace(/\s+/g, '_')}_${year}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        doc.pipe(res);

        doc.fontSize(16).text('Laporan Slip Gaji Karyawan', { align: 'center' });
        doc.fontSize(12).text(`Tahun: ${year}`, { align: 'center' });
        doc.moveDown(1.5);

        doc.fontSize(10).font('Helvetica-Bold');
        doc.text(`Nama Karyawan: ${employeeDetail.nama}`);
        doc.text(`ID: ${employeeDetail.nik || employeeId}`);
        doc.text(`Jabatan: ${employeeDetail.nama_Jabatan}`);
        doc.text(`Departemen: ${employeeDetail.nama_Departemen}`);
        doc.moveDown(1);

        const tableTop = doc.y;
        const cellPadding = 5;
        const colWidths = [70, 75, 75, 75, 75, 85, 55]; 
        const headers = ['Periode', 'G. Pokok', 'Tunjangan', 'Bonus', 'Potongan', 'Total Gaji', 'Status'];
        
        doc.font('Helvetica-Bold');
        let currentXheader = doc.page.margins.left;
        headers.forEach((header, i) => {
            doc.text(header, currentXheader, tableTop, { width: colWidths[i], align: i > 0 ? 'right' : 'left' });
            currentXheader += colWidths[i] + cellPadding;
        });
        doc.moveDown(0.5);
        
        doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
        doc.moveDown(0.5);
        
        doc.font('Helvetica');

        const formatCurrencyPDF = (num) => Number(num || 0).toLocaleString('id-ID');

        paySlipRows.forEach((slip) => {
            if (doc.y > doc.page.height - (doc.page.margins.bottom + 20) ) {
                doc.addPage();
                doc.y = doc.page.margins.top;
            }
            
            let currentXrow = doc.page.margins.left;
            const rowY = doc.y;

            doc.fontSize(9);

            doc.text(format(new Date(slip.periode), "MMM\u00a0yyyy"), currentXrow, rowY, { width: colWidths[0], align: 'left' });
            currentXrow += colWidths[0] + cellPadding;
            doc.text(formatCurrencyPDF(slip.gaji_Pokok), currentXrow, rowY, { width: colWidths[1], align: 'right' });
            currentXrow += colWidths[1] + cellPadding;
            doc.text(formatCurrencyPDF(slip.tunjangan), currentXrow, rowY, { width: colWidths[2], align: 'right' });
            currentXrow += colWidths[2] + cellPadding;
            doc.text(formatCurrencyPDF(slip.bonus), currentXrow, rowY, { width: colWidths[3], align: 'right' });
            currentXrow += colWidths[3] + cellPadding;
            doc.text(formatCurrencyPDF(slip.potongan), currentXrow, rowY, { width: colWidths[4], align: 'right' });
            currentXrow += colWidths[4] + cellPadding;
            doc.text(formatCurrencyPDF(slip.total_Gaji), currentXrow, rowY, { width: colWidths[5], align: 'right' });
            currentXrow += colWidths[5] + cellPadding;
            doc.text(slip.status_Pembayaran, currentXrow, rowY, { width: colWidths[6], align: 'left' });
            
            doc.moveDown(0.5); 
            doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
            doc.moveDown(0.5);
        });
        
        const pageCount = doc.bufferedPageRange().count;
        for (let i = 0; i < pageCount; i++) {
            doc.switchToPage(i);
            doc.fontSize(8).text(`Halaman ${i + 1} dari ${pageCount}`, 
                doc.page.margins.left, 
                doc.page.height - doc.page.margins.bottom + 10, 
                {align: 'center', width: doc.page.width - doc.page.margins.left - doc.page.margins.right }
            );
        }
        doc.end();

    } catch (error) {
        console.error('Error generating all payslips PDF:', error); // Tetap log error utama
        if (!res.headersSent) {
            res.status(500).send('Error generating PDF report.');
        }
    }
};


// Create new payroll
export const createPayroll = async (req, res) => {
  try {
    const { employeeID, periode, gaji_Pokok, tunjangan, bonus, potongan, status_Pembayaran } = req.body;
    if (!employeeID || !periode || gaji_Pokok === undefined) {
      return res.status(400).json({ message: 'Employee ID, periode, and base salary (gaji_Pokok) are required' });
    }
    const [employee] = await pool.query('SELECT * FROM Karyawan WHERE employeeID = ?', [employeeID]);
    if (employee.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    const [existingPayroll] = await pool.query(
      'SELECT * FROM Gaji WHERE employeeID = ? AND periode = ?',
      [employeeID, periode]
    );
    if (existingPayroll.length > 0) {
      return res.status(400).json({ message: 'Payroll already exists for this employee in the specified periode' });
    }

    const tunjanganValue = tunjangan !== undefined ? parseFloat(tunjangan) : 0;
    const bonusValue = bonus !== undefined ? parseFloat(bonus) : 0;
    const potonganValue = potongan !== undefined ? parseFloat(potongan) : 0;
    const baseSalaryValue = parseFloat(gaji_Pokok);

    const totalGaji = baseSalaryValue + tunjanganValue + bonusValue - potonganValue;

    const [result] = await pool.query(
      `INSERT INTO Gaji (employeeID, periode, gaji_Pokok, tunjangan, bonus, potongan, total_Gaji, status_Pembayaran) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [employeeID, periode, baseSalaryValue, tunjanganValue, bonusValue, potonganValue, totalGaji, status_Pembayaran || 'Belum Lunas']
    );
    res.status(201).json({ message: 'Payroll created successfully', payrollID: result.insertId });
  } catch (error) {
    console.error('Error creating payroll:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update payroll
export const updatePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const { gaji_Pokok, tunjangan, bonus, potongan, status_Pembayaran } = req.body;

    const [payrollRows] = await pool.query('SELECT * FROM Gaji WHERE payrollID = ?', [id]);
    if (payrollRows.length === 0) {
      return res.status(404).json({ message: 'Payroll not found' });
    }
    const currentPayroll = payrollRows[0];

    const updateData = {
      gaji_Pokok: gaji_Pokok !== undefined ? parseFloat(gaji_Pokok) : parseFloat(currentPayroll.gaji_Pokok),
      tunjangan: tunjangan !== undefined ? parseFloat(tunjangan) : parseFloat(currentPayroll.tunjangan),
      bonus: bonus !== undefined ? parseFloat(bonus) : parseFloat(currentPayroll.bonus),
      potongan: potongan !== undefined ? parseFloat(potongan) : parseFloat(currentPayroll.potongan),
      status_Pembayaran: status_Pembayaran !== undefined ? status_Pembayaran : currentPayroll.status_Pembayaran
    };

    updateData.total_Gaji = updateData.gaji_Pokok + updateData.tunjangan + updateData.bonus - updateData.potongan;

    await pool.query(
      `UPDATE Gaji SET 
        gaji_Pokok = ?, tunjangan = ?, bonus = ?, potongan = ?, 
        total_Gaji = ?, status_Pembayaran = ? 
       WHERE payrollID = ?`,
      [
        updateData.gaji_Pokok, updateData.tunjangan, updateData.bonus,
        updateData.potongan, updateData.total_Gaji, updateData.status_Pembayaran,
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