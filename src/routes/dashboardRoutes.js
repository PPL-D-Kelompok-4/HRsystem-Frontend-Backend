import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
    const query = `
        SELECT COUNT(*) totalEmployees
        FROM Karyawan
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).send("Database error");

        const totalEmployees = results[0].totalEmployees;
        res.render("index", { totalEmployees });
    });
});

// router.get("/karyawan", (req, res) => {
//     const query = `

//         SELECT K.*, J.nama_Jabatan, D.nama_Departemen
//         FROM Karyawan K
//         JOIN Jabatan J ON K.positionID = J.PositionID
//         JOIN Departemen D ON K.departmentID = D.departmentID
//     `;
//     db.query(query, (err, results) => {
//         if (err) return res.status(500).send("Database error");

//         res.render("index", { karyawan: results });
//     });
// });

export default router;