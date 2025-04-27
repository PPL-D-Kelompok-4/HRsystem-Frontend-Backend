// routes/profileRoutes.js

import express from "express";

const router = express.Router();

// GET /profile -> render profile.ejs
router.get("/profile", (req, res) => {
	res.render("profile", {
		title: "Profile | HR System",
	});
});

export default router;
