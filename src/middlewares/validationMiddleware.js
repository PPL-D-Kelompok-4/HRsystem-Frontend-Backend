import { body, param, query, validationResult } from "express-validator";

// Middleware to check validation results
export const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};

// Department validation rules
export const departmentValidationRules = {
	create: [
		body("nama_Departemen")
			.notEmpty()
			.withMessage("Department name is required")
			.isLength({ max: 100 })
			.withMessage("Department name must be less than 100 characters"),
	],
	update: [
		param("id").isInt().withMessage("Invalid department ID"),
		body("nama_Departemen")
			.optional()
			.isLength({ max: 100 })
			.withMessage("Department name must be less than 100 characters"),
	],
};

// Position validation rules
export const positionValidationRules = {
	create: [
		body("nama_Jabatan")
			.notEmpty()
			.withMessage("Position name is required")
			.isLength({ max: 100 })
			.withMessage("Position name must be less than 100 characters"),
		body("gaji_Pokok")
			.notEmpty()
			.withMessage("Base salary is required")
			.isFloat({ min: 0 })
			.withMessage("Base salary must be a positive number"),
		body("Tunjangan")
			.optional()
			.isFloat({ min: 0 })
			.withMessage("Allowance must be a positive number"),
	],
	update: [
		param("id").isInt().withMessage("Invalid position ID"),
		body("nama_Jabatan")
			.optional()
			.isLength({ max: 100 })
			.withMessage("Position name must be less than 100 characters"),
		body("gaji_Pokok")
			.optional()
			.isFloat({ min: 0 })
			.withMessage("Base salary must be a positive number"),
		body("Tunjangan")
			.optional()
			.isFloat({ min: 0 })
			.withMessage("Allowance must be a positive number"),
	],
};

// Employee validation rules
export const employeeValidationRules = {
	create: [
		body("nama")
			.notEmpty()
			.withMessage("Name is required")
			.isLength({ max: 100 })
			.withMessage("Name must be less than 100 characters"),
		body("email")
			.notEmpty()
			.withMessage("Email is required")
			.isEmail()
			.withMessage("Invalid email format")
			.isLength({ max: 100 })
			.withMessage("Email must be less than 100 characters"),
		body("no_Telp")
			.optional()
			.isLength({ max: 15 })
			.withMessage("Phone number must be less than 15 characters"),
		body("password")
			.notEmpty()
			.withMessage("Password is required")
			.isLength({ min: 6 })
			.withMessage("Password must be at least 6 characters"),
		body("positionID")
			.notEmpty()
			.withMessage("Position ID is required")
			.isInt()
			.withMessage("Position ID must be an integer"),
		body("departmentID")
			.notEmpty()
			.withMessage("Department ID is required")
			.isInt()
			.withMessage("Department ID must be an integer"),
		body("status_Karyawan")
			.optional()
			.isIn(["Aktif", "Non-Aktif"])
			.withMessage("Status must be either Aktif or Non-Aktif"),
		body("tanggal_Bergabung")
			.optional()
			.isDate()
			.withMessage("Join date must be a valid date"),
	],
	update: [
		param("id").isInt().withMessage("Invalid employee ID"),
		body("nama")
			.optional()
			.isLength({ max: 100 })
			.withMessage("Name must be less than 100 characters"),
		body("email")
			.optional()
			.isEmail()
			.withMessage("Invalid email format")
			.isLength({ max: 100 })
			.withMessage("Email must be less than 100 characters"),
		body("no_Telp")
			.optional()
			.isLength({ max: 15 })
			.withMessage("Phone number must be less than 15 characters"),
		body("password")
			.optional()
			.isLength({ min: 6 })
			.withMessage("Password must be at least 6 characters"),
		body("positionID")
			.optional()
			.isInt()
			.withMessage("Position ID must be an integer"),
		body("departmentID")
			.optional()
			.isInt()
			.withMessage("Department ID must be an integer"),
		body("status_Karyawan")
			.optional()
			.isIn(["Aktif", "Non-Aktif"])
			.withMessage("Status must be either Aktif or Non-Aktif"),
		body("tanggal_Bergabung")
			.optional()
			.isDate()
			.withMessage("Join date must be a valid date"),
	],
};

// Attendance validation rules
export const attendanceValidationRules = {
	clockIn: [
		body("employeeID")
			.notEmpty()
			.withMessage("Employee ID is required")
			.isInt()
			.withMessage("Employee ID must be an integer"),
	],
	clockOut: [
		body("employeeID")
			.notEmpty()
			.withMessage("Employee ID is required")
			.isInt()
			.withMessage("Employee ID must be an integer"),
	],
	createOrUpdate: [
		body("employeeID")
			.notEmpty()
			.withMessage("Employee ID is required")
			.isInt()
			.withMessage("Employee ID must be an integer"),
		body("tanggal")
			.notEmpty()
			.withMessage("Date is required")
			.isDate()
			.withMessage("Date must be a valid date"),
		body("jam_Masuk").optional(),
		body("jam_Keluar").optional(),
		body("status")
			.notEmpty()
			.withMessage("Status is required")
			.isIn(["Hadir", "Izin", "Sakit", "Cuti"])
			.withMessage("Status must be either Hadir, Izin, Sakit, or Cuti"),
	],
	getByDateRange: [
		query("startDate")
			.notEmpty()
			.withMessage("Start date is required")
			.isDate()
			.withMessage("Start date must be a valid date"),
		query("endDate")
			.notEmpty()
			.withMessage("End date is required")
			.isDate()
			.withMessage("End date must be a valid date"),
	],
};

// Authentication validation rules
export const authValidationRules = {
	login: [
		body("email")
			.notEmpty()
			.withMessage("Email is required")
			.isEmail()
			.withMessage("Invalid email format"),
		body("password").notEmpty().withMessage("Password is required"),
	],
	changePassword: [
		body("currentPassword")
			.notEmpty()
			.withMessage("Current password is required"),
		body("newPassword")
			.notEmpty()
			.withMessage("New password is required")
			.isLength({ min: 6 })
			.withMessage("New password must be at least 6 characters"),
	],
};
