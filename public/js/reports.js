// reports.js

document.addEventListener("DOMContentLoaded", () => {
    const state = {
        reportYear: "2025",
        reportMonth: "January",
        reportSearch: "",
        reportPage: 1,
        reportsPerPage: 10,
        sortKey: "name",
        sortAsc: true,
        allReports: [
            { name: "Alice", workSchedule: "Morning", attend: 20, leave: 1, noInformation: 0 },
            { name: "Bob", workSchedule: "Evening", attend: 18, leave: 2, noInformation: 1 },
            { name: "Charlie", workSchedule: "Morning", attend: 22, leave: 0, noInformation: 0 },
            // Add more dummy records if needed
        ]
    };

    const yearSelect = document.querySelector("[data-report-year]");
    const monthSelect = document.querySelector("[data-report-month]");
    const searchInput = document.querySelector("[data-report-search]");
    const reportRows = document.querySelector("[data-report-rows]");
    const paginationSummary = document.querySelector("[data-pagination-report-summary]");
    const prevBtn = document.querySelector("[data-prev-report]");
    const nextBtn = document.querySelector("[data-next-report]");
    const printBtn = document.querySelector("[data-print-report]");

    function filterAndSortReports() {
        let filtered = state.allReports.filter(r => {
            return r.name.toLowerCase().includes(state.reportSearch.toLowerCase());
        });

        if (state.sortKey === "name") {
            filtered.sort((a, b) => state.sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
        } else if (state.sortKey === "attendance") {
            filtered.sort((a, b) => state.sortAsc ? b.attend - a.attend : a.attend - b.attend);
        }

        return filtered;
    }

    function renderReports() {
        const reports = filterAndSortReports();
        const start = (state.reportPage - 1) * state.reportsPerPage;
        const paginated = reports.slice(start, start + state.reportsPerPage);

        reportRows.innerHTML = paginated.length > 0 ? paginated.map(record => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.workSchedule}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.attend}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.leave}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.noInformation}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.leave + record.noInformation}</td>
            </tr>
        `).join("") : `
            <tr>
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                    No reports found for the selected criteria.
                </td>
            </tr>
        `;

        paginationSummary.textContent = `Showing ${Math.min(state.reportPage * state.reportsPerPage, reports.length)} of ${reports.length} Employee(s)`;

        prevBtn.disabled = state.reportPage === 1;
        nextBtn.disabled = state.reportPage >= Math.ceil(reports.length / state.reportsPerPage);
    }

    yearSelect.addEventListener("change", (e) => {
        state.reportYear = e.target.value;
        renderReports();
    });

    monthSelect.addEventListener("change", (e) => {
        state.reportMonth = e.target.value;
        renderReports();
    });

    searchInput.addEventListener("input", (e) => {
        state.reportSearch = e.target.value;
        renderReports();
    });

    document.querySelectorAll("[data-sort]").forEach(th => {
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
        const totalPages = Math.ceil(filterAndSortReports().length / state.reportsPerPage);
        if (state.reportPage < totalPages) {
            state.reportPage++;
            renderReports();
        }
    });

    printBtn.addEventListener("click", () => {
        window.print();
    });

    // Init
    renderReports();
});
