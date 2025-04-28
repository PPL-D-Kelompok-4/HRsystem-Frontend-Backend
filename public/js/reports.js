// reports.js

document.addEventListener("DOMContentLoaded", () => {
	const state = {
		reportYear: "all",
		reportMonth: "all",
		reportSearch: "",
		reportPage: 1,
		reportsPerPage: 10,
		sortKey: "name",
		sortAsc: true,
		allReports: [],
	};

	const yearSelect = document.querySelector("[data-report-year]");
	const monthSelect = document.querySelector("[data-report-month]");
	const searchInput = document.querySelector("[data-report-search]");
	const reportRows = document.querySelector("[data-report-rows]");
	const paginationSummary = document.querySelector(
		"[data-pagination-report-summary]"
	);
	const prevBtn = document.querySelector("[data-prev-report]");
	const nextBtn = document.querySelector("[data-next-report]");
	const exportBtn = document.querySelector("[data-export-csv]");

	async function fetchReports() {
		try {
			const response = await fetch("/api/attendance");
			const data = await response.json();

			const employeeMap = {};

			data.forEach((attendance) => {
				const date = new Date(attendance.tanggal);
				const year = date.getFullYear().toString();
				const month = date.toLocaleString("default", { month: "long" });

				// Cek kalau pilih tahun atau bulan
				const matchYear =
					state.reportYear === "all" || year === state.reportYear;
				const matchMonth =
					state.reportMonth === "all" || month === state.reportMonth;

				// Filter sesuai pilihan
				if (matchYear && matchMonth) {
					const name = attendance.employee_name;
					if (!employeeMap[name]) {
						employeeMap[name] = { name, attend: 0, leave: 0 };
					}
					if (attendance.status === "Hadir") {
						employeeMap[name].attend += 1;
					} else {
						employeeMap[name].leave += 1;
					}
				}
			});

			state.allReports = Object.values(employeeMap);
			renderReports();
		} catch (error) {
			console.error("Error fetching reports:", error);
		}
	}

	function filterAndSortReports() {
		let filtered = state.allReports.filter((r) => {
			// Search by name
			return r.name.toLowerCase().includes(state.reportSearch.toLowerCase());
		});

		if (state.sortKey === "name") {
			filtered.sort((a, b) =>
				state.sortAsc
					? a.name.localeCompare(b.name)
					: b.name.localeCompare(a.name)
			);
		} else if (state.sortKey === "attendance") {
			filtered.sort((a, b) =>
				state.sortAsc ? b.attend - a.attend : a.attend - b.attend
			);
		}

		return filtered;
	}

	function renderReports() {
		const reports = filterAndSortReports();
		const start = (state.reportPage - 1) * state.reportsPerPage;
		const paginated = reports.slice(start, start + state.reportsPerPage);

		reportRows.innerHTML =
			paginated.length > 0
				? paginated
						.map(
							(record) => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.attend}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.leave}</td>
            </tr>
        `
						)
						.join("")
				: `
            <tr>
                <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">
                    No reports found for the selected criteria.
                </td>
            </tr>
        `;

		paginationSummary.textContent = `Showing ${Math.min(
			state.reportPage * state.reportsPerPage,
			reports.length
		)} of ${reports.length} Employee(s)`;

		prevBtn.disabled = state.reportPage === 1;
		nextBtn.disabled =
			state.reportPage >= Math.ceil(reports.length / state.reportsPerPage);
	}
	function exportCsv() {
		const reports = filterAndSortReports();

		if (reports.length === 0) {
			alert("No reports to export.");
			return;
		}

		let csvContent = "data:text/csv;charset=utf-8,";
		csvContent += "Name,Attend,Leave\n"; // Header CSV

		reports.forEach((record) => {
			const row = `${record.name},${record.attend},${record.leave}`;
			csvContent += row + "\n";
		});

		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "attendance_report.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	yearSelect.addEventListener("change", (e) => {
		state.reportYear = e.target.value;
		fetchReports();
	});

	monthSelect.addEventListener("change", (e) => {
		state.reportMonth = e.target.value;
		fetchReports();
	});

	searchInput.addEventListener("input", (e) => {
		state.reportSearch = e.target.value;
		renderReports();
	});

	document.querySelectorAll("[data-sort]").forEach((th) => {
		th.addEventListener("click", () => {
			const key = th.getAttribute("data-sort");
			if (state.sortKey === key) {
				state.sortAsc = !state.sortAsc;
			} else {
				state.sortKey = key;
				state.sortAsc = true;
			}
			renderReports();
		});
	});

	prevBtn.addEventListener("click", () => {
		if (state.reportPage > 1) {
			state.reportPage--;
			renderReports();
		}
	});

	nextBtn.addEventListener("click", () => {
		const totalPages = Math.ceil(
			filterAndSortReports().length / state.reportsPerPage
		);
		if (state.reportPage < totalPages) {
			state.reportPage++;
			renderReports();
		}
	});

	exportBtn.addEventListener("click", () => {
		exportCsv();
	});

	// Init
	fetchReports();
});
