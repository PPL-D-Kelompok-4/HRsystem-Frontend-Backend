import express from "express";
import db from "../db.js";

const router = express.Router();

// Route utama: Tampilkan dashboard
router.get("/", async (req, res) => {
    try {
        const query = `
      SELECT COUNT(*) AS totalEmployees
      FROM Karyawan
    `;
        const [results] = await db.query(query);
        const totalEmployees = results[0].totalEmployees;

        res.render("index", {
            totalEmployees
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Database error");
    }
});

// API untuk Employee Overview Chart (jumlah karyawan per departemen)
router.get("/api/overview", async (req, res) => {
    try {
        const query = `
        SELECT Departemen.nama_Departemen AS department, COUNT(*) AS total_employees
        FROM Karyawan
        JOIN Departemen ON Karyawan.departmentID = Departemen.departmentID
        GROUP BY Departemen.nama_Departemen
        `;
        const [results] = await db.query(query);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error fetching employee overview"
        });
    }
});

// API untuk Recent Hires (karyawan yang bergabung dalam 30 hari terakhir)
router.get("/api/recenthires", async (req, res) => {
    try {
        const query = `
      SELECT 
        Karyawan.nama, 
        Departemen.nama_Departemen AS department, 
        Jabatan.nama_Jabatan AS position, 
        Karyawan.tanggal_Bergabung
      FROM Karyawan
      JOIN Departemen ON Karyawan.departmentID = Departemen.departmentID
      JOIN Jabatan ON Karyawan.positionID = Jabatan.PositionID
      WHERE Karyawan.tanggal_Bergabung >= CURDATE() - INTERVAL 30 DAY
      ORDER BY Karyawan.tanggal_Bergabung DESC
    `;
        const [results] = await db.query(query);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error fetching recent hires"
        });
    }
});

export default router;