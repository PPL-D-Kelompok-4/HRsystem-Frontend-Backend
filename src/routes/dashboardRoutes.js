import express from "express";
import db from "../db.js";

const router = express.Router();

// Route utama: Tampilkan dashboard
router.get("/", async (req, res) => {
    try {
        const [employeeResult] = await db.query(`
            SELECT COUNT(*) AS totalEmployees FROM Karyawan
        `);

        const [pendingLeavesResult] = await db.query(`
            SELECT 
                c.leaveID,
                k.nama AS employee,
                DATE_FORMAT(c.tanggal_Mulai, '%Y-%m-%d') AS startDate,
                DATE_FORMAT(c.tanggal_Selesai, '%Y-%m-%d') AS endDate,
                c.keterangan_Cuti AS reason
            FROM 
                Cuti c
            JOIN 
                Karyawan k ON c.employeeID = k.employeeID
            WHERE 
                c.status = 'Diajukan'
            ORDER BY 
                c.tanggal_Pengajuan DESC
        `);

        const totalEmployees = employeeResult[0].totalEmployees;
        const pendingLeaves = pendingLeavesResult;

        res.render("index", {
            totalEmployees,
            pendingLeaves // ✅ Kirim pending leaves ke view
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Database error");
    }
});

// API untuk Employee Overview Chart
router.get("/api/overview", async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT Departemen.nama_Departemen AS department, COUNT(*) AS total_employees
            FROM Karyawan
            JOIN Departemen ON Karyawan.departmentID = Departemen.departmentID
            GROUP BY Departemen.nama_Departemen
        `);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching employee overview" });
    }
});

// API untuk Recent Hires
router.get("/api/recenthires", async (req, res) => {
    try {
        const [results] = await db.query(`
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
        `);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching recent hires" });
    }
});

// API untuk Dashboard Stats (Pending Reviews dan Leave Requests)
router.get("/api/dashboardstats", async (req, res) => {
    try {
        
        const [employeeResult] = await db.query(`SELECT COUNT(*) AS totalEmployees FROM Karyawan`);
        const [leaveResult] = await db.query(`SELECT COUNT(*) AS totalLeaveRequests FROM Cuti`);
        const [pendingResult] = await db.query(`SELECT COUNT(*) AS pendingLeaves FROM Cuti WHERE status = 'Diajukan'`);

        res.json({
            totalEmployees: employeeResult[0].totalEmployees,
            totalLeaveRequests: leaveResult[0].totalLeaveRequests,
            pendingLeaves: pendingResult[0].pendingLeaves,
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Error fetching dashboard statistics" });
    }
});


export default router;
