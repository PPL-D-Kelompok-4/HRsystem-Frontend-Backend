import express from "express";
import db from "../db.js";

const router = express.Router();

// function untuk generate random password
function generateRandomPassword(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// route GET tampilkan form
router.get("/", (req, res) => {
    res.render("addEmployee", { mode: "add", employee: null, title: "HR System" });
});

// route POST simpan ke database
router.post("/", async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            department,
            position,
            startDate
        } = req.body;

        const fullName = `${firstName} ${lastName}`;
        const password = generateRandomPassword();

        // Cari departmentID
        const [deptResult] = await db.query(
            "SELECT departmentID FROM Departemen WHERE nama_Departemen = ?",
            [department]
        );

        if (deptResult.length === 0) {
            return res.status(400).json({ message: "Department not found" });
        }

        const departmentID = deptResult[0].departmentID;

        // Cari positionID
        const [posResult] = await db.query(
            "SELECT PositionID FROM Jabatan WHERE nama_Jabatan = ?",
            [position]
        );

        if (posResult.length === 0) {
            return res.status(400).json({ message: "Position not found" });
        }

        const positionID = posResult[0].PositionID;

        // Insert employee
        await db.query(
            `INSERT INTO Karyawan (nama, email, no_Telp, password, positionID, departmentID, status_Karyawan, tanggal_Bergabung)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [fullName, email, phone, password, positionID, departmentID, 'Aktif', startDate]
        );

        res.status(200).json({ email, password });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;
