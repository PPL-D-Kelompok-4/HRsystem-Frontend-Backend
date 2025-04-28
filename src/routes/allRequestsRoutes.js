import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const token = req.cookies?.token; // AMBIL DARI COOKIE!

        if (!token) {
            console.error('No token found in cookies');
            return res.redirect('/login'); // Redirect login kalau belum login
        }

        const response = await fetch("http://localhost:3000/api/leaves", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`, // PAKAI TOKEN DARI COOKIE!
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch leaves');
        }

        const apiLeaves = await response.json();

        const leaveRequests = apiLeaves.map((leave) => ({
            id: leave.id,
            employee: leave.employee,
            type: leave.type,
            startDate: leave.startDate,
            endDate: leave.endDate,
            days: leave.days,
            status: leave.status,
            reason: leave.reason,
            contactInfo: leave.contactInfo,
            rejectionReason: leave.rejectionReason || "",
        }));

        res.render("allRequests", {
            leaveRequests,
            title: "HR System"
        });
    } catch (error) {
        console.error("Failed to fetch leaves:", error.message);
        res.render("allRequests", {
            leaveRequests: [],
            title: "HR System"
        });
    }
});

export default router;
