import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const query = `
            SELECT COUNT(*) AS totalEmployees
            FROM Karyawan
        `;
        const [results] = await db.query(query);
        const totalEmployees = results[0].totalEmployees;

        res.render("index", { totalEmployees });
    } catch (error) {
        console.error(error);
        res.status(500).send("Database error");
    }
});

export default router;
