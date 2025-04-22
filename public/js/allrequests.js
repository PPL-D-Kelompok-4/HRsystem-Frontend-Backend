// allrequests.js

document.addEventListener("DOMContentLoaded", () => {
    const state = {
        leaveRequestSearch: "",
        leaveRequestSortType: "name-asc",
        leaveRequestPage: 1,
        leaveRequestsPerPage: 10,
        selectedRequest: null,
        allRequests: [
            { id: "LEA001", employee: "Alice", type: "Sick", startDate: "2025-04-01", endDate: "2025-04-02", days: 2, status: "Pending", reason: "Fever", contactInfo: "alice@email.com" },
            { id: "LEA002", employee: "Bob", type: "Annual", startDate: "2025-04-10", endDate: "2025-04-15", days: 6, status: "Approved", reason: "Vacation", contactInfo: "bob@email.com" },
            { id: "LEA003", employee: "Charlie", type: "Personal", startDate: "2025-04-20", endDate: "2025-04-21", days: 2, status: "Rejected", reason: "Family event", contactInfo: "", rejectionReason: "Quota exceeded" },
        ],
    };

    const searchInput = document.querySelector("[data-leave-request-search]");
    const rowsContainer = document.querySelector("[data-leave-request-rows]");
    const sortToggle = document.querySelector("[data-sort-menu-toggle]");
    const sortMenu = document.querySelector("[data-sort-menu]");
    const sortLabel = document.querySelector("[data-sort-label]");
    const sortOptions = sortMenu?.querySelectorAll("[data-sort-value]");
    const summary = document.querySelector("[data-leave-request-summary]");
    const prevBtn = document.querySelector("[data-prev-leave-request]");
    const nextBtn = document.querySelector("[data-next-leave-request]");

    const modal = document.querySelector("[data-view-request-modal]");
    const closeModalBtn = document.querySelector("[data-close-view-request-modal]");

    function getFilteredRequests() {
        return state.allRequests.filter(req =>
            req.employee.toLowerCase().includes(state.leaveRequestSearch.toLowerCase())
        );
    }

    function getSortedRequests() {
        const filtered = getFilteredRequests();
        const sorted = [...filtered];
        if (state.leaveRequestSortType === "name-asc") {
            sorted.sort((a, b) => a.status.localeCompare(b.status));
        } else if (state.leaveRequestSortType === "name-desc") {
            sorted.sort((a, b) => b.status.localeCompare(a.status));
        } else if (state.leaveRequestSortType === "id") {
            sorted.sort((a, b) => a.id.localeCompare(b.id));
        }
        return sorted;
    }

    function renderRequests() {
        const sorted = getSortedRequests();
        const start = (state.leaveRequestPage - 1) * state.leaveRequestsPerPage;
        const paginated = sorted.slice(start, start + state.leaveRequestsPerPage);

        rowsContainer.innerHTML = paginated.length > 0 ? paginated.map((req, index) => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${req.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${req.employee}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${req.type}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${req.startDate}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${req.endDate}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${req.days}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs rounded-full ${getStatusClass(req.status)}">${req.status}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                    <div class="relative inline-block text-left">
                        <button class="text-gray-400 hover:text-gray-600" data-dropdown-toggle="dropdown-${index + start}" aria-expanded="false">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                        </button>
                        <div id="dropdown-${index + start}" class="hidden absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                            <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-view-index="${index + start}">View Details</button>
                            <button class="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-gray-100" data-approve-index="${index + start}">Approve</button>
                            <button class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100" data-reject-index="${index + start}">Reject</button>
                        </div>
                    </div>
                </td>
            </tr>
        `).join("") : `
            <tr><td colspan="8" class="px-6 py-4 text-center text-sm text-gray-500">No leave requests found</td></tr>
        `;

        summary.textContent = `${sorted.length} leave request(s)`;
        prevBtn.disabled = state.leaveRequestPage === 1;
        nextBtn.disabled = state.leaveRequestPage >= Math.ceil(sorted.length / state.leaveRequestsPerPage);

        // Toggle dropdown listeners
        rowsContainer.querySelectorAll("[data-dropdown-toggle]").forEach(btn => {
            const targetId = btn.getAttribute("data-dropdown-toggle");
            btn.addEventListener("click", () => {
                document.querySelectorAll("[id^='dropdown-']").forEach(el => el.classList.add("hidden"));
                const target = document.getElementById(targetId);
                if (target) target.classList.toggle("hidden");
            });
        });

        // Approve/reject listeners
        rowsContainer.querySelectorAll("[data-approve-index]").forEach(btn => {
            btn.addEventListener("click", () => {
                const i = parseInt(btn.getAttribute("data-approve-index"), 10);
                const req = getSortedRequests()[i];
                req.status = "Approved";
                renderRequests();
            });
        });
        rowsContainer.querySelectorAll("[data-reject-index]").forEach(btn => {
            btn.addEventListener("click", () => {
                const i = parseInt(btn.getAttribute("data-reject-index"), 10);
                const req = getSortedRequests()[i];
                req.status = "Rejected";
                renderRequests();
            });
        });
    }

    function getStatusClass(status) {
        switch (status) {
            case "Pending": return "bg-yellow-100 text-yellow-800";
            case "Approved": return "bg-black text-white";
            case "Rejected": return "bg-gray-100 text-gray-800";
            default: return "";
        }
    }

    function openModal(request) {
        modal.classList.remove("hidden");
        for (const key in request) {
            const el = modal.querySelector(`[data-bind="${key}"]`);
            if (el) el.textContent = request[key] || "Not provided";
        }

        const badge = modal.querySelector("[data-status]");
        badge.textContent = request.status;
        badge.className = `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeColor(request.status)}`;

        const rejectionSection = modal.querySelector("[data-rejection-section]");
        if (request.status === "Rejected") {
            rejectionSection.classList.remove("hidden");
        } else {
            rejectionSection.classList.add("hidden");
        }
    }

    function closeModal() {
        modal.classList.add("hidden");
    }

    // Events
    searchInput.addEventListener("input", e => {
        state.leaveRequestSearch = e.target.value;
        renderRequests();
    });

    sortToggle.addEventListener("click", () => {
        sortMenu.classList.toggle("hidden");
    });

    sortOptions.forEach(opt => {
        opt.addEventListener("click", () => {
            state.leaveRequestSortType = opt.getAttribute("data-sort-value");
            sortMenu.classList.add("hidden");
            sortLabel.textContent = opt.textContent;
            renderRequests();
        });
    });

    rowsContainer.addEventListener("click", e => {
        const btn = e.target.closest("[data-view-index]");
        if (btn) {
            const index = parseInt(btn.getAttribute("data-view-index"), 10);
            const request = getSortedRequests()[index];
            state.selectedRequest = request;
            openModal(request);
        }
    });

    closeModalBtn?.addEventListener("click", closeModal);
    prevBtn?.addEventListener("click", () => {
        if (state.leaveRequestPage > 1) {
            state.leaveRequestPage--;
            renderRequests();
        }
    });
    nextBtn?.addEventListener("click", () => {
        const total = Math.ceil(getSortedRequests().length / state.leaveRequestsPerPage);
        if (state.leaveRequestPage < total) {
            state.leaveRequestPage++;
            renderRequests();
        }
    });

    function getBadgeColor(status) {
        switch (status) {
            case "Pending": return "bg-yellow-100 text-yellow-800";
            case "Approved": return "bg-green-100 text-green-800";
            case "Rejected": return "bg-red-100 text-red-800";
            default: return "";
        }
    }

    renderRequests();
});
