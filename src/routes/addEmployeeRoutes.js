import express from "express";

const router = express.Router();

// function untuk generate random password
function generateRandomPassword(length = 8) {
	const chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let password = "";
	for (let i = 0; i < length; i++) {
		password += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return password;
}

// route GET tampilkan form add
router.get("/", (req, res) => {
	res.render("addEmployee", {
		mode: "add",
		employee: null,
		title: "HR System",
	});
});

// route POST simpan employee baru via API
router.post("/", async (req, res) => {
	try {
		const {
			firstName,
			lastName,
			email,
			phone,
			department,
			position,
			startDate,
		} = req.body;

		const fullName = `${firstName} ${lastName}`;
		const password = generateRandomPassword();
		const token = req.cookies.token;

		// Fetch departments
		const deptRes = await fetch(`http://localhost:3000/api/departments`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const departmentsData = await deptRes.json();
		const departments = departmentsData.data || departmentsData;

		if (!Array.isArray(departments)) {
			console.error("Invalid departments data.");
			return res.status(500).send("Failed to fetch departments");
		}

		const dept = departments.find((dep) => dep.nama_Departemen === department);
		const departmentID = dept?.departmentID;

		if (!departmentID) {
			return res.status(400).json({ message: "Department not found" });
		}

		// Fetch positions
		const posRes = await fetch(`http://localhost:3000/api/positions`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const positionsData = await posRes.json();
		const positions = positionsData.data || positionsData;

		if (!Array.isArray(positions)) {
			console.error("Invalid positions data.");
			return res.status(500).send("Failed to fetch positions");
		}

		const pos = positions.find((p) => p.nama_Jabatan === position);
		const positionID = pos?.PositionID;

		if (!positionID) {
			return res.status(400).json({ message: "Position not found" });
		}

		// POST ke API employees (buat employee baru)
		const createRes = await fetch(`http://localhost:3000/api/employees`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				nama: fullName,
				email,
				no_Telp: phone,
				password,
				positionID,
				departmentID,
				status_Karyawan: "Aktif",
				tanggal_Bergabung: startDate,
			}),
		});

		const result = await createRes.json();

		if (!createRes.ok) {
			return res.status(createRes.status).json(result);
		}

		res.status(200).json({ email, password });
	} catch (error) {
		console.error("Failed to add employee:", error.message);
		res
			.status(500)
			.json({ message: "Failed to add employee", error: error.message });
	}
});

export default router;
