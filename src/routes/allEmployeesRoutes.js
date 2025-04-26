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

        res.render("allEmployees", { employees: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Database error" });
    }
});

router.put('/:employeeId/status', async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { status_Karyawan } = req.body;

        const query = 'UPDATE Karyawan SET status_Karyawan = ? WHERE employeeID = ?';
        await db.query(query, [status_Karyawan, employeeId]);

        res.json({ message: 'Employee status updated successfully' });
    } catch (error) {
        console.error('Failed to update employee status:', error);
        res.status(500).json({ message: 'Failed to update employee status' });
    }
});

export default router;
