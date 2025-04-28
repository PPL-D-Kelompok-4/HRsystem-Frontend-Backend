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

// Routes
app.use("/api/departments", departmentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/positions", positionRoutes);
app.use("/api/payrolls", payrollRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/attendances", attendanceRoutes);
app.use("/api/auth", authRoutes);

app.use("/", dashboardRoutes);
app.use("/allrequests", allRequestsRoutes);
app.use("/allemployees", allEmployeesRoutes);
app.use("/addemployee", addEmployeeRoutes);
app.use("/calendar", calendarRoutes);
app.use("/", loginRoutes);
app.use("/", profileRoutes);

app.post("/api/auth/logout", (req, res) => {
	res.clearCookie("token");
	res.json({ message: "Logged out successfully" });
});

app.get("/attendance", (req, res) => {
	res.render("attendance");
});

app.get("/newrequests", (req, res) => {
	res.render("newrequests");
});

app.get("/salary", (req, res) => {
	res.render("salary");
});

app.get("/workhours", (req, res) => {
	res.render("workhours");
});

app.get("/reports", (req, res) => {
	res.render("reports");
});

// app.get("/addemployee", (req, res) => {
// 	res.render("addEmployee");
// });

// app.get("/profile", (req, res) => {
// 	res.render("profile");
// });

// 404 handler
app.use((req, res, next) => {
	res.status(404).json({
		message: "Route not found",
	});
});

// Error handler
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		message: "Server error",
		error: err.message,
	});
});

export default app;
