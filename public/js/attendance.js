const App = {
	currentTime: "",
	todayAttendance: {
		checkIn: null,
		checkOut: null,
	},
	workSchedules: [
		{
			description: "Regular Work Hours",
			startTime: "08:00",
			endTime: "17:00",
		},
	],

	async init() {
		try {
			const response = await fetch("http://localhost:3000/api/auth/me", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			});

			if (!response.ok) {
				const err = await response.json();
				throw new Error(err.message || "Failed to fetch user");
			}

			const user = await response.json();

			window.userProfile = {
				employeeID: user.employeeID,
			};

			console.log("User profile loaded for attendance:", userProfile);

			this.setCurrentDate();
			this.startClock();

			// 🔥 langsung load semua data attendance
			await this.loadTodayAttendance();
			await this.loadAttendanceHistory();
		} catch (error) {
			console.error("Error fetching user profile:", error.message);
			window.location.href = "/login";
		}
	},

	startClock() {
		this.updateClock();
		setInterval(() => this.updateClock(), 1000);
	},

	updateClock() {
		const now = new Date();
		const hours = String(now.getHours()).padStart(2, "0");
		const minutes = String(now.getMinutes()).padStart(2, "0");
		const seconds = String(now.getSeconds()).padStart(2, "0");
		this.currentTime = `${hours}:${minutes}:${seconds}`;

		const el = document.getElementById("currentTime");
		if (el) el.innerText = this.currentTime;
	},

	setCurrentDate() {
		const options = {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		const currentDate = new Date().toLocaleDateString("en-US", options);
		const currentDateEl = document.getElementById("currentDate");
		if (currentDateEl) currentDateEl.textContent = currentDate;
	},

	formatTime(timeString) {
		if (!timeString) return "-";
		const [hours, minutes] = timeString.split(":");
		const h = parseInt(hours) % 12 || 12;
		const ampm = parseInt(hours) < 12 ? "AM" : "PM";
		return `${h}:${minutes} ${ampm}`;
	},

	calculateDuration(checkIn, checkOut) {
		if (!checkIn || !checkOut) return "-";

		const [inHours, inMinutes] = checkIn.split(":");
		const [outHours, outMinutes] = checkOut.split(":");

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
		const checkInEl = document.getElementById("checkInTimeText");
		const checkOutEl = document.getElementById("checkOutTimeText");
		const durationEl = document.getElementById("workDurationText");

		if (checkInEl) {
			checkInEl.textContent = this.todayAttendance.checkIn
				? this.formatTime(this.todayAttendance.checkIn)
				: "Not checked in yet";
		}

		if (checkOutEl) {
			checkOutEl.textContent = this.todayAttendance.checkOut
				? this.formatTime(this.todayAttendance.checkOut)
				: "Not checked out yet";
		}

		if (durationEl) {
			durationEl.textContent = this.calculateDuration(
				this.todayAttendance.checkIn,
				this.todayAttendance.checkOut
			);
		}
	},

	async checkIn() {
		if (!window.userProfile || !userProfile.employeeID) {
			Swal.fire({
				icon: "warning",
				title: "No Data",
				text: "User profile not loaded yet.",
			});
			return;
		}

		try {
			const response = await fetch("/api/attendance/clock-in", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ employeeID: userProfile.employeeID }),
			});

			const data = await response.json();

			if (data.message === "Clock in recorded successfully") {
				Swal.fire({
					toast: true,
					position: "top-end",
					icon: "success",
					title: "Check-in successful!",
					showConfirmButton: false,
					timer: 3000,
					timerProgressBar: true,
				});

				await this.loadTodayAttendance(); // ← 🔥 reload status dari server
			} else {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: data.message || "Check-in failed!",
				});
			}
		} catch (error) {
			console.error("Error during check-in:", error);
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "Check-in error!",
			});
		}
	},

	async checkOut() {
		if (!window.userProfile || !userProfile.employeeID) {
			Swal.fire({
				icon: "warning",
				title: "No Data",
				text: "User profile not loaded yet.",
			});
			return;
		}

		try {
			const response = await fetch("/api/attendance/clock-out", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ employeeID: userProfile.employeeID }),
			});

			const data = await response.json();

			if (data.message === "Clock out recorded successfully") {
				Swal.fire({
					toast: true,
					position: "top-end",
					icon: "success",
					title: "Check-out successful!",
					showConfirmButton: false,
					timer: 3000,
					timerProgressBar: true,
				});

				await this.loadTodayAttendance(); // ← 🔥 reload status dari server
			} else {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: data.message || "Check-in failed!",
				});
			}
		} catch (error) {
			console.error("Error during check-out:", error);
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "Check-out error!",
			});
		}
	},

	disableCheckInIfAlready() {
		const checkInBtn = document.getElementById("checkInBtn");
		if (!checkInBtn) return;

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

		if (!this.todayAttendance.checkIn || this.todayAttendance.checkOut) {
			checkOutBtn.disabled = true;
			checkOutBtn.classList.add("opacity-50", "cursor-not-allowed");
		} else {
			checkOutBtn.disabled = false;
			checkOutBtn.classList.remove("opacity-50", "cursor-not-allowed");
		}
	},
	async loadTodayAttendance() {
		if (!window.userProfile || !userProfile.employeeID) {
			console.error("User profile not loaded yet.");
			return;
		}

		try {
			const response = await fetch(
				`/api/attendance/today/${userProfile.employeeID}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				}
			);

			if (!response.ok) {
				if (response.status === 404) {
					// Tidak ada record hari ini
					console.log("No attendance record found for today");
					this.todayAttendance.checkIn = null;
					this.todayAttendance.checkOut = null;
					this.updateTodayAttendanceUI();
					this.disableCheckInIfAlready();
					this.disableCheckOutIfInvalid();
					return;
				} else {
					const err = await response.json();
					throw new Error(err.message || "Failed to load today's attendance");
				}
			}

			const todayRecord = await response.json();
			console.log("Today attendance record:", todayRecord);

			this.todayAttendance.checkIn = todayRecord.jam_Masuk
				? todayRecord.jam_Masuk.slice(0, 5)
				: null;
			this.todayAttendance.checkOut = todayRecord.jam_Keluar
				? todayRecord.jam_Keluar.slice(0, 5)
				: null;

			this.updateTodayAttendanceUI();
			this.disableCheckInIfAlready();
			this.disableCheckOutIfInvalid();
		} catch (error) {
			console.error("Error loading today's attendance:", error.message);
		}
	},

	async loadAttendanceHistory() {
		console.log(
			"Fetching attendance history for employeeID:",
			userProfile.employeeID
		);

		try {
			const response = await fetch(
				`/api/attendance/employee/${userProfile.employeeID}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				}
			);

			if (!response.ok) {
				const err = await response.json();
				throw new Error(err.message || "Failed to load attendance history");
			}

			const history = await response.json();
			console.log("Attendance History:", history);

			fullAttendanceHistory = history; // 🆕 simpan semua data yang di-fetch

			this.populateHistoryTable(fullAttendanceHistory);
			this.populateRecentAttendance(fullAttendanceHistory);
			updateSummaryStats(fullAttendanceHistory); // 🆕 update ringkasan awal
		} catch (error) {
			console.error("Error loading attendance history:", error.message);
		}
	},

	populateRecentAttendance(history) {
		const tableBody = document.getElementById("attendanceTableBody");
		if (!tableBody) return;

		tableBody.innerHTML = ""; // Clear existing rows

		if (history.length === 0) {
			tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-4 text-gray-500">
                        No recent attendance records.
                    </td>
                </tr>
            `;
			return;
		}

		// Hanya tampilkan 5 record terbaru
		history.slice(0, 5).forEach((record) => {
			const tr = document.createElement("tr");
			tr.className = "hover:bg-gray-100";

			tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">${new Date(
									record.tanggal
								).toLocaleDateString("en-US", {
									year: "numeric",
									month: "short",
									day: "numeric",
								})}</td>
                <td class="px-6 py-4 whitespace-nowrap">${
									record.jam_Masuk ? record.jam_Masuk.slice(0, 5) : "-"
								}</td>
                <td class="px-6 py-4 whitespace-nowrap">${
									record.jam_Keluar ? record.jam_Keluar.slice(0, 5) : "-"
								}</td>
                <td class="px-6 py-4 whitespace-nowrap">${
									record.status || "-"
								}</td>
            `;
			tableBody.appendChild(tr);
		});
	},

	populateHistoryTable(history) {
		const tableBody = document.getElementById("historyTableBody");
		if (!tableBody) return;

		tableBody.innerHTML = ""; // Clear existing rows

		if (history.length === 0) {
			tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-4 text-gray-500">
                        No attendance records found.
                    </td>
                </tr>
            `;
			return;
		}

		history.forEach((record) => {
			const tr = document.createElement("tr");
			tr.className = "hover:bg-gray-100"; // optional: biar ada efek hover

			tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">${new Date(
									record.tanggal
								).toLocaleDateString("en-US", {
									year: "numeric",
									month: "short",
									day: "numeric",
								})}</td>
                <td class="px-6 py-4 whitespace-nowrap">${
									record.jam_Masuk ? record.jam_Masuk.slice(0, 5) : "-"
								}</td>
                <td class="px-6 py-4 whitespace-nowrap">${
									record.jam_Keluar ? record.jam_Keluar.slice(0, 5) : "-"
								}</td>
                <td class="px-6 py-4 whitespace-nowrap">${
									record.status || "-"
								}</td>
            `;
			tableBody.appendChild(tr);
		});
	},
};

function openModal() {
	const modal = document.getElementById("attendanceHistoryModal");
	if (modal) {
		modal.classList.remove("hidden");
	}
}

function closeModal() {
	const modal = document.getElementById("attendanceHistoryModal");
	if (modal) {
		modal.classList.add("hidden");
	}
}

// Tempat untuk menyimpan full attendance data saat modal dibuka
let fullAttendanceHistory = [];

function setupModalEvents() {
	const filterMonth = document.getElementById("filterMonth");
	const filterStatus = document.getElementById("filterStatus");
	const exportBtn = document.getElementById("exportAttendanceBtn");

	if (filterMonth) {
		filterMonth.onchange = applyFilters;
	}
	if (filterStatus) {
		filterStatus.onchange = applyFilters;
	}
	if (exportBtn) {
		exportBtn.onclick = exportAttendance;
	}
}

function applyFilters() {
	const monthFilter = document.getElementById("filterMonth").value;
	const statusFilter = document.getElementById("filterStatus").value;

	let filteredData = [...fullAttendanceHistory];

	if (monthFilter !== "all") {
		filteredData = filteredData.filter((record) => {
			const recordMonth = new Date(record.tanggal).getMonth().toString();
			return recordMonth === monthFilter;
		});
	}

	if (statusFilter !== "all") {
		filteredData = filteredData.filter((record) => {
			// Sesuaikan lowercase biar tahan typo
			return (record.status || "").toLowerCase() === statusFilter.toLowerCase();
		});
	}

	App.populateHistoryTable(filteredData); // ← Pastikan pakai object App
	updateSummaryStats(filteredData);
}

function exportAttendance() {
	if (fullAttendanceHistory.length === 0) {
		Swal.fire({
			icon: "warning",
			title: "No Data",
			text: "No attendance data to export!",
		});
		return;
	}

	let csvContent = "Date,Check In,Check Out,Status\n";

	fullAttendanceHistory.forEach((record) => {
		const date = new Date(record.tanggal).toLocaleDateString("en-US");
		const checkIn = record.jam_Masuk ? record.jam_Masuk.slice(0, 5) : "-";
		const checkOut = record.jam_Keluar ? record.jam_Keluar.slice(0, 5) : "-";
		const status = record.status || "-";
		csvContent += `${date},${checkIn},${checkOut},${status}\n`;
	});

	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.setAttribute("href", url);
	link.setAttribute("download", "attendance_history.csv");
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	Swal.fire({
		toast: true,
		position: "top-end",
		icon: "success",
		title: "Attendance exported successfully!",
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
	});
}

function updateSummaryStats(records) {
	let hadir = 0;
	let izin = 0;
	let sakit = 0;
	let cuti = 0;

	records.forEach((record) => {
		const status = (record.status || "").toLowerCase();
		if (status === "Hadir" || status === "hadir") {
			hadir++;
		} else if (status === "Izin" || status === "izin") {
			izin++;
		} else if (status === "Sakit" || status === "sakit") {
			sakit++;
		} else if (status === "Cuti" || status === "cuti") {
			cuti++;
		}
	});

	document.getElementById("summaryHadir").innerText = hadir;
	document.getElementById("summaryIzin").innerText = izin;
	document.getElementById("summarySakit").innerText = sakit;
	document.getElementById("summaryCuti").innerText = cuti;
}

document.addEventListener("DOMContentLoaded", () => {
	App.init();

	const openHistoryBtn = document.getElementById("openHistoryModalBtn");
	if (openHistoryBtn) {
		openHistoryBtn.addEventListener("click", async () => {
			await App.loadAttendanceHistory();
			setupModalEvents();
			openModal();
		});
	}
});
