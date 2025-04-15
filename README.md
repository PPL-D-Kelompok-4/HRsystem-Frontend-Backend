# HR and Attendance System Backend

A backend system for HR and Attendance management built with Express.js and MySQL.

## Features

- Employee management
- Department management
- Position management
- Attendance tracking
- Authentication and authorization

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

## Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd hr-attendance-system
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory (use `.env.example` as a template):

   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration.

5. Create the database and tables:

   - Run the SQL script in `database/migrations/init.sql` in your MySQL server.

6. Start the server:

   ```
   npm start
   ```

   For development with auto-reload:

   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- POST /api/auth/login - Login
- GET /api/auth/me - Get current user
- POST /api/auth/change-password - Change password

### Departments

- GET /api/departments - Get all departments
- GET /api/departments/:id - Get department by ID
- POST /api/departments - Create new department
- PUT /api/departments/:id - Update department
- DELETE /api/departments/:id - Delete department

### Employees

- GET /api/employees - Get all employees
- GET /api/employees/:id - Get employee by ID
- POST /api/employees - Create new employee
- PUT /api/employees/:id - Update employee
- DELETE /api/employees/:id - Delete employee

### Positions

- GET /api/positions - Get all positions
- GET /api/positions/:id - Get position by ID
- POST /api/positions - Create new position
- PUT /api/positions/:id - Update position
- DELETE /api/positions/:id - Delete position

### Attendances

- GET /api/attendances - Get all attendances
- GET /api/attendances/:id - Get attendance by ID
- GET /api/attendances/employee/:employeeId - Get attendances by employee ID
- GET /api/attendances/date-range - Get attendances by date range
- POST /api/attendances/clock-in - Clock in
- POST /api/attendances/clock-out - Clock out
- POST /api/attendances - Create or update attendance manually
- DELETE /api/attendances/:id - Delete attendance

## Project Structure

```
hr-attendance-system/
├── database/
│   └── migrations/
│       └── init.sql
├── logs/
├── src/
│   ├── config/
│   │   ├── config.js
│   │   └── database.js
│   ├── controllers/
│   │   ├── attendanceController.js
│   │   ├── authController.js
│   │   ├── departmentController.js
│   │   ├── employeeController.js
│   │   └── positionController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── validationMiddleware.js
│   ├── models/
│   │   ├── attendanceModel.js
│   │   ├── departmentModel.js
│   │   ├── employeeModel.js
│   │   └── positionModel.js
│   ├── routes/
│   │   ├── attendanceRoutes.js
│   │   ├── authRoutes.js
│   │   ├── departmentRoutes.js
│   │   ├── employeeRoutes.js
│   │   └── positionRoutes.js
│   ├── utils/
│   │   ├── helpers.js
│   │   └── logger.js
│   └── app.js
├── .env
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## License

This project is licensed under the ISC License.
