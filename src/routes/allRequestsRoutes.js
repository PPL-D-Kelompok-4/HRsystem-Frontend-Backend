import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const response = await fetch("http://localhost:3000/api/leaves", {
            method: "GET",
            headers: {
                Authorization: req.headers.authorization || "", // Pastikan user sudah login!
            },
        });

        const apiLeaves = await response.json();

        const leaveRequests = apiLeaves.map((leave) => ({
            id: leave.id,
            employee: leave.employee,
            type: leave.type, // <-- langsung dari SQL, tidak fallback manual lagi
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
