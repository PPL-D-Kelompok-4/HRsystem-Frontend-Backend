
# HR & Attendance System  
A backend and frontend system for managing human resources and employee attendance.

## 📌 Key Features (Backend)  
- Employee management  
- Department management  
- Position management  
- Attendance tracking  
- User authentication and authorization (login, profile data, password change)

## ⚙️ Technologies  
- **Backend**: Node.js (Express.js) + MySQL  
- **Frontend**: EJS + Tailwind CSS

## 🛠️ Prerequisites  
- Node.js v14+  
- MySQL v5.7+  

## 🚀 Installation & Running (Backend)  

1. Clone the repository:  
   ```bash
   git clone https://github.com/PPL-D-Kelompok-4/HRsystem-Frontend-Backend.git  
   cd HRsystem-Frontend-Backend
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Copy and edit environment config:  
   ```bash
   cp .env.example .env
   ```
4. Create the database and tables:  
   - Run the SQL script in `database/migrations/init.sql` on your MySQL server
5. Run the server:  
   ```bash
   npm start
   ```
   or for development mode (auto-reload):  
   ```bash
   npm run dev
   ```

## 🔌 API Endpoints (Backend)

### Authentication  
- `POST /api/auth/login` – Login  
- `GET /api/auth/me` – Get current user data  
- `POST /api/auth/change-password` – Change password  

### Department  
- CRUD endpoints: `GET`, `POST`, `PUT`, `DELETE /api/departments`

### Position  
- CRUD endpoints: `GET`, `POST`, `PUT`, `DELETE /api/positions`

### Employee  
- CRUD endpoints: `GET`, `POST`, `PUT`, `DELETE /api/employees`

### Attendance  
- `GET /api/attendances` – All records  
- `GET /api/attendances/:id` – Detail  
- `GET /api/attendances/employee/:employeeId` – By employee  
- `GET /api/attendances/date-range` – Filter by date range  
- `POST /api/attendances/clock-in`, `clock-out` – Auto attendance  
- `POST /api/attendances` – Manual entry  
- `DELETE /api/attendances/:id` – Delete record  

## 🎯 Project Structure (Backend)  
```
/
├── database/
│   └── migrations/init.sql
├── logs/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── utils/
├── public/   (JS assets)
├── views/    (EJS templates)
├── .env.example
├── server.js
└── package.json
```

## 📝 Frontend  
- Built using EJS + Tailwind CSS  
- Provides pages for:  
  - Login / Authentication  
  - Dashboard
  - Attendance  
  - Manage Salary 
  - Manage Leave
  - Reports
  - Employee
  - Profile  

## ⚠️ License  
- ISC License (as stated in `package.json`)
