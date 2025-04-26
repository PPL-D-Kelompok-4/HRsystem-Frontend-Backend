import express from "express";
import expressLayouts from "express-ejs-layouts";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

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

import dashboardRoutes from "./routes/dashboardRoutes.js";
import allEmployeesRoutes from "./routes/allEmployeesRoutes.js";

// Create Express app
const app = express();

// Set EJS as view engine
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set("views", path.join(__dirname, "../views"));

// Middleware
app.use(cors());
app.use( helmet({ contentSecurityPolicy: false, }) );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use("/api/attendances", attendanceRoutes);
app.use("/api/auth", authRoutes);

app.use("/", dashboardRoutes);
app.use("/allemployees", allEmployeesRoutes);

app.get('/attendance', (req, res) => {
    res.render('attendance');
});

app.get('/allrequests', (req, res) => {
    res.render('allrequests');
});

app.get('/newrequests', (req, res) => {
    res.render('newrequests');
});

app.get('/salary', (req, res) => {
    res.render('salary');
});

app.get('/workhours', (req, res) => {
    res.render('workhours');
});

app.get('/reports', (req, res) => {
    res.render('reports');
});

app.get('/allemployees', (req, res) => {
    res.render('allEmployees');
});

app.get('/profile', (req, res) => {
    res.render('profile');
});

// 404 handler
app.use((req, res, next) => {
	res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ message: "Server error", error: err.message });
});

export default app;
