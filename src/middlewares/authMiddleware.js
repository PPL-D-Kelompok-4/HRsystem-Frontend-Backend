import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const authenticate = (req, res, next) => {
	try {
		// Cek token dari cookie atau Authorization header
		const token =
			req.cookies?.token || req.headers.authorization?.split(" ")[1];

		if (!token) {
			return res.status(401).json({ message: "Authentication required" });
		}

		const decoded = jwt.verify(token, config.jwtSecret);
		req.user = decoded;

		// console.log('Decoded User:', decoded);

		next();
	} catch (error) {
		console.error("Authentication error:", error);

		if (error.name === "TokenExpiredError") {
			return res.status(401).json({ message: "Token expired" });
		}

		res.status(401).json({ message: "Invalid token" });
	}
};

// Check if user has admin role
export const isAdmin = (req, res, next) => {
	try {
		// This is a simplified example. In a real application, you would check
		// if the user has admin privileges based on their role or permissions.
		// For now, we'll assume users with positionID 1 are admins.
		if (!req.user) {
			console.warn("Warning: No user found in request. Skipping admin check.");
			return next(); // Jika guest, lanjut saja (untuk testing)
		}

		if (req.user.departmentID !== 1) {
			return res.status(403).json({ message: 'Access restricted to HR Department only' });
		}

		next();
	} catch (error) {
		console.error("Authorization error:", error);
		res.status(500).json({ message: "Server error" });
	}
};
