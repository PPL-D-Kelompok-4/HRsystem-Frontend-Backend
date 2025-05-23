import jwt from "jsonwebtoken";
import pool from "../config/database.js"; //
import config from "../config/config.js"; //
import logger from "../utils/logger.js";

// Login
export const login = async (req, res) => {
	//
	// console.log("[AuthController-login] Login attempt for email:", req.body.email);
	logger.info(
		`[AuthController-login] Login attempt for email: ${req.body.email}`
	);
	try {
		const { email, password } = req.body; //

		if (!email || !password) {
			//
			// console.log("[AuthController-login] Email or password missing.");
			logger.warn("[AuthController-login] Email or password missing.");
			return res
				.status(400)
				.json({ message: "Email and password are required" }); //
		}

		const [rows] = await pool.query("SELECT * FROM Karyawan WHERE email = ?", [
			//
			email,
		]);

		if (rows.length === 0) {
			//
			// console.log("[AuthController-login] User not exist:", email);
			logger.warn(`[AuthController-login] User not exist: ${email}`);
			return res.status(401).json({ message: "User Not Exist" }); //
		}

		const user = rows[0]; //

		if (user.status_Karyawan == "Inaktif") {
			//
			// console.log("[AuthController-login] Account inactive:", email);
			logger.warn(`[AuthController-login] Account inactive: ${email}`);
			return res.status(401).json({ message: "Account is inactive" }); //
		}

		if (user.password !== password) {
			//
			// console.log("[AuthController-login] Wrong password for:", email);
			logger.warn(`[AuthController-login] Wrong password for: ${email}`);
			return res.status(401).json({ message: "Wrong Password" }); //
		}

		const tokenPayload = {
			id: user.employeeID, //
			email: user.email, //
			name: user.nama, //
			departmentID: user.departmentID, //
			positionID: user.positionID, //
		};
		// console.log("[AuthController-login] Generating token with payload:", tokenPayload);
		// console.log("[AuthController-login] JWT Secret used:", config.jwtSecret ? "Exists" : "MISSING!"); //
		// console.log("[AuthController-login] JWT ExpiresIn:", config.jwtExpiresIn); //
		logger.info(
			`[AuthController-login] Generating token for user ID: ${
				user.employeeID
			}. JWT Secret: ${config.jwtSecret ? "Exists" : "MISSING!"}, ExpiresIn: ${
				config.jwtExpiresIn
			}`
		);

		const token = jwt.sign(
			tokenPayload,
			config.jwtSecret, //
			{ expiresIn: config.jwtExpiresIn } //
		);

		const cookieOptions = {
			httpOnly: true, //
			// PENTING: Untuk Railway dan proxy HTTPS, 'secure' HARUS true di produksi.
			// Jika NODE_ENV tidak 'production' atau req.secure false (karena proxy belum dipercaya), cookie secure tidak akan dikirim kembali oleh browser.
			secure: process.env.NODE_ENV === "production" && req.secure,
			// sameSite: "lax", // 'lax' adalah default yang baik.
			// Coba 'None' untuk diagnosis, tapi ini memerlukan 'secure:true' dan bisa memiliki implikasi keamanan jika tidak hati-hati.
			// Untuk Railway yang kemungkinan besar domainnya berbeda antara frontend dan backend API (jika dipisah), 'None' mungkin relevan.
			// Namun, karena ini aplikasi full-stack terintegrasi, 'lax' seharusnya cukup.
			sameSite: process.env.NODE_ENV === "production" ? "lax" : "lax", // Tetap 'lax' atau coba 'None' HANYA JIKA secure: true
			maxAge: 24 * 60 * 60 * 1000, //
			path: "/", // Eksplisitkan path
			// domain: '.yourrailwayappdomain.com' // HANYA JIKA Railway menggunakan subdomain yang berbeda dan Anda tahu domainnya. Biasanya tidak perlu.
		};

		if (cookieOptions.sameSite === "None" && !cookieOptions.secure) {
			// console.warn("[AuthController-login] sameSite: 'None' requires secure: true. Overriding secure to true for sameSite: 'None'.");
			logger.warn(
				"[AuthController-login] sameSite: 'None' requires secure: true. Overriding secure to true for sameSite: 'None'."
			);
			// cookieOptions.secure = true; // Ini mungkin tidak diinginkan jika NODE_ENV bukan production
		}

		// console.log("[AuthController-login] Setting cookie with options:", cookieOptions);
		logger.info(
			`[AuthController-login] Setting cookie with options: ${JSON.stringify(
				cookieOptions
			)}`
		);
		res.cookie("token", token, cookieOptions); //

		const { password: _, ...userWithoutPassword } = user; //

		// console.log("[AuthController-login] Login successful for:", email);
		logger.info(`[AuthController-login] Login successful for: ${email}`);
		res.json({
			message: "Login successful", //
			token, //
			user: userWithoutPassword, //
		});
	} catch (error) {
		// console.error("[AuthController-login] Error during login:", error);
		logger.error(
			`[AuthController-login] Error during login: ${error.message}`,
			error
		);
		res.status(500).json({ message: "Server error" }); //
	}
};

// Get current user
export const getCurrentUser = async (req, res) => {
	//
	// console.log("[AuthController-getCurrentUser] Attempting to get current user. User from middleware:", req.user);
	logger.info(
		`[AuthController-getCurrentUser] Attempting to get current user for ID: ${req.user?.id}`
	);
	try {
		const userId = req.user.id; //

		const [rows] = await pool.query(
			//
			`
      SELECT k.*, d.nama_Departemen, j.nama_Jabatan 
      FROM Karyawan k
      LEFT JOIN Departemen d ON k.departmentID = d.departmentID
      LEFT JOIN Jabatan j ON k.positionID = j.PositionID
      WHERE k.employeeID = ?
    `,
			[userId]
		);

		if (rows.length === 0) {
			//
			// console.log("[AuthController-getCurrentUser] User not found for ID:", userId);
			logger.warn(
				`[AuthController-getCurrentUser] User not found for ID: ${userId}`
			);
			return res.status(404).json({ message: "User not found" }); //
		}
		const { password: _, ...userWithoutPassword } = rows[0];
		// console.log("[AuthController-getCurrentUser] Successfully fetched user:", userWithoutPassword.email);
		logger.info(
			`[AuthController-getCurrentUser] Successfully fetched user: ${userWithoutPassword.email}`
		);
		res.json(userWithoutPassword); //
	} catch (error) {
		// console.error("[AuthController-getCurrentUser] Error fetching current user:", error);
		logger.error(
			`[AuthController-getCurrentUser] Error fetching current user: ${error.message}`,
			error
		);
		res.status(500).json({ message: "Server error" }); //
	}
};

// Change password (direct plaintext)
export const changePassword = async (req, res) => {
	//
	// console.log("[AuthController-changePassword] Change password attempt for user ID:", req.user.id);
	logger.info(
		`[AuthController-changePassword] Change password attempt for user ID: ${req.user.id}`
	);
	try {
		const userId = req.user.id; //
		const { currentPassword, newPassword } = req.body; //

		if (!currentPassword || !newPassword) {
			//
			// console.log("[AuthController-changePassword] Current or new password missing.");
			logger.warn(
				"[AuthController-changePassword] Current or new password missing."
			);
			return res.status(400).json({
				//
				message: "Current password and new password are required",
			});
		}

		const [rows] = await pool.query(
			//
			"SELECT * FROM Karyawan WHERE employeeID = ?",
			[userId]
		);

		if (rows.length === 0) {
			//
			// console.log("[AuthController-changePassword] User not found for ID:", userId);
			logger.warn(
				`[AuthController-changePassword] User not found for ID: ${userId}`
			);
			return res.status(404).json({ message: "User not found" }); //
		}

		const user = rows[0]; //

		if (user.password !== currentPassword) {
			//
			// console.log("[AuthController-changePassword] Current password incorrect for user ID:", userId);
			logger.warn(
				`[AuthController-changePassword] Current password incorrect for user ID: ${userId}`
			);
			return res.status(401).json({ message: "Current password is incorrect" }); //
		}

		await pool.query("UPDATE Karyawan SET password = ? WHERE employeeID = ?", [
			//
			newPassword,
			userId,
		]);
		// console.log("[AuthController-changePassword] Password changed successfully for user ID:", userId);
		logger.info(
			`[AuthController-changePassword] Password changed successfully for user ID: ${userId}`
		);
		res.json({ message: "Password changed successfully" }); //
	} catch (error) {
		// console.error("[AuthController-changePassword] Error changing password:", error);
		logger.error(
			`[AuthController-changePassword] Error changing password: ${error.message}`,
			error
		);
		res.status(500).json({ message: "Server error" }); //
	}
};
