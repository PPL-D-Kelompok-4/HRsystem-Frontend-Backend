window.hrSystem = function () {
    return {
        // HR System Data
        currentView: "dashboard",
        menuOpen: {
            leave: false,
            employees: false,
        },
        editingProfile: false,
        editingAddress: false,
        editingEmployeeIndex: null,
        showViewModal: false,
        selectedRequest: {},
        leaveRequestMenuOpen: null,
        sortMenuOpen: false,
        employeeSortType: "name-asc",
        employeeSearch: "",
        employeePage: 1,
        employeesPerPage: 5,
        showPaySlipModal: false,
        selectedPaySlip: {},
        selectedYear: "2025",
        paySlipSearch: "",
        paySlipPage: 1,
        paySlipsPerPage: 5,
        showEditWorkScheduleModal: false,
        employeeChart: null,
        editingWorkSchedule: {
            description: "",
            startTime: "",
            endTime: "",
        },
        editingWorkScheduleIndex: null,
        reportYear: "2025",
        reportMonth: "March",
        reportPage: 1,
        reportsPerPage: 5,

        //Search Leave Request
        leaveRequestSearch: "",
        leaveRequestPage: 1,
        leaveRequestsPerPage: 5,
        leaveRequestSortType: "name-asc",

        // Reports
        filteredReports: [],
        reportSortType: "name-asc",
        reportSearch: "",

        // Calendar Data
        currentMonth: new Date().getMonth(),
        currentYear: new Date().getFullYear(),
        calendarView: "Month",
        viewDropdownOpen: false,
        showEventModal: false,
        showViewEventModal: false,
        selectedEvent: {},
        editingEvent: {
            id: null,
            title: "",
            type: "meeting",
            date: "",
            allDay: false,
            startTime: "",
            endTime: "",
            description: "",
        },
        selectedDay: {
            date: new Date().getDate(),
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            dayOfWeek: new Date().getDay(),
        },
        events: [{
                id: 1,
                title: "Team Meeting",
                type: "meeting",
                date: "2025-03-15",
                allDay: false,
                startTime: "09:00",
                endTime: "10:30",
                description: "Weekly team sync meeting",
            },
            {
                id: 2,
                title: "Project Deadline",
                type: "deadline",
                date: "2025-03-20",
                allDay: true,
                startTime: "",
                endTime: "",
                description: "Final submission for Q1 project",
            },
            {
                id: 3,
                title: "Lunch with Client",
                type: "personal",
                date: "2025-03-18",
                allDay: false,
                startTime: "12:00",
                endTime: "13:30",
                description: "Lunch meeting with potential client",
            },
            {
                id: 4,
                title: "Company Holiday",
                type: "holiday",
                date: "2025-03-25",
                allDay: true,
                startTime: "",
                endTime: "",
                description: "Company-wide holiday",
            },
        ],
        dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        monthNames: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ],

        userProfile: {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@company.com",
            phone: "(123) 456-7890",
            dateOfBirth: "1990-01-01",
            department: "Engineering",
            position: "Senior Developer",
            address: {
                street: "123 Main St",
                city: "San Francisco",
                state: "CA",
                zipCode: "94105",
                country: "USA",
            },
            emergencyContact: "Jane Doe (Wife) - (123) 456-7891",
        },

        editProfileData: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            dateOfBirth: "",
            address: {
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
            },
            emergencyContact: "",
        },

        employees: [{
                id: "EMP001",
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@company.com",
                phone: "(123) 456-7890",
                department: "Engineering",
                position: "Senior Developer",
                status: "Active",
                startDate: "2022-01-15",
                address: {
                    street: "123 Main St",
                    city: "San Francisco",
                    state: "CA",
                    zipCode: "94105",
                    country: "USA",
                },
                emergencyContact: "Jane Doe (Wife) - (123) 456-7891",
                showMenu: false,
            },
            {
                id: "EMP002",
                firstName: "Jane",
                lastName: "Smith",
                email: "jane.smith@company.com",
                phone: "(123) 456-7892",
                department: "Marketing",
                position: "Marketing Manager",
                status: "Active",
                startDate: "2022-02-01",
                address: {
                    street: "456 Market St",
                    city: "San Francisco",
                    state: "CA",
                    zipCode: "94105",
                    country: "USA",
                },
                emergencyContact: "John Smith (Husband) - (123) 456-7893",
                showMenu: false,
            },
            {
                id: "EMP003",
                firstName: "Robert",
                lastName: "Johnson",
                email: "robert.johnson@company.com",
                phone: "(123) 456-7894",
                department: "Sales",
                position: "Sales Representative",
                status: "On Leave",
                startDate: "2022-03-15",
                address: {
                    street: "789 Mission St",
                    city: "San Francisco",
                    state: "CA",
                    zipCode: "94105",
                    country: "USA",
                },
                emergencyContact: "Mary Johnson (Wife) - (123) 456-7895",
                showMenu: false,
            },
            {
                id: "EMP004",
                firstName: "Emily",
                lastName: "Davis",
                email: "emily.davis@company.com",
                phone: "(123) 456-7896",
                department: "HR",
                position: "HR Specialist",
                status: "Active",
                startDate: "2023-01-10",
                address: {
                    street: "101 Howard St",
                    city: "San Francisco",
                    state: "CA",
                    zipCode: "94105",
                    country: "USA",
                },
                emergencyContact: "Michael Davis (Husband) - (123) 456-7897",
                showMenu: false,
            },
            {
                id: "EMP005",
                firstName: "Michael",
                lastName: "Wilson",
                email: "michael.wilson@company.com",
                phone: "(123) 456-7898",
                department: "Finance",
                position: "Financial Analyst",
                status: "Inactive",
                startDate: "2022-05-20",
                address: {
                    street: "555 California St",
                    city: "San Francisco",
                    state: "CA",
                    zipCode: "94105",
                    country: "USA",
                },
                emergencyContact: "Sarah Wilson (Wife) - (123) 456-7899",
                showMenu: false,
            },
            {
                id: "EMP006",
                firstName: "Cade",
                lastName: "Johnson",
                email: "michael.wilson@company.com",
                phone: "(123) 456-7898",
                department: "Finance",
                position: "Financial Analyst",
                status: "Inactive",
                startDate: "2022-05-20",
                address: {
                    street: "555 California St",
                    city: "San Francisco",
                    state: "CA",
                    zipCode: "94105",
                    country: "USA",
                },
                emergencyContact: "Sarah Wilson (Wife) - (123) 456-7899",
                showMenu: false,
            },
            {
                id: "EMP007",
                firstName: "Cade",
                lastName: "Johnson",
                email: "michael.wilson@company.com",
                phone: "(123) 456-7898",
                department: "Engineering",
                position: "Software Engineer",
                status: "Inactive",
                startDate: "2022-05-20",
                address: {
                    street: "555 California St",
                    city: "San Francisco",
                    state: "CA",
                    zipCode: "94105",
                    country: "USA",
                },
                emergencyContact: "Sarah Wilson (Wife) - (123) 456-7899",
                showMenu: false,
            },
        ],

        newEmployee: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            department: "",
            position: "",
            status: "Active",
            startDate: "",
            address: {
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
            },
            emergencyContact: "",
        },

        leaveRequests: [{
                id: "LEA001",
                employee: "John Doe",
                type: "Annual Leave",
                startDate: "2025-04-10",
                endDate: "2025-04-15",
                days: 5,
                status: "Pending",
                reason: "Family vacation",
                contactInfo: "john.doe@personal.com",
            },
            {
                id: "LEA002",
                employee: "Jane Smith",
                type: "Sick Leave",
                startDate: "2025-03-25",
                endDate: "2025-03-26",
                days: 2,
                status: "Approved",
                reason: "Doctor appointment",
                contactInfo: "jane.smith@personal.com",
            },
            {
                id: "LEA003",
                employee: "Robert Johnson",
                type: "Personal Leave",
                startDate: "2025-05-05",
                endDate: "2025-05-07",
                days: 3,
                status: "Rejected",
                reason: "Personal matters",
                contactInfo: "robert.johnson@personal.com",
                rejectionReason: "High workload during this period",
            },
            {
                id: "LEA004",
                employee: "Donald Mickey",
                type: "Annual Leave",
                startDate: "2025-05-05",
                endDate: "2025-05-07",
                days: 3,
                status: "Rejected",
                reason: "Personal matters",
                contactInfo: "robert.johnson@personal.com",
                rejectionReason: "High workload during this period",
            },
            {
                id: "LEA005",
                employee: "Dwayne Johnson",
                type: "Personal Leave",
                startDate: "2025-05-05",
                endDate: "2025-05-07",
                days: 3,
                status: "Rejected",
                reason: "Personal matters",
                contactInfo: "robert.johnson@personal.com",
                rejectionReason: "High workload during this period",
            },
            {
                id: "LEA006",
                employee: "Cade Johnson",
                type: "Personal Leave",
                startDate: "2025-05-05",
                endDate: "2025-05-07",
                days: 3,
                status: "Rejected",
                reason: "Personal matters",
                contactInfo: "robert.johnson@personal.com",
                rejectionReason: "High workload during this period",
            },
        ],

        newRequest: {
            type: "",
            startDate: "",
            endDate: "",
            days: 1,
            reason: "",
            contactInfo: "",
        },

        paySlips: [{
                period: "March 2025",
                issueDate: "2025-03-31",
                netPay: "Rp3.450.000",
                status: "Paid",
            },
            {
                period: "February 2025",
                issueDate: "2025-02-28",
                netPay: "Rp3.450.000",
                status: "Paid",
            },
            {
                period: "January 2025",
                issueDate: "2025-01-31",
                netPay: "Rp3.450.000",
                status: "Paid",
            },
            {
                period: "December 2024",
                issueDate: "2024-12-31",
                netPay: "Rp3.450.000",
                status: "Paid",
            },
            {
                period: "November 2024",
                issueDate: "2024-11-30",
                netPay: "Rp3.450.000",
                status: "Paid",
            },
            {
                period: "October 2024",
                issueDate: "2024-10-31",
                netPay: "Rp3.450.000",
                status: "Paid",
            },
            {
                period: "September 2024",
                issueDate: "2024-09-31",
                netPay: "Rp3.450.000",
                status: "Paid",
            },
            {
                period: "August 2024",
                issueDate: "2024-08-31",
                netPay: "Rp3.450.000",
                status: "Paid",
            },
            {
                period: "July 2024",
                issueDate: "2024-07-31",
                netPay: "Rp3.450.000",
                status: "Paid",
            },
        ],

        filteredPaySlips: [],

        workSchedules: [{
                description: "Regular Work Hours",
                startTime: "09:00",
                endTime: "17:00",
            },
            {
                description: "Flexible Work Hours",
                startTime: "08:00",
                endTime: "16:00",
            },
            {
                description: "Night Shift",
                startTime: "22:00",
                endTime: "06:00",
            },
        ],

        // EmployeeAttendaceReports
        employeeAttendanceReports: [{
                no: 1,
                name: "John Doe",
                workSchedule: "Regular Work Hours",
                attend: 20,
                leave: 2,
                noInformation: 0,
                totalAbsent: 2,
            },
            {
                no: 2,
                name: "Jane Smith",
                workSchedule: "Regular Work Hours",
                attend: 22,
                leave: 0,
                noInformation: 0,
                totalAbsent: 0,
            },
            {
                no: 3,
                name: "Robert Johnson",
                workSchedule: "Flexible Work Hours",
                attend: 18,
                leave: 3,
                noInformation: 1,
                totalAbsent: 4,
            },
            {
                no: 4,
                name: "Emily Davis",
                workSchedule: "Regular Work Hours",
                attend: 21,
                leave: 1,
                noInformation: 0,
                totalAbsent: 1,
            },
            {
                no: 5,
                name: "Michael Wilson",
                workSchedule: "Night Shift",
                attend: 19,
                leave: 2,
                noInformation: 1,
                totalAbsent: 3,
            },
            {
                no: 6,
                name: "Michael Wilson",
                workSchedule: "Night Shift",
                attend: 19,
                leave: 2,
                noInformation: 1,
                totalAbsent: 3,
            },
        ],

        // New Attendance Data
        currentTime: '',
        showAttendanceHistoryModal: false,
        attendanceFilterMonth: 'all',
        attendanceFilterStatus: 'all',
        todayAttendance: {
            checkIn: null,
            checkOut: null
        },
        // Second attendanceRecords, kept for attendance tracking
        attendanceRecords: [{
                date: '2025-03-29',
                checkIn: '08:55:23',
                checkOut: '17:05:47',
                status: 'Present'
            },
            {
                date: '2025-03-28',
                checkIn: '09:10:15',
                checkOut: '17:30:22',
                status: 'Late'
            },
            {
                date: '2025-03-27',
                checkIn: '08:45:30',
                checkOut: '16:50:12',
                status: 'Present'
            },
            {
                date: '2025-03-26',
                checkIn: '08:50:45',
                checkOut: '17:15:33',
                status: 'Present'
            },
            {
                date: '2025-03-25',
                checkIn: null,
                checkOut: null,
                status: 'Absent'
            },
            {
                date: '2025-03-24',
                checkIn: '08:58:20',
                checkOut: '13:30:10',
                status: 'Half Day'
            },
            {
                date: '2025-03-23',
                checkIn: '08:45:12',
                checkOut: '17:05:30',
                status: 'Present'
            },
            {
                date: '2025-03-22',
                checkIn: '09:15:45',
                checkOut: '17:20:18',
                status: 'Late'
            },
            {
                date: '2025-03-21',
                checkIn: '08:50:33',
                checkOut: '17:10:25',
                status: 'Present'
            },
            {
                date: '2025-03-20',
                checkIn: '08:48:55',
                checkOut: '17:05:40',
                status: 'Present'
            },
            {
                date: '2025-03-19',
                checkIn: '08:55:10',
                checkOut: '17:15:22',
                status: 'Present'
            },
            {
                date: '2025-03-18',
                checkIn: '09:20:05',
                checkOut: '17:30:15',
                status: 'Late'
            },
            {
                date: '2025-03-17',
                checkIn: '08:45:30',
                checkOut: '17:00:45',
                status: 'Present'
            },
            {
                date: '2025-03-16',
                checkIn: null,
                checkOut: null,
                status: 'Absent'
            },
            {
                date: '2025-03-15',
                checkIn: '08:50:20',
                checkOut: '17:10:35',
                status: 'Present'
            }
        ],

        filteredAttendanceRecords: [],

        init() {
            // Initialize HR System
            this.filterPaySlips();
            // Update this reference to use employeeAttendanceReports
            this.filteredAttendanceRecords = [...this.attendanceRecords];

            // Initialize Calendar
            this.setToday();
            this.generateCalendarDays();
            this.generateWeekDays();

            this.initReports();

            // Initialize Chart
            this.$nextTick(() => {
                this.initEmployeeChart();
            });

            // Check if there's already an attendance record for today
            const today = new Date().toISOString().split('T')[0];
            const todayRecord = this.attendanceRecords.find(record => record.date ===
            today);

            if (todayRecord) {
                this.todayAttendance.checkIn = todayRecord.checkIn;
                this.todayAttendance.checkOut = todayRecord.checkOut;
            }
        },

        // Attendance Methods
        startClock() {
            this.updateClock();
            setInterval(() => this.updateClock(), 1000);
        },

        updateClock() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            this.currentTime = `${hours}:${minutes}:${seconds}`;
        },

        formatCurrentDate() {
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            return new Date().toLocaleDateString('en-US', options);
        },

        formatDateForDisplay(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },

        formatTime(timeString) {
            if (!timeString) return '-';

            const [hours, minutes] = timeString.split(':');
            const h = parseInt(hours) % 12 || 12;
            const ampm = parseInt(hours) < 12 ? 'AM' : 'PM';
            return `${h}:${minutes} ${ampm}`;
        },

        calculateDuration(checkIn, checkOut) {
            if (!checkIn || !checkOut) return '-';

            const [inHours, inMinutes] = checkIn.split(':');
            const [outHours, outMinutes] = checkOut.split(':');

            const inTime = new Date();
            inTime.setHours(parseInt(inHours), parseInt(inMinutes), 0);

            const outTime = new Date();
            outTime.setHours(parseInt(outHours), parseInt(outMinutes), 0);

            const diffMs = outTime - inTime;
            const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
            const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

            return `${diffHrs} hrs ${diffMins} mins`;
        },

        calculateWorkDuration() {
            return this.calculateDuration(this.todayAttendance.checkIn, this.todayAttendance
                .checkOut);
        },

        checkIn() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const timeString = `${hours}:${minutes}:${seconds}`;

            this.todayAttendance.checkIn = timeString;

            // Take today's date
            const today = now.toISOString().split('T')[0];

            // Search for “Regular Work Hours” schedule
            const regularWork = this.workSchedules.find(schedule => schedule.description ===
                "Regular Work Hours");

            let status = 'Present';

            if (regularWork) {
                const regularStartHour = parseInt(regularWork.startTime.split(":")[0]);
                status = parseInt(hours) >= regularStartHour ? 'Late' : 'Present';
            }

            // Check if there is already a record today
            const existingIndex = this.attendanceRecords.findIndex(record => record.date ===
                today);

            if (existingIndex !== -1) {
                this.attendanceRecords[existingIndex].checkIn = timeString;
                this.attendanceRecords[existingIndex].status = status;
            } else {
                this.attendanceRecords.unshift({
                    date: today,
                    checkIn: timeString,
                    checkOut: null,
                    status: status
                });
            }
        },

        checkOut() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const timeString = `${hours}:${minutes}:${seconds}`;

            this.todayAttendance.checkOut = timeString;

            // Update today's record
            const today = now.toISOString().split('T')[0];
            const existingIndex = this.attendanceRecords.findIndex(record => record.date ===
                today);

            if (existingIndex !== -1) {
                this.attendanceRecords[existingIndex].checkOut = timeString;

                // Check if it's a half day
                const [inHours, inMinutes] = this.attendanceRecords[existingIndex].checkIn
                    .split(':');
                const inTime = new Date();
                inTime.setHours(parseInt(inHours), parseInt(inMinutes), 0);

                const outTime = new Date();
                outTime.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));

                const diffMs = outTime - inTime;
                const diffHrs = diffMs / (1000 * 60 * 60);

                if (diffHrs < 6) {
                    this.attendanceRecords[existingIndex].status = 'Half Day';
                }
            }

            alert('Check-out successful!');
        },

        get recentAttendanceRecords() {
            return this.attendanceRecords.slice(0, 5);
        },

        get filteredAttendanceRecords() {
            return this.attendanceRecords.filter(record => {
                // Filter by month
                if (this.attendanceFilterMonth !== 'all') {
                    const recordMonth = new Date(record.date).getMonth()
                        .toString();
                    if (recordMonth !== this.attendanceFilterMonth) {
                        return false;
                    }
                }

                // Filter by status
                if (this.attendanceFilterStatus !== 'all' && record.status !==
                    this.attendanceFilterStatus) {
                    return false;
                }

                return true;
            });
        },

        countAttendanceByStatus(status) {
            return this.filteredAttendanceRecords.filter(record => record.status === status)
                .length;
        },

        exportAttendanceHistory() {
            alert('Exporting attendance history...');
            // In a real implementation, this would generate a CSV or PDF file
        },

        // HR System Methods
        toggleMenu(menu) {
            this.menuOpen[menu] = !this.menuOpen[menu];
        },

        startEditProfile() {
            this.editProfileData = JSON.parse(JSON.stringify(this.userProfile));
            this.editingProfile = true;
        },

        saveProfile() {
            this.userProfile = JSON.parse(JSON.stringify(this.editProfileData));
            this.editingProfile = false;
        },

        cancelEditProfile() {
            this.editingProfile = false;
        },

        startEditAddress() {
            this.editProfileData = JSON.parse(JSON.stringify(this.userProfile));
            this.editingAddress = true;
        },

        saveAddress() {
            this.userProfile = JSON.parse(JSON.stringify(this.editProfileData));
            this.editingAddress = false;
        },

        cancelEditAddress() {
            this.editingAddress = false;
        },

        submitNewEmployee() {
            if (this.editingEmployeeIndex !== null) {
                // Update existing employee
                this.employees[this.editingEmployeeIndex] = {
                    ...this.newEmployee,
                    showMenu: false,
                };
                this.editingEmployeeIndex = null;
            } else {
                // Add new employee
                const newId = `EMP${String(this.employees.length + 1).padStart(
                3,
                "0"
                )}`;
                this.employees.push({
                    ...this.newEmployee,
                    id: newId,
                    showMenu: false,
                });

                alert("Employee updated successfully!");
            }

            // Reset form
            this.newEmployee = {
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                department: "",
                position: "",
                status: "Active",
                startDate: "",
                address: {
                    street: "",
                    city: "",
                    state: "",
                    zipCode: "",
                    country: "",
                },
                emergencyContact: "",
            };

            this.currentView = "allEmployees";

            // After adding/updating employee
            this.$nextTick(() => {
                this.initEmployeeChart();
            });
        },

        editEmployee(index) {
            const employee = this.paginatedEmployees[index];
            const originalIndex = this.employees.findIndex(
                (e) => e.id === employee.id
            );

            this.editingEmployeeIndex = originalIndex;
            this.newEmployee = JSON.parse(
                JSON.stringify(this.employees[originalIndex])
            );
            this.employees[originalIndex].showMenu = false;

            this.currentView = "addEmployee";
        },

        deleteEmployee(index) {
            if (confirm("Are you sure you want to delete this employee?")) {
                const employee = this.paginatedEmployees[index];
                const originalIndex = this.employees.findIndex(
                    (e) => e.id === employee.id
                );

                this.employees.splice(originalIndex, 1);
                // After deleting employee
                this.$nextTick(() => {
                    this.initEmployeeChart();
                });
            }
        },

        changeEmployeeStatus(index, status) {
            const employee = this.paginatedEmployees[index];
            const originalIndex = this.employees.findIndex(
                (e) => e.id === employee.id
            );

            this.employees[originalIndex].status = status;
            this.employees[originalIndex].showMenu = false;

            // After changing status
            this.$nextTick(() => {
                this.initEmployeeChart();
            });
        },

        toggleEmployeeMenu(index) {
            // Close all other menus first
            this.paginatedEmployees.forEach((emp, i) => {
                if (i !== index) {
                    const originalIndex = this.employees.findIndex(
                        (e) => e.id === emp.id
                    );
                    if (originalIndex !== -1) {
                        this.employees[originalIndex].showMenu = false;
                    }
                }
            });

            // Toggle the selected menu
            const employee = this.paginatedEmployees[index];
            const originalIndex = this.employees.findIndex(
                (e) => e.id === employee.id
            );

            if (originalIndex !== -1) {
                this.employees[originalIndex].showMenu = !this.employees[originalIndex]
                    .showMenu;
            }
        },

        toggleLeaveRequestMenu(index) {
            // Close all other menus first
            this.paginatedLeaveRequests.forEach((emp, i) => {
                if (i !== index) {
                    const originalIndex = this.leaveRequests.findIndex(
                        (e) => e.id === emp.id
                    );
                    if (originalIndex !== -1) {
                        this.leaveRequests[originalIndex].showMenu = false;
                    }
                }
            });

            // Toggle the selected menu
            const leaveRequest = this.paginatedLeaveRequests[index];
            const originalIndex = this.leaveRequests.findIndex(
                (e) => e.id === leaveRequest.id
            );

            if (originalIndex !== -1) {
                this.leaveRequests[originalIndex].showMenu = !this.leaveRequests[
                    originalIndex].showMenu;
            }
        },

        getSortLabelEmployee() {
            switch (this.employeeSortType) {
                case "name-asc":
                    return "Name (A-Z)";
                case "name-desc":
                    return "Name (Z-A)";
                case "id":
                    return "Employee ID";
                default:
                    return "Sort by";
            }
        },

        getSortLabelLeaveRequest() {
            switch (this.leaveRequestSortType) {
                case "name-asc":
                    return "Name (A-Z)";
                case "name-desc":
                    return "Name (Z-A)";
                case "id":
                    return "Leave Request ID";
                default:
                    return "Sort by";
            }
        },

        setEmployeeSort(type) {
            this.employeeSortType = type;
            this.employeePage = 1;
        },

        setLeaveRequestSort(type) {
            this.leaveRequestSortType = type;
            this.leaveRequestPage = 1;
        },

        get filteredEmployees() {
            if (!this.employeeSearch) {
                return this.employees;
            }

            const search = this.employeeSearch.toLowerCase();
            return this.employees.filter((employee) => {
                return (
                    employee.firstName.toLowerCase().includes(search) ||
                    employee.lastName.toLowerCase().includes(search) ||
                    employee.email.toLowerCase().includes(search) ||
                    employee.department.toLowerCase().includes(search) ||
                    employee.position.toLowerCase().includes(search) ||
                    employee.id.toLowerCase().includes(search)
                );
            });
        },

        get filteredLeaveRequests() {
            if (!this.leaveRequestSearch) {
                return this.leaveRequests;
            }

            const search = this.leaveRequestSearch.toLowerCase();
            return this.leaveRequests.filter((request) => {
                return (
                    request.employee.toLowerCase().includes(search) ||
                    request.type.toLowerCase().includes(search) ||
                    request.startDate.toLowerCase().includes(search) ||
                    request.endDate.toLowerCase().includes(search)
                );
            });
        },

        get sortedEmployees() {
            const filtered = [...this.filteredEmployees];

            switch (this.employeeSortType) {
                case "name-asc":
                    return filtered.sort((a, b) => {
                        const nameA = `${a.firstName} ${a.lastName}`
                            .toLowerCase();
                        const nameB = `${b.firstName} ${b.lastName}`
                            .toLowerCase();
                        return nameA.localeCompare(nameB);
                    });
                case "name-desc":
                    return filtered.sort((a, b) => {
                        const nameA = `${a.firstName} ${a.lastName}`
                            .toLowerCase();
                        const nameB = `${b.firstName} ${b.lastName}`
                            .toLowerCase();
                        return nameB.localeCompare(nameA);
                    });
                case "id":
                    return filtered.sort((a, b) => a.id.localeCompare(b.id));
                default:
                    return filtered;
            }
        },

        get sortedLeaveRequests() {
            const filtered = [...this.filteredLeaveRequests];

            switch (this.leaveRequestSortType) {
                case "name-asc":
                    return filtered.sort((a, b) => {
                        const nameA = `${a.firstName} ${a.lastName}`
                            .toLowerCase();
                        const nameB = `${b.firstName} ${b.lastName}`
                            .toLowerCase();
                        return nameA.localeCompare(nameB);
                    });
                case "name-desc":
                    return filtered.sort((a, b) => {
                        const nameA = `${a.firstName} ${a.lastName}`
                            .toLowerCase();
                        const nameB = `${b.firstName} ${b.lastName}`
                            .toLowerCase();
                        return nameB.localeCompare(nameA);
                    });
                case "id":
                    return filtered.sort((a, b) => a.id.localeCompare(b.id));
                default:
                    return filtered;
            }
        },

        get paginatedEmployees() {
            const start = (this.employeePage - 1) * this.employeesPerPage;
            const end = start + this.employeesPerPage;
            return this.sortedEmployees.slice(start, end);
        },

        get paginatedLeaveRequests() {
            const start = (this.leaveRequestPage - 1) * this.leaveRequestsPerPage;
            const end = start + this.leaveRequestsPerPage;
            return this.sortedLeaveRequests.slice(start, end);
        },

        nextEmployeePage() {
            const maxPage = Math.ceil(
                this.sortedEmployees.length / this.employeesPerPage
            );
            if (this.employeePage < maxPage) {
                this.employeePage++;
            }
        },

        nextLeaveRequestPage() {
            const maxPage = Math.ceil(
                this.sortedLeaveRequests.length / this.leaveRequestsPerPage
            );
            if (this.leaveRequestPage < maxPage) {
                this.leaveRequestPage++;
            }
        },

        prevEmployeePage() {
            if (this.employeePage > 1) {
                this.employeePage--;
            }
        },

        prevLeaveRequestPage() {
            if (this.leaveRequestPage > 1) {
                this.leaveRequestPage--;
            }
        },

        submitLeaveRequest() {
            // Calculate days
            const start = new Date(this.newRequest.startDate);
            const end = new Date(this.newRequest.endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

            this.leaveRequests.push({
                employee: `${this.userProfile.firstName} ${this.userProfile.lastName}`,
                type: this.newRequest.type,
                startDate: this.newRequest.startDate,
                endDate: this.newRequest.endDate,
                days: diffDays,
                status: "Pending",
                reason: this.newRequest.reason,
                contactInfo: this.newRequest.contactInfo,
            });

            // Reset form
            this.newRequest = {
                type: "",
                startDate: "",
                endDate: "",
                days: 1,
                reason: "",
                contactInfo: "",
            };

            // Go back to leave requests list
            this.currentView = "allRequests";
        },

        viewLeaveRequestDetails(request) {
            this.selectedRequest = request;
            this.showViewModal = true;
        },

        approveLeaveRequest(index) {
            this.leaveRequests[index].status = "Approved";
        },

        rejectLeaveRequest(index) {
            const reason = prompt("Please provide a reason for rejection:");
            if (reason !== null) {
                this.leaveRequests[index].status = "Rejected";
                this.leaveRequests[index].rejectionReason =
                    reason || "No reason provided";
            }
        },

        getLeaveRequestIndex(request) {
            return this.leaveRequests.findIndex(
                (r) =>
                r.employee === request.employee &&
                r.startDate === request.startDate &&
                r.type === request.type
            );
        },

        toggleLeaveRequestMenu(index) {
            this.leaveRequestMenuOpen =
                this.leaveRequestMenuOpen === index ? null : index;
        },

        get pendingLeaveRequests() {
            return this.leaveRequests.filter(
                (request) => request.status === "Pending"
            );
        },

        get recentHires() {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            return this.employees.filter((employee) => {
                const startDate = new Date(employee.startDate);
                return startDate >= thirtyDaysAgo;
            });
        },

        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        },

        filterPaySlips() {
            this.filteredPaySlips = this.paySlips.filter((slip) => {
                const matchesYear = slip.period.includes(this.selectedYear);
                const matchesSearch =
                    this.paySlipSearch === "" ||
                    slip.period
                    .toLowerCase()
                    .includes(this.paySlipSearch.toLowerCase()) ||
                    slip.netPay
                    .toLowerCase()
                    .includes(this.paySlipSearch.toLowerCase());

                return matchesYear && matchesSearch;
            });

            this.paySlipPage = 1;
        },

        get paginatedPaySlips() {
            const start = (this.paySlipPage - 1) * this.paySlipsPerPage;
            const end = start + this.paySlipsPerPage;
            return this.filteredPaySlips.slice(start, end);
        },

        nextPaySlipPage() {
            const maxPage = Math.ceil(
                this.filteredPaySlips.length / this.paySlipsPerPage
            );
            if (this.paySlipPage < maxPage) {
                this.paySlipPage++;
            }
        },

        prevPaySlipPage() {
            if (this.paySlipPage > 1) {
                this.paySlipPage--;
            }
        },

        viewPaySlip(slip) {
            this.selectedPaySlip = slip;
            this.showPaySlipModal = true;
        },

        downloadPaySlip(slip) {
            alert(`Downloading pay slip for ${slip.period}...`);
        },

        editWorkSchedule(index) {
            this.editingWorkScheduleIndex = index;
            this.editingWorkSchedule = {
                ...this.workSchedules[index]
            };
            this.showEditWorkScheduleModal = true;
        },

        saveWorkSchedule() {
            if (this.editingWorkScheduleIndex !== null) {
                this.workSchedules[this.editingWorkScheduleIndex] = {
                    ...this.editingWorkSchedule,
                };
            }

            this.showEditWorkScheduleModal = false;
        },

        get paginatedAttendanceRecords() {
            const start = (this.reportPage - 1) * this.reportsPerPage;
            const end = start + this.reportsPerPage;
            return this.filteredReports.slice(start, end);
        },

        get filteredReports() {
            // Start with all reports
            let reports = [...this.employeeAttendanceReports];

            // Filter by search term if provided
            if (this.reportSearch) {
                const search = this.reportSearch.toLowerCase();
                reports = reports.filter(report =>
                    report.name.toLowerCase().includes(search) ||
                    report.workSchedule.toLowerCase().includes(search)
                );
            }

            // Sort reports based on sort type
            switch (this.reportSortType) {
                case "name-asc":
                    reports.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case "name-desc":
                    reports.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                case "attendance-high":
                    reports.sort((a, b) => b.attend - a.attend);
                    break;
                case "attendance-low":
                    reports.sort((a, b) => a.attend - b.attend);
                    break;
            }

            return reports;
        },

        filterReports() {
            this.reportPage = 1; // Reset to first page when filtering
            console.log(`Filtering reports for ${this.reportMonth} ${this.reportYear}`);
        },

        setReportSort(type) {
            this.reportSortType = type;
            this.reportPage = 1; // Reset to first page when sorting
        },

        nextReportPage() {
            const maxPage = Math.ceil(this.filteredReports.length / this.reportsPerPage);
            if (this.reportPage < maxPage) {
                this.reportPage++;
            }
        },

        prevReportPage() {
            if (this.reportPage > 1) {
                this.reportPage--;
            }
        },

        initReports() {
            this.filteredReports = [...this.employeeAttendanceReports];
        },

        printReport() {
            alert(
                `Printing report for ${this.reportMonth} ${this.reportYear}...`
            );
        },

        initEmployeeChart() {
            const ctx = document.getElementById("employeeChart");
            if (!ctx) return;

            // Destroy existing chart if it exists
            if (this.employeeChart) {
                this.employeeChart.destroy();
            }

            // Count employees by department
            const departments = {};
            this.employees.forEach((employee) => {
                if (departments[employee.department]) {
                    departments[employee.department]++;
                } else {
                    departments[employee.department] = 1;
                }
            });

            // Create chart
            this.employeeChart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: Object.keys(departments),
                    datasets: [{
                        label: "Number of Employees",
                        data: Object.values(departments),
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)",
                        ],
                        borderWidth: 1,
                    }, ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                            },
                        },
                    },
                },
            });
        },

        // Calendar Methods
        get calendarDays() {
            const firstDay = new Date(this.currentYear, this.currentMonth, 1);
            const lastDay = new Date(
                this.currentYear,
                this.currentMonth + 1,
                0
            );
            const daysInMonth = lastDay.getDate();
            const startingDayOfWeek = firstDay.getDay();

            // Get the previous month's days that appear in this month's calendar
            const prevMonthLastDay = new Date(
                this.currentYear,
                this.currentMonth,
                0
            ).getDate();

            const days = [];

            // Previous month's days
            for (let i = 0; i < startingDayOfWeek; i++) {
                const prevMonthDay = prevMonthLastDay - startingDayOfWeek + i + 1;
                const prevMonth =
                    this.currentMonth === 0 ? 11 : this.currentMonth - 1;
                const prevYear =
                    this.currentMonth === 0 ?
                    this.currentYear - 1 :
                    this.currentYear;

                days.push({
                    date: prevMonthDay,
                    month: prevMonth,
                    year: prevYear,
                    isCurrentMonth: false,
                    isToday: this.isToday(prevYear, prevMonth, prevMonthDay),
                    dayOfWeek: i % 7,
                });
            }

            // Current month's days
            for (let i = 1; i <= daysInMonth; i++) {
                days.push({
                    date: i,
                    month: this.currentMonth,
                    year: this.currentYear,
                    isCurrentMonth: true,
                    isToday: this.isToday(this.currentYear, this.currentMonth,
                        i),
                    dayOfWeek: (startingDayOfWeek + i - 1) % 7,
                });
            }

            // Next month's days to fill out the calendar grid (6 rows x 7 columns = 42 cells)
            const remainingDays = 42 - days.length;
            for (let i = 1; i <= remainingDays; i++) {
                const nextMonth =
                    this.currentMonth === 11 ? 0 : this.currentMonth + 1;
                const nextYear =
                    this.currentMonth === 11 ?
                    this.currentYear + 1 :
                    this.currentYear;

                days.push({
                    date: i,
                    month: nextMonth,
                    year: nextYear,
                    isCurrentMonth: false,
                    isToday: this.isToday(nextYear, nextMonth, i),
                    dayOfWeek: (startingDayOfWeek + daysInMonth + i - 1) % 7,
                });
            }

            return days;
        },

        get weekDays() {
            const days = [];
            const today = new Date();
            const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

            // Start the week on the current day
            for (let i = 0; i < 7; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() - currentDay + i);

                days.push({
                    date: date.getDate(),
                    month: date.getMonth(),
                    year: date.getFullYear(),
                    dayOfWeek: date.getDay(),
                    isToday: this.isToday(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate()
                    ),
                });
            }

            return days;
        },

        isToday(year, month, day) {
            const today = new Date();
            return (
                year === today.getFullYear() &&
                month === today.getMonth() &&
                day === today.getDate()
            );
        },

        formatDate(date) {
            return `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        },

        formatHour(hour) {
            const h = hour % 12 || 12;
            const ampm = hour < 12 ? "AM" : "PM";
            return `${h}:00 ${ampm}`;
        },

        formatEventTime(event) {
            if (event.allDay) {
                return "All day";
            }

            const formatTime = (timeStr) => {
                const [hours, minutes] = timeStr.split(":");
                const h = parseInt(hours) % 12 || 12;
                const ampm = parseInt(hours) < 12 ? "AM" : "PM";
                return `${h}:${minutes} ${ampm}`;
            };

            return `${formatTime(event.startTime)} - ${formatTime(
                event.endTime
            )}`;
        },

        formatEventDate(event) {
            const date = new Date(event.date);
            const options = {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            };
            return date.toLocaleDateString("en-US", options);
        },

        getEventsForDate(day) {
            const dateStr = `${day.year}-${String(day.month + 1).padStart(
                2,
                "0"
            )}-${String(day.date).padStart(2, "0")}`;
            return this.events.filter((event) => event.date === dateStr);
        },

        getEventsForDay(day) {
            const dateStr = `${day.year}-${String(day.month + 1).padStart(
                2,
                "0"
            )}-${String(day.date).padStart(2, "0")}`;
            return this.events.filter((event) => event.date === dateStr);
        },

        getEventTop(event) {
            if (event.allDay) return 0;

            const [hours, minutes] = event.startTime.split(":");
            return ((parseInt(hours) * 60 + parseInt(minutes)) / 60) * 20;
        },

        getEventHeight(event) {
            if (event.allDay) return 20;

            const [startHours, startMinutes] = event.startTime.split(":");
            const [endHours, endMinutes] = event.endTime.split(":");

            const startMinutesTotal =
                parseInt(startHours) * 60 + parseInt(startMinutes);
            const endMinutesTotal =
                parseInt(endHours) * 60 + parseInt(endMinutes);

            const durationMinutes = endMinutesTotal - startMinutesTotal;
            return Math.max(20, (durationMinutes / 60) * 20);
        },

        prevMonth() {
            if (this.currentMonth === 0) {
                this.currentMonth = 11;
                this.currentYear--;
            } else {
                this.currentMonth--;
            }
            this.generateCalendarDays();
        },

        nextMonth() {
            if (this.currentMonth === 11) {
                this.currentMonth = 0;
                this.currentYear++;
            } else {
                this.currentMonth++;
            }
            this.generateCalendarDays();
        },

        setToday() {
            const today = new Date();
            this.currentMonth = today.getMonth();
            this.currentYear = today.getFullYear();
            this.selectedDay = {
                date: today.getDate(),
                month: today.getMonth(),
                year: today.getFullYear(),
                dayOfWeek: today.getDay(),
            };
            this.generateCalendarDays();
            this.generateWeekDays();
        },

        changeView(view) {
            this.calendarView = view;
            if (view === "Week") {
                this.generateWeekDays();
            }
        },

        generateCalendarDays() {
            // This is handled by the computed property 'calendarDays'
        },

        generateWeekDays() {
            // This is handled by the computed property 'weekDays'
        },

        addNewEvent() {
            const today = new Date();
            this.editingEvent = {
                id: null,
                title: "",
                type: "meeting",
                date: this.formatDate(today),
                allDay: false,
                startTime: "09:00",
                endTime: "10:00",
                description: "",
            };
            this.showEventModal = true;
        },

        addEventForDate(day) {
            const date = new Date(day.year, day.month, day.date);
            this.editingEvent = {
                id: null,
                title: "",
                type: "meeting",
                date: this.formatDate(date),
                allDay: false,
                startTime: "09:00",
                endTime: "10:00",
                description: "",
            };
            this.showEventModal = true;
        },

        addEventForDateAndHour(day, hour) {
            const date = new Date(day.year, day.month, day.date);
            const startHour = String(hour).padStart(2, "0");
            const endHour = String(hour + 1).padStart(2, "0");

            this.editingEvent = {
                id: null,
                title: "",
                type: "meeting",
                date: this.formatDate(date),
                allDay: false,
                startTime: `${startHour}:00`,
                endTime: `${endHour}:00`,
                description: "",
            };
            this.showEventModal = true;
        },

        saveEvent() {
            if (this.editingEvent.id) {
                // Update existing event
                const index = this.events.findIndex(
                    (e) => e.id === this.editingEvent.id
                );
                if (index !== -1) {
                    this.events[index] = {
                        ...this.editingEvent
                    };
                }
            } else {
                // Add new event
                const newId =
                    this.events.length > 0 ?
                    Math.max(...this.events.map((e) => e.id)) + 1 :
                    1;
                this.events.push({
                    ...this.editingEvent,
                    id: newId,
                });
            }

            this.showEventModal = false;
        },

        viewEvent(event) {
            this.selectedEvent = {
                ...event
            };
            this.showViewEventModal = true;
        },

        editEvent(event) {
            this.editingEvent = {
                ...event
            };
            this.showViewEventModal = false;
            this.showEventModal = true;
        },

        deleteEvent(eventId) {
            if (confirm("Are you sure you want to delete this event?")) {
                const id = eventId || this.editingEvent.id;
                this.events = this.events.filter((e) => e.id !== id);
                this.showViewEventModal = false;
                this.showEventModal = false;
            }
        },
    };
};