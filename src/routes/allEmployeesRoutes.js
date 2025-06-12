import express from "express";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All Employees Page
router.get("/", authenticate, async (req, res) => {
	try {
		const token = req.cookies.token;
		const baseURL = process.env.BASE_URL;

		const response = await fetch(`${baseURL}/api/employees`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			console.error("API response not OK:", await response.text());
			throw new Error(`Failed to fetch employees: ${response.status}`);
		}

		const data = await response.json();
		const apiEmployees = data || [];

		const employees = apiEmployees.map((emp) => ({
			id: emp.employeeID,
			nama: emp.nama,
			email: emp.email,
			department: emp.nama_Departemen,
			position: emp.nama_Jabatan,
			status_Karyawan: emp.status_Karyawan,
		}));

		res.render("allEmployees", {
			employees,
			departmentID: req.user.departmentID,
			title: "HR System",
		});
	} catch (error) {
		console.error("Failed to fetch employees:", error.message);
		res.render("allEmployees", {
			employees: [],
			title: "HR System",
		});
	}
});

// Update Employee Status
router.put("/:employeeId/status", async (req, res) => {
	try {
		const { employeeId } = req.params;
		const { status_Karyawan } = req.body;
		const baseURL = process.env.BASE_URL;

		const response = await fetch(
			`${baseURL}/api/employees/${employeeId}/status`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: req.headers.authorization || "",
				},
				body: JSON.stringify({ status_Karyawan }),
			}
		);

		const result = await response.json();

		if (!response.ok) {
			return res.status(response.status).json(result);
		}

		res.status(200).json({ message: "Employee status updated successfully" });
	} catch (error) {
		console.error("Failed to update employee status:", error.message);
		res.status(500).json({ message: "Failed to update employee status" });
	}
});

// Edit Employee Page
router.get("/edit/:employeeId", async (req, res) => {
	try {
		const { employeeId } = req.params;
		const token = req.cookies.token;
		const baseURL = process.env.BASE_URL;

		if (!token) {
			return res.redirect("/login");
		}

		const response = await fetch(`${baseURL}/api/employees/${employeeId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			return res.status(404).send("Employee not found");
		}

		const employee = await response.json();

		const nameParts = employee.nama.split(" ");
		employee.firstName = nameParts[0];
		employee.lastName = nameParts.slice(1).join(" ");
		employee.id = employee.employeeID;

		if (employee && employee.tanggal_Bergabung) {
			employee.tanggal_Bergabung = new Date(employee.tanggal_Bergabung);
		}

		res.render("addEmployee", {
			mode: "edit",
			employee,
		});
	} catch (error) {
		console.error(error);
		res.status(500).send("Server Error");
	}
});

// Submit Edit Employee
router.post("/edit/:employeeId", async (req, res) => {
	try {
		const { employeeId } = req.params;
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
		const token = req.cookies.token;
		const baseURL = process.env.BASE_URL;

		// Fetch departments
		const deptRes = await fetch(`${baseURL}/api/departments`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const departmentsData = await deptRes.json();
		const departments = departmentsData.data || departmentsData;

		// Fetch positions
		const posRes = await fetch(`${baseURL}/api/positions`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const positionsData = await posRes.json();
		const positions = positionsData.data || positionsData;

		if (!Array.isArray(departments) || !Array.isArray(positions)) {
			console.error("Invalid departments or positions data.");
			return res.status(500).send("Failed to fetch departments or positions");
		}

		const dept = departments.find((dep) => dep.nama_Departemen === department);
		const departmentID = dept?.departmentID;

		const pos = positions.find((p) => p.nama_Jabatan === position);
		const positionID = pos?.PositionID;

		if (!departmentID || !positionID) {
			return res.status(400).send("Invalid department or position");
		}

		const response = await fetch(`${baseURL}/api/employees/${employeeId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				nama: fullName,
				email,
				no_Telp: phone,
				departmentID,
				positionID,
				tanggal_Bergabung: startDate,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			return res.status(response.status).json(errorData);
		}

		res.status(200).json({ success: true });
	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to update employee");
	}
});

// Delete Employee
router.delete("/:employeeId", async (req, res) => {
	try {
		const { employeeId } = req.params;
		const baseURL = process.env.BASE_URL;
		const token = req.cookies.token;

		const response = await fetch(`${baseURL}/api/employees/${employeeId}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		const result = await response.json();

		if (!response.ok) {
			return res.status(response.status).json(result);
		}

		res.json({ message: "Employee deleted successfully" });
	} catch (error) {
		console.error("Failed to delete employee:", error.message);
		res.status(500).json({ message: "Failed to delete employee" });
	}
});

export default router;
