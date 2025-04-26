// dashboard.js

document.addEventListener("DOMContentLoaded", () => {
    const dashboardView = document.getElementById("dashboard-view");
    const addEmployeeBtn = document.getElementById("dashboard-add-employee");
    const totalEmployeesEl = document.querySelector("[data-dashboard-total-employees]");
    const pendingReviewsEl = document.querySelector("[data-dashboard-pending-reviews]");
    const leaveRequestsEl = document.querySelector("[data-dashboard-leave-requests]");
    const pendingLeaveContainer = document.querySelector("[data-dashboard-pending-leave-requests]");
    const noPendingRequests = document.querySelector("[data-dashboard-no-pending-requests]");
    const recentHiresContainer = document.querySelector("[data-dashboard-recent-hires]");
    const noRecentHires = document.querySelector("[data-dashboard-no-recent-hires]");
    const refreshChartBtn = document.getElementById("refresh-employee-chart");

    // Simulated data
    const employees = [
        { firstName: "Alice", lastName: "Smith", position: "Engineer", startDate: "2025-04-01" },
        { firstName: "Bob", lastName: "Johnson", position: "Designer", startDate: "2025-04-05" },
        { firstName: "Charlie", lastName: "Lee", position: "Manager", startDate: "2025-03-15" },
    ];

    const leaveRequests = [
        { employee: "Alice Smith", type: "Annual", startDate: "2025-04-20", endDate: "2025-04-22", days: 3, status: "Pending" },
        { employee: "Charlie Lee", type: "Sick", startDate: "2025-04-18", endDate: "2025-04-18", days: 1, status: "Approved" },
        { employee: "Bob Johnson", type: "Personal", startDate: "2025-04-25", endDate: "2025-04-26", days: 2, status: "Pending" }
    ];

    function formatDate(dateStr) {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateStr).toLocaleDateString(undefined, options);
    }

    function renderStats() {
        totalEmployeesEl.textContent = employees.length;
        leaveRequestsEl.textContent = leaveRequests.length;
        pendingReviewsEl.textContent = leaveRequests.filter(lr => lr.status === "Pending").length;
    }

    function renderPendingLeaveRequests() {
        const pending = leaveRequests.filter(lr => lr.status === "Pending").slice(0, 3);
        pendingLeaveContainer.innerHTML = "";

        if (pending.length === 0) {
            noPendingRequests.classList.remove("hidden");
        } else {
            noPendingRequests.classList.add("hidden");
        }

        pending.forEach((req, i) => {
            const el = document.createElement("div");
            el.className = "border-b pb-4 last:border-b-0 last:pb-0";
            el.innerHTML = `
                <div class="flex justify-between">
                    <div>
                        <p class="font-medium">${req.employee}</p>
                        <p class="text-gray-500">${req.type} - ${req.days} day${req.days > 1 ? 's' : ''}</p>
                        <p class="text-gray-400 text-sm">${req.startDate}${req.endDate !== req.startDate ? ' - ' + req.endDate : ''}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm">Pending</span>
                        <button class="text-green-600 hover:text-green-800" title="Approve">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                        </button>
                        <button class="text-red-600 hover:text-red-800" title="Reject">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            `;
            pendingLeaveContainer.appendChild(el);
        });
    }

    function renderRecentHires() {
        const hires = employees.filter(emp => {
            const daysAgo = (Date.now() - new Date(emp.startDate).getTime()) / (1000 * 60 * 60 * 24);
            return daysAgo <= 30;
        }).slice(0, 3);

        recentHiresContainer.innerHTML = "";

        if (hires.length === 0) {
            noRecentHires.classList.remove("hidden");
        } else {
            noRecentHires.classList.add("hidden");
        }

        hires.forEach(emp => {
            const el = document.createElement("div");
            el.className = "flex justify-between items-center";
            el.innerHTML = `
                <div class="flex items-center">
                    <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span class="text-gray-600 font-medium">${emp.firstName[0]}${emp.lastName[0]}</span>
                    </div>
                    <div class="ml-3">
                        <p class="font-medium">${emp.firstName} ${emp.lastName}</p>
                        <p class="text-gray-500 text-sm">${emp.position}</p>
                    </div>
                </div>
                <div>${formatDate(emp.startDate)}</div>
            `;
            recentHiresContainer.appendChild(el);
        });
    }

    refreshChartBtn?.addEventListener("click", () => {
        console.log("Refreshing chart...");
        // Insert chart.js logic if needed
    });

    addEmployeeBtn?.addEventListener("click", () => {
        dashboardView.classList.add("hidden");
        document.getElementById("add-employee-view")?.classList.remove("hidden");
    });

    renderStats();
    renderPendingLeaveRequests();
    renderRecentHires();
});
