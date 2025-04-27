// loginRoutes.js

import express from "express";

const router = express.Router();

// GET /login -> render login.ejs
router.get("/login", (req, res) => {
	res.render("login", {
		title: "Login | HR System",
		showSidebar: false,
	});
});

export default router;
