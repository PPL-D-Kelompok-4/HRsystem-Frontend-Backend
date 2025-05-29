import express from "express";
import expressLayouts from "express-ejs-layouts";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

// get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Import routes
import departmentRoutes from "./routes/departmentRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import positionRoutes from "./routes/positionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import payrollRoutes from "./routes/payrollRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";

import dashboardRoutes from "./routes/dashboardRoutes.js";
import allEmployeesRoutes from "./routes/allEmployeesRoutes.js";
import addEmployeeRoutes from "./routes/addEmployeeRoutes.js";
import calendarRoutes from "./routes/calendarRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import allRequestsRoutes from "./routes/allRequestsRoutes.js";
import { authenticate } from "./middlewares/authMiddleware.js";
import { getPayrollsByEmployeeIdForView, downloadAllUserPayrollsPDF } from  "./controllers/payrollController.js"; // Tambahkan downloadAllUserPayrollsPDF

// Create Express app
const app = express();

// Set EJS as view engine
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("views", path.join(__dirname, "../views"));

// Middleware
app.use(cors());
app.use(
	helmet({
		contentSecurityPolicy: false,
	})
);
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use(cookieParser());

// Serve static files from "public"
app.use(express.static(path.join(__dirname, "../public")));

// Logging
if (process.env.NODE_ENV !== "production") {
	app.use(morgan("dev"));
} else {
	app.use(morgan("combined"));
}

app.get('/api/payrolls/download-all-my-payslips', authenticate, downloadAllUserPayrollsPDF);

// Routes
app.use("/api/departments", departmentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/positions", positionRoutes);
app.use("/api/payrolls", payrollRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/auth", authRoutes);

app.use("/", loginRoutes);
app.use("/", authenticate, dashboardRoutes);
app.use("/allrequests", authenticate, allRequestsRoutes);
app.use("/allemployees", authenticate, allEmployeesRoutes);
app.use("/addemployee", authenticate, addEmployeeRoutes);
app.use("/calendar", authenticate, calendarRoutes);
app.use("/", authenticate, profileRoutes);

app.post("/api/auth/logout", (req, res) => {
	res.clearCookie("token");
	res.json({ message: "Logged out successfully" });
});

app.get("/attendance", authenticate, (req, res) => {
	res.render("attendance", {
        title: "Attendance",
        user: req.user
    });
});

app.get("/newrequests", authenticate, (req, res) => {
	res.render("newrequests", {
		title: "HR System",
		user: req.user,
	});
});

app.get("/salary", authenticate, async (req, res) => {
	try {
		const employeeId = req.user.id;
		if (!employeeId) {
			console.error("Employee ID (req.user.id) not found in token for user:", req.user);
			return res.status(403).render("error", {
                message: "User identity not found. Please log in again.",
                error: {status: 403, stack: ""},
                user: req.user
            });
		}

		const paySlips = await getPayrollsByEmployeeIdForView(employeeId);

		res.render("salary", {
			title: "HR System",
			user: req.user,
			paySlips: paySlips
		});
	} catch (error) {
		console.error("Error fetching salary page:", error);
		res.status(500).render("error", {
            message: "Server error while loading salary page.",
            error: error,
            user: req.user
        });
	}
});

app.get("/managesalary", authenticate, (req, res) => {
  // Periksa apakah pengguna memiliki departmentID yang sesuai (misalnya 2 untuk Finance)
  if (req.user && req.user.departmentID === 2) {
    res.render("manageSalary", {
      title: "Manage Salary | HR System", // Judul yang lebih spesifik bisa membantu
      user: req.user
    });
  } else {
    // Jika tidak, kirim status 403 (Forbidden) dan render halaman error
    res.status(403).render("error", { // Asumsi Anda memiliki view 'error.ejs'
      message: "Access Denied",
      error: {
        status: 403,
        stack: "You do not have permission to access this page."
      },
      user: req.user, // kirim user agar layout tetap bisa render info user jika ada
      title: "Access Denied"
    });
  }
});

// app.get("/testing", (req, res) => {
// 	res.render("dashboardEmployee");
// });


app.get("/reports", authenticate, (req, res) => {
	res.render("reports", { 
        title: "Attendance Reports",
        user: req.user
    });
});

// Handler 404 Not Found
app.use((req, res, next) => {
	if (req.accepts("html")) {
		return res.status(404).render("error", {
            message: "Page Not Found",
            error: {status: 404, stack: "The page you are looking for does not exist."},
            user: req.user
        });
	} else if (req.accepts("json")) {
		res.status(404).json({ message: "Not found" });
	} else {
		res.status(404).type("txt").send("Not found");
	}
});

// Error handler
app.use((err, req, res, next) => {
	console.error("Global error handler:",err.stack);
    const status = err.status || 500;
    const message = err.message || "Something went wrong on the server.";
	
    if (req.accepts("html")) {
        res.status(status).render("error", {
            message: message,
            error: process.env.NODE_ENV === 'development' ? err : {status: status},
            user: req.user
        });
    } else if (req.accepts("json")) {
		res.status(status).json({
			message: "Server error",
			error: err.message,
		});
	} else {
        res.status(status).type("txt").send(message);
    }
});

export default app;