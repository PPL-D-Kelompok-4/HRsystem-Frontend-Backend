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
		return res.redirect("/login");
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

export const canViewAllPayrolls = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }
    // Izinkan jika departmentID adalah 1 (HR) atau 2 (Finance)
    if (req.user.departmentID === 2) {
      next();
    } else {
      return res.status(403).json({ message: "Access restricted to Finance departments only." });
    }
  } catch (error) {
    console.error("Authorization error (canViewAllPayrolls):", error);
    res.status(500).json({ message: "Server error during authorization" });
  }
};

export const isFinanceOnly = (req, res, next) => {
  try {
    if (!req.user) {
      // Seharusnya sudah ditangani oleh 'authenticate'
      return res.status(401).json({ message: "Authentication required." });
    }
    // Hanya izinkan jika departmentID adalah 2 (Finance)
    if (req.user.departmentID === 2) {
      next();
    } else {
      return res.status(403).json({ message: "This action is restricted to the Finance department only." });
    }
  } catch (error) {
    console.error("Authorization error (isFinanceOnly):", error);
    res.status(500).json({ message: "Server error during authorization" });
  }
};
