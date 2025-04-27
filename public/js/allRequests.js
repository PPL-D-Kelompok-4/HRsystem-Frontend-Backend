document.addEventListener("DOMContentLoaded", () => {
    const state = {
        leaveRequestSearch: "",
        leaveRequestSortType: "name-asc",
        leaveRequestStatusFilter: "All",
        leaveRequestPage: 1,
        leaveRequestsPerPage: 10,
        selectedRequest: null,
        allRequests: window.serverLeaveRequests || [],
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

    const rejectModal = document.getElementById("reject-modal");
    const rejectReasonInput = document.getElementById("rejection-reason");
    const cancelRejectBtn = document.getElementById("cancel-reject");
    const confirmRejectBtn = document.getElementById("confirm-reject");
    let currentRejectRequest = null;

    function getFilteredRequests() {
        return state.allRequests
            .filter(req =>
                req.employee.toLowerCase().includes(state.leaveRequestSearch.toLowerCase())
            )
            .filter(req => {
                if (state.leaveRequestStatusFilter === "All") return true;
                if (state.leaveRequestStatusFilter === "Approved") return req.status === "Disetujui";
                if (state.leaveRequestStatusFilter === "Pending") return req.status === "Diajukan";
                if (state.leaveRequestStatusFilter === "Rejected") return req.status === "Ditolak";
                return true;
            });
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
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(req.startDate)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(req.endDate)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${req.days}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs rounded-full ${getStatusClass(req.status)}">${translateStatus(req.status)}</span>
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
                            ${
                                req.status === "Diajukan" || req.status === "Ditolak"
                                    ? `<button class="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-gray-100" data-approve-index="${index + start}">Approve</button>`
                                    : ""
                            }
                            ${
                                req.status === "Diajukan" || req.status === "Disetujui"
                                    ? `<button class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100" data-reject-index="${index + start}">Reject</button>`
                                    : ""
                            }
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

        rowsContainer.querySelectorAll("[data-dropdown-toggle]").forEach(btn => {
            const targetId = btn.getAttribute("data-dropdown-toggle");
            btn.addEventListener("click", (e) => {
                e.stopPropagation(); // Supaya click tombol tidak nutup dari document click
                const target = document.getElementById(targetId);
                const isHidden = target.classList.contains("hidden");
                closeAllDropdowns();
                if (isHidden) {
                    target.classList.remove("hidden");
                }
            });
        });                

        rowsContainer.querySelectorAll("[data-approve-index]").forEach(btn => {
            btn.addEventListener("click", async () => {
                const i = parseInt(btn.getAttribute("data-approve-index"), 10);
                const req = getSortedRequests()[i];

                try {
                    const response = await fetch(`/api/leaves/${req.id}/status`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "Disetujui" })
                    });

                    if (!response.ok) {
                        throw new Error((await response.json()).message || "Failed to approve leave");
                    }

                    req.status = "Disetujui";
                    renderRequests();
                    Swal.fire({
                        icon: "success",
                        title: "Approved!",
                        text: "Leave request approved successfully.",
                        timer: 2000,
                        showConfirmButton: false
                    });
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: error.message
                    });
                }
            });
        });

        rowsContainer.querySelectorAll("[data-reject-index]").forEach(btn => {
            btn.addEventListener("click", () => {
                const i = parseInt(btn.getAttribute("data-reject-index"), 10);
                currentRejectRequest = getSortedRequests()[i];
                rejectModal.classList.remove("hidden");
                rejectReasonInput.value = "";
            });
        });
    }

    cancelRejectBtn.addEventListener("click", () => {
        rejectModal.classList.add("hidden");
        currentRejectRequest = null;
    });

    confirmRejectBtn.addEventListener("click", async () => {
        const reason = rejectReasonInput.value.trim();
        if (!reason) {
            Swal.fire({
                icon: "warning",
                title: "Missing Reason",
                text: "Please provide a rejection reason to proceed."
            });
            return;
        }

        if (currentRejectRequest) {
            try {
                const response = await fetch(`/api/leaves/${currentRejectRequest.id}/status`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: "Ditolak", keterangan_Cuti: reason })
                });

                if (!response.ok) {
                    throw new Error((await response.json()).message || "Failed to reject leave");
                }

                currentRejectRequest.status = "Ditolak";
                currentRejectRequest.rejectionReason = reason;
                rejectModal.classList.add("hidden");
                renderRequests();
                Swal.fire({
                    icon: "success",
                    title: "Rejected!",
                    text: "Leave request rejected successfully.",
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.message
                });
            }
        }
    });

    function getStatusClass(status) {
        switch (status) {
            case "Diajukan": return "bg-yellow-100 text-yellow-800";
            case "Disetujui": return "bg-green-100 text-green-800";
            case "Ditolak": return "bg-red-100 text-red-800";
            default: return "bg-gray-300 text-gray-700";
        }
    }

    function translateStatus(status) {
        switch (status) {
            case "Diajukan": return "Pending";
            case "Disetujui": return "Approved";
            case "Ditolak": return "Rejected";
            default: return "Unknown";
        }
    }

    function openModal(request) {
        modal.classList.remove("hidden");
        for (const key in request) {
            const el = modal.querySelector(`[data-bind="${key}"]`);
            if (el) el.textContent = request[key] || "Not provided";
        }
        const badge = modal.querySelector("[data-status]");
        badge.textContent = translateStatus(request.status);
        badge.className = `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(request.status)}`;

        const rejectionSection = modal.querySelector("[data-rejection-section]");
        if (request.status === "Ditolak") {
            rejectionSection.classList.remove("hidden");
        } else {
            rejectionSection.classList.add("hidden");
        }
    }

    function closeAllDropdowns() {
        sortMenu.classList.add("hidden");
        document.querySelectorAll("[id^='dropdown-']").forEach(el => el.classList.add("hidden"));
    }      

    function closeModal() {
        modal.classList.add("hidden");
    }

    function formatDate(dateString) {
        if (!dateString) return "";
        return dateString.split('T')[0];
    }

    searchInput.addEventListener("input", e => {
        state.leaveRequestSearch = e.target.value;
        renderRequests();
    });

    sortToggle.addEventListener("click", (e) => {
        e.stopPropagation(); // Supaya tidak ketutup dari global click
        const isHidden = sortMenu.classList.contains("hidden");
        closeAllDropdowns();
        if (isHidden) {
            sortMenu.classList.remove("hidden");
        }
    });        

    sortOptions.forEach(opt => {
        opt.addEventListener("click", () => {
            state.leaveRequestStatusFilter = opt.getAttribute("data-sort-value");
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

    renderRequests();
    document.addEventListener("click", (e) => {
        closeAllDropdowns();
    });
    
});
