import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
	try {
		const token = req.cookies.token;
		const baseURL = process.env.BASE_URL;

		let fetchUrl = "";
		if (req.user.departmentID === 1) {
			// HR: ambil semua
			fetchUrl = `${baseURL}/api/leaves`;
		} else {
			// User biasa: hanya ambil leave milik dia sendiri
			fetchUrl = `${baseURL}/api/leaves/employee/${req.user.id}`;
		}

		const response = await fetch(fetchUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			console.error("Leave API error:", await response.text());
			throw new Error(`Failed to fetch leaves: ${response.status}`);
		}

		const apiLeaves = await response.json();
		const leaveRequests = Array.isArray(apiLeaves)
			? apiLeaves.map((leave) => ({
					id: leave.id || leave.leaveID,
					employee: leave.employee || leave.employee_name,
					type:
						leave.type ||
						(leave.keterangan_Cuti?.includes("Sakit") ? "Sick" : "Personal"),
					startDate: leave.startDate || leave.tanggal_Mulai,
					endDate: leave.endDate || leave.tanggal_Selesai,
					days: leave.days || 1,
					status: leave.status,
					reason: leave.reason || leave.keterangan_Cuti,
					contactInfo: leave.contactInfo || "",
					rejectionReason: leave.rejectionReason || "",
			  }))
			: [];

		res.render("allRequests", {
			leaveRequests,
			user: req.user,
			title: "HR System",
		});
	} catch (error) {
		console.error("Failed to fetch leaves:", error.message);
		res.render("allRequests", {
			leaveRequests: [],
			user: req.user,
			title: "HR System",
		});
	}
});

export default router;
