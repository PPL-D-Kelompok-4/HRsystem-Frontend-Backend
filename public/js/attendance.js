const App = {
    currentTime: '',
    showAttendanceHistoryModal: false,
    attendanceFilterMonth: 'all',
    attendanceFilterStatus: 'all',
    todayAttendance: {
        checkIn: null,
        checkOut: null
    },
    attendanceRecords: [],
    filteredAttendanceRecords: [],
    workSchedules: [],

    init() {
        // Jalankan semua inisialisasi awal
        this.filteredAttendanceRecords = [...this.attendanceRecords];

        this.setToday?.();
        this.generateCalendarDays?.();
        this.generateWeekDays?.();
        this.initReports?.();

        this.setCurrentDate();

        // Ganti $nextTick dengan setTimeout untuk menunggu DOM render
        setTimeout(() => {
            this.initEmployeeChart?.();
        });

        const today = new Date().toISOString().split('T')[0];
        const todayRecord = this.attendanceRecords.find(record => record.date === today);

        if (todayRecord) {
            this.todayAttendance.checkIn = todayRecord.checkIn;
            this.todayAttendance.checkOut = todayRecord.checkOut;
        }

        this.updateTodayAttendanceUI();
        this.disableCheckInIfAlready();
        this.disableCheckOutIfInvalid();

        this.startClock();

    },

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
        const el = document.getElementById('currentTime');
        if (el) el.innerText = this.currentTime;
    },

    formatCurrentDate() {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    setCurrentDate() {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        const currentDate = new Date().toLocaleDateString('en-US', options);
        const currentDateEl = document.getElementById('currentDate');
        if (currentDateEl) currentDateEl.textContent = currentDate;
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
        return this.calculateDuration(this.todayAttendance.checkIn, this.todayAttendance.checkOut);
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
        this.updateTodayAttendanceUI();
        this.disableCheckOutIfInvalid();
        this.disableCheckInIfAlready();
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
        this.updateTodayAttendanceUI();
        this.disableCheckOutIfInvalid();

        alert('Check-out successful!');
    },

    updateTodayAttendanceUI() {
        const checkInEl = document.getElementById('checkInTimeText');
        const checkOutEl = document.getElementById('checkOutTimeText');
        const durationEl = document.getElementById('workDurationText');
    
        if (checkInEl) {
            checkInEl.textContent = this.todayAttendance.checkIn 
                ? this.formatTime(this.todayAttendance.checkIn)
                : 'Not checked in yet';
        }
    
        if (checkOutEl) {
            checkOutEl.textContent = this.todayAttendance.checkOut 
                ? this.formatTime(this.todayAttendance.checkOut)
                : 'Not checked out yet';
        }
    
        if (durationEl) {
            durationEl.textContent = this.calculateWorkDuration();
        }
    },

    disableCheckInIfAlready() {
        const checkInBtn = document.getElementById("checkInBtn");
        if (!checkInBtn) return;
    
        // Jika sudah check-in hari ini, nonaktifkan tombol
        if (this.todayAttendance.checkIn) {
            checkInBtn.disabled = true;
            checkInBtn.classList.add("opacity-50", "cursor-not-allowed");
        } else {
            checkInBtn.disabled = false;
            checkInBtn.classList.remove("opacity-50", "cursor-not-allowed");
        }
    },
    
    disableCheckOutIfInvalid() {
        const checkOutBtn = document.getElementById("checkOutBtn");
        if (!checkOutBtn) return;
    
        // Nonaktifkan jika belum check-in atau sudah check-out
        if (!this.todayAttendance.checkIn || this.todayAttendance.checkOut) {
            checkOutBtn.disabled = true;
            checkOutBtn.classList.add("opacity-50", "cursor-not-allowed");
        } else {
            checkOutBtn.disabled = false;
            checkOutBtn.classList.remove("opacity-50", "cursor-not-allowed");
        }
    }
    
};

// Assign work schedule
App.workSchedules = [
    {
        description: "Regular Work Hours",
        startTime: "08:00",
        endTime: "17:00"
    }
];

// Jalankan saat DOM sudah siap
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

