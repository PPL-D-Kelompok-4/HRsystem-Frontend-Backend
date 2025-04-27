import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const query = `
            SELECT 
                Karyawan.employeeID AS id,
                Karyawan.nama,
                Karyawan.email,
                Departemen.nama_Departemen AS department,
                Jabatan.nama_Jabatan AS position,
                Karyawan.status_Karyawan
            FROM Karyawan
            JOIN Jabatan ON Karyawan.positionID = Jabatan.PositionID
            JOIN Departemen ON Karyawan.departmentID = Departemen.departmentID
        `;
        const [results] = await db.query(query);

        res.render("allEmployees", { employees: results, title: "HR System" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Database error" });
    }
});

router.put('/:employeeId/status', async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { status_Karyawan } = req.body;

        const [result] = await db.query('UPDATE Karyawan SET status_Karyawan = ? WHERE employeeID = ?', [status_Karyawan, employeeId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Employee not found or no change made" });
        }

        res.status(200).json({ message: 'Employee status updated successfully' });
    } catch (error) {
        console.error('Failed to update employee status:', error);
        res.status(500).json({ message: 'Failed to update employee status', error: error.message });
    }
});


router.get('/edit/:employeeId', async (req, res) => {
    try {
        const { employeeId } = req.params;

        const [employeeResult] = await db.query(
            `SELECT 
                Karyawan.employeeID AS id,
                Karyawan.nama,
                Karyawan.email,
                Karyawan.no_Telp,
                Departemen.nama_Departemen AS department,
                Jabatan.nama_Jabatan AS position,
                Karyawan.tanggal_Bergabung
            FROM Karyawan
            JOIN Jabatan ON Karyawan.positionID = Jabatan.PositionID
            JOIN Departemen ON Karyawan.departmentID = Departemen.departmentID
            WHERE Karyawan.employeeID = ?`,
            [employeeId]
        );

        if (employeeResult.length === 0) {
            return res.status(404).send("Employee not found");
        }

        const employee = employeeResult[0];

        // Pecah nama jadi firstName dan lastName kasar (misal by spasi)
        const nameParts = employee.nama.split(' ');
        employee.firstName = nameParts[0];
        employee.lastName = nameParts.slice(1).join(' ');

        res.render("addEmployee", { 
            mode: "edit", 
            employee 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

router.post('/edit/:employeeId', async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { firstName, lastName, email, phone, department, position, startDate } = req.body;

        const fullName = `${firstName} ${lastName}`;

        const [deptResult] = await db.query(
            "SELECT departmentID FROM Departemen WHERE nama_Departemen = ?",
            [department]
        );

        const [posResult] = await db.query(
            "SELECT PositionID FROM Jabatan WHERE nama_Jabatan = ?",
            [position]
        );

        await db.query(
            `UPDATE Karyawan SET 
                nama = ?, 
                email = ?, 
                no_Telp = ?, 
                positionID = ?, 
                departmentID = ?, 
                tanggal_Bergabung = ?
            WHERE employeeID = ?`,
            [fullName, email, phone, posResult[0].PositionID, deptResult[0].departmentID, startDate, employeeId]
        );

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to update employee");
    }
});

router.delete('/:employeeId', async (req, res) => {
    try {
        const { employeeId } = req.params;
        await db.query('DELETE FROM Karyawan WHERE employeeID = ?', [employeeId]);
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Failed to delete employee:', error);
        res.status(500).json({ message: 'Failed to delete employee' });
    }
});

export default router;
