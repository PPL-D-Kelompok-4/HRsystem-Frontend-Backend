import jwt from "jsonwebtoken";
import config from "../config/config.js"; //
import logger from "../utils/logger.js"; // Tambahkan ini jika Anda ingin menggunakan logger kustom Anda

export const authenticate = (req, res, next) => {
	// Logging untuk mengetahui path yang diminta
	// console.log(`[AuthMiddleware] Authenticating request for: ${req.method} ${req.originalUrl}`);
	logger.info(
		`[AuthMiddleware] Authenticating request for: ${req.method} ${req.originalUrl}`
	);

	try {
		const tokenFromCookie = req.cookies?.token;
		const authHeader = req.headers.authorization;
		let token = null;

		if (tokenFromCookie) {
			// console.log("[AuthMiddleware] Token found in cookie:", tokenFromCookie);
			logger.info("[AuthMiddleware] Token found in cookie."); // Jangan log tokennya langsung untuk keamanan
			token = tokenFromCookie;
		} else if (authHeader && authHeader.startsWith("Bearer ")) {
			token = authHeader.split(" ")[1];
			// console.log("[AuthMiddleware] Token found in Authorization header:", token);
			logger.info("[AuthMiddleware] Token found in Authorization header.");
		} else {
			// console.log("[AuthMiddleware] No token found in cookies or Authorization header.");
			logger.warn(
				"[AuthMiddleware] No token found in cookies or Authorization header."
			);
		}

		// Untuk debugging, tampilkan semua cookies yang diterima server
		// console.log("[AuthMiddleware] All received cookies:", JSON.stringify(req.cookies));
		logger.debug(
			`[AuthMiddleware] All received cookies: ${JSON.stringify(req.cookies)}`
		);

		if (!token) {
			// console.log("[AuthMiddleware] Token is missing. Redirecting to login.");
			logger.warn("[AuthMiddleware] Token is missing. Redirecting to login.");
			return handleUnauthenticated(req, res);
		}

		// console.log("[AuthMiddleware] Attempting to verify token...");
		logger.info("[AuthMiddleware] Attempting to verify token...");
		const decoded = jwt.verify(token, config.jwtSecret); //
		// console.log("[AuthMiddleware] Token verified successfully. Decoded:", decoded);
		logger.info(
			`[AuthMiddleware] Token verified successfully for user ID: ${decoded.id}`
		);
		req.user = decoded; //

		next();
	} catch (error) {
		// console.error("[AuthMiddleware] Authentication error:", error.message);
		logger.error(`[AuthMiddleware] Authentication error: ${error.message}`);
		if (error.name === "JsonWebTokenError") {
			// console.error("[AuthMiddleware] JWT Error Details:", error);
			logger.error(
				`[AuthMiddleware] JWT Error: ${error.name} - ${error.message}`
			);
		} else if (error.name === "TokenExpiredError") {
			// console.error("[AuthMiddleware] Token Expired Details:", error);
			logger.error(
				`[AuthMiddleware] JWT Token Expired: ${error.name} - ${error.message} at ${error.expiredAt}`
			);
		}
		return handleUnauthenticated(req, res);
	}
};

const handleUnauthenticated = (req, res) => {
	//
	// console.log(`[AuthMiddleware] Handling unauthenticated request for ${req.originalUrl}. Accept header: ${req.headers.accept}`);
	logger.info(
		`[AuthMiddleware] Handling unauthenticated request for ${req.originalUrl}. Accept header: ${req.headers.accept}`
	);
	if (req.headers.accept && req.headers.accept.includes("application/json")) {
		//
		// console.log("[AuthMiddleware] Responding with 401 JSON.");
		logger.info("[AuthMiddleware] Responding with 401 JSON.");
		return res.status(401).json({ message: "Authentication required" }); //
	} else {
		// console.log("[AuthMiddleware] Redirecting to /login.");
		logger.info("[AuthMiddleware] Redirecting to /login.");
		return res.redirect("/login"); //
	}
};

export const isAdmin = (req, res, next) => {
	//
	try {
		if (!req.user) {
			//
			// console.warn("[AuthMiddleware-isAdmin] Warning: No user found in request. This should not happen if authenticate runs first.");
			logger.warn(
				"[AuthMiddleware-isAdmin] No user found in request. This might indicate an issue if 'authenticate' middleware should have run first."
			);
			return res
				.status(403)
				.json({ message: "User not authenticated for admin check" });
		}

		// console.log(`[AuthMiddleware-isAdmin] Checking admin status for user departmentID: ${req.user.departmentID}`);
		logger.info(
			`[AuthMiddleware-isAdmin] Checking admin status for user departmentID: ${req.user.departmentID}`
		);
		if (req.user.departmentID !== 1) {
			//
			// console.warn("[AuthMiddleware-isAdmin] Access denied. User is not HR.");
			logger.warn("[AuthMiddleware-isAdmin] Access denied. User is not HR.");
			return res
				.status(403)
				.json({ message: "Access restricted to HR Department only" }); //
		}
		// console.log("[AuthMiddleware-isAdmin] Admin access granted.");
		logger.info("[AuthMiddleware-isAdmin] Admin access granted.");
		next();
	} catch (error) {
		// console.error("[AuthMiddleware-isAdmin] Authorization error:", error);
		logger.error(
			`[AuthMiddleware-isAdmin] Authorization error: ${error.message}`
		);
		res.status(500).json({ message: "Server error during admin check" }); //
	}
};
