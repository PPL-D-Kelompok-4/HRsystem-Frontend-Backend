import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const authenticate = (req, res, next) => {
	try {
		// Cek token dari cookie atau Authorization header
		const token =
			req.cookies?.token || req.headers.authorization?.split(" ")[1];

		if (!token) {
			return handleUnauthenticated(req, res);
		}

		const decoded = jwt.verify(token, config.jwtSecret);
		req.user = decoded;

		next();
	} catch (error) {
		console.error("Authentication error:", error);

		return handleUnauthenticated(req, res);
	}
};

// Function khusus untuk handle unauthorized access
const handleUnauthenticated = (req, res) => {
	// Cek apakah client mengharapkan JSON
	if (req.headers.accept && req.headers.accept.includes("application/json")) {
		return res.status(401).json({ message: "Authentication required" });
	} else {
		return res.redirect("/");
	}
};

export const isAdmin = (req, res, next) => {
	try {
		if (!req.user) {
			console.warn("Warning: No user found in request. Skipping admin check.");
			return next(); // Jika guest, lanjut saja (untuk testing)
		}

		if (req.user.departmentID !== 1) {
			return res
				.status(403)
				.json({ message: "Access restricted to HR Department only" });
		}

		next();
	} catch (error) {
		console.error("Authorization error:", error);
		res.status(500).json({ message: "Server error" });
	}
};
