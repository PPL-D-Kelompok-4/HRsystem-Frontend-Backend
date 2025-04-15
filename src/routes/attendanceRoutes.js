import express from "express";
import {
	getAllAttendances,
	getAttendanceById,
	getAttendancesByEmployeeId,
	getAttendancesByDateRange,
	clockIn,
	clockOut,
	createOrUpdateAttendance,
	deleteAttendance,
} from "../controllers/attendanceController.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";
import {
	attendanceValidationRules,
	validate,
} from "../middlewares/validationMiddleware.js";

const router = express.Router();

// Get all attendances
router.get("/", authenticate, isAdmin, getAllAttendances);

// Get attendance by ID
router.get("/:id", authenticate, getAttendanceById);

// Get attendances by employee ID
router.get("/employee/:employeeId", authenticate, getAttendancesByEmployeeId);

// Get attendances by date range
router.get(
	"/date-range",
	authenticate,
	attendanceValidationRules.getByDateRange,
	validate,
	getAttendancesByDateRange
);

// Clock in
router.post(
	"/clock-in",
	authenticate,
	attendanceValidationRules.clockIn,
	validate,
	clockIn
);

// Clock out
router.post(
	"/clock-out",
	authenticate,
	attendanceValidationRules.clockOut,
	validate,
	clockOut
);

// Create or update attendance manually
router.post(
	"/",
	authenticate,
	isAdmin,
	attendanceValidationRules.createOrUpdate,
	validate,
	createOrUpdateAttendance
);

// Delete attendance
router.delete("/:id", authenticate, isAdmin, deleteAttendance);

export default router;
