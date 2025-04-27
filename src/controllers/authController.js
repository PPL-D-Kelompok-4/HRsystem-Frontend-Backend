import jwt from "jsonwebtoken";
import pool from "../config/database.js";
import config from "../config/config.js";

// Login
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Validate input
		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "Email and password are required" });
		}

		// Check if user exists
		const [rows] = await pool.query("SELECT * FROM Karyawan WHERE email = ?", [
			email,
		]);

		if (rows.length === 0) {
			return res.status(401).json({ message: "User Not Exist" });
		}

		const user = rows[0];

		// Check if user is active
		if (user.status_Karyawan !== "Aktif") {
			return res.status(401).json({ message: "Account is inactive" });
		}

		// Verify password (plaintext comparison)
		if (user.password !== password) {
			return res.status(401).json({ message: "Wrong Password" });
		}

		// Generate JWT token
		const token = jwt.sign(
			{
				id: user.employeeID,
				email: user.email,
				name: user.nama,
				departmentID: user.departmentID,
				positionID: user.positionID,
			},
			config.jwtSecret,
			{ expiresIn: config.jwtExpiresIn }
		);

		res.cookie("token", token, {
			httpOnly: true, // Aman, hanya bisa dibaca server
			secure: process.env.NODE_ENV === "development", // Hanya HTTPS di production
			maxAge: 24 * 60 * 60 * 1000, // 1 hari
		});

		// Remove password from response
		const { password: _, ...userWithoutPassword } = user;

		res.json({
			message: "Login successful",
			token,
			user: userWithoutPassword,
		});
	} catch (error) {
		console.error("Error during login:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Get current user
export const getCurrentUser = async (req, res) => {
	try {
		const userId = req.user.id;

		const [rows] = await pool.query(
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
			return res.status(404).json({ message: "User not found" });
		}

		res.json(rows[0]);
	} catch (error) {
		console.error("Error fetching current user:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Change password (direct plaintext)
export const changePassword = async (req, res) => {
	try {
		const userId = req.user.id;
		const { currentPassword, newPassword } = req.body;

		// Validate input
		if (!currentPassword || !newPassword) {
			return res.status(400).json({
				message: "Current password and new password are required",
			});
		}

		// Check if user exists
		const [rows] = await pool.query(
			"SELECT * FROM Karyawan WHERE employeeID = ?",
			[userId]
		);

		if (rows.length === 0) {
			return res.status(404).json({ message: "User not found" });
		}

		const user = rows[0];

		// Verify current password
		if (user.password !== currentPassword) {
			return res.status(401).json({ message: "Current password is incorrect" });
		}

		// Update password (directly)
		await pool.query("UPDATE Karyawan SET password = ? WHERE employeeID = ?", [
			newPassword,
			userId,
		]);

		res.json({ message: "Password changed successfully" });
	} catch (error) {
		console.error("Error changing password:", error);
		res.status(500).json({ message: "Server error" });
	}
};
