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

export default router;