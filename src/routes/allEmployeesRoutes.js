import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
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
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error" });
        }
        res.render("allEmployees", { employees: results }); // ✅ kirim data ke EJS
    });
});

export default router;
