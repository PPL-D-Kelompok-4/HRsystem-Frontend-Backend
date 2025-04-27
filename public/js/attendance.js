const App = {
    currentTime: '',
    todayAttendance: {
        checkIn: null,
        checkOut: null
    },
    workSchedules: [
        {
            description: "Regular Work Hours",
            startTime: "08:00",
            endTime: "17:00"
        }
    ],

    init() {
        this.setCurrentDate();
        this.startClock();
        this.updateTodayAttendanceUI();
        this.disableCheckInIfAlready();
        this.disableCheckOutIfInvalid();
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

    setCurrentDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const currentDate = new Date().toLocaleDateString('en-US', options);
        const currentDateEl = document.getElementById('currentDate');
        if (currentDateEl) currentDateEl.textContent = currentDate;
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
            durationEl.textContent = this.calculateDuration(this.todayAttendance.checkIn, this.todayAttendance.checkOut);
        }
    },

    checkIn() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timeString = `${hours}:${minutes}`;

        this.todayAttendance.checkIn = timeString;
        this.updateTodayAttendanceUI();
        this.disableCheckInIfAlready();
        this.disableCheckOutIfInvalid();

        alert('Check-in successful!');
    },

    checkOut() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timeString = `${hours}:${minutes}`;

        this.todayAttendance.checkOut = timeString;
        this.updateTodayAttendanceUI();
        this.disableCheckInIfAlready();
        this.disableCheckOutIfInvalid();

        alert('Check-out successful!');
    },

    disableCheckInIfAlready() {
        const checkInBtn = document.getElementById('checkInBtn');
        if (!checkInBtn) return;

        if (this.todayAttendance.checkIn) {
            checkInBtn.disabled = true;
            checkInBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            checkInBtn.disabled = false;
            checkInBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    },

    disableCheckOutIfInvalid() {
        const checkOutBtn = document.getElementById('checkOutBtn');
        if (!checkOutBtn) return;

        if (!this.todayAttendance.checkIn || this.todayAttendance.checkOut) {
            checkOutBtn.disabled = true;
            checkOutBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            checkOutBtn.disabled = false;
            checkOutBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }
};

function openModal() {
    const modal = document.getElementById('attendanceHistoryModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeModal() {
    const modal = document.getElementById('attendanceHistoryModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    App.init();

    const openHistoryBtn = document.getElementById('openHistoryModalBtn');
    if (openHistoryBtn) {
        openHistoryBtn.addEventListener('click', openModal);
    }
});
