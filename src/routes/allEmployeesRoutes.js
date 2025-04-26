import express from "express";
import db from "../db.js";

const router = express.Router();

router.get('/allemployees', (req, res) => {
    res.render('allEmployees');
});

// router.get("/allemployees", (req, res) => {
//     const query = `
//         SELECT K.* from Karyawan
//     `;
//     db.query(query, (err, results) => {
//         if (err) return res.status(500).send("Database error");
//         res.send(results);
//     });
// });

// router.get("/allemployees/:id", (req, res) => {
//     const { id } = req.params;
//     const query = `
//         SELECT K.* from Karyawan K
//         WHERE K.id = ${id}
//     `;
//     db.query(query, (err, results) => {
//         if (err) return res.status(500).send("Database error");
//         res.render("allEmployees", {
//             userProfile
//         });
//     });
// });

export default router;