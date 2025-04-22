document.addEventListener("DOMContentLoaded", () => {
    const state = {
        selectedYear: "2025",
        paySlipSearch: "",
        paySlipPage: 1,
        paySlipsPerPage: 10,
        selectedPaySlip: {},
        paySlips: [], // Harus diisi secara dinamis, contoh dummy di bawah
    };

    // Dummy data pay slip
    state.paySlips = [
        { period: "Jan 2025", issueDate: "2025-01-31", netPay: "Rp3.500.000", status: "Paid" },
        { period: "Feb 2025", issueDate: "2025-02-28", netPay: "Rp3.650.000", status: "Paid" },
        { period: "Mar 2025", issueDate: "2025-03-31", netPay: "Rp3.550.000", status: "Pending" },
        { period: "Mar 2024", issueDate: "2024-03-31", netPay: "Rp3.550.000", status: "Pending" }
        
        // tambahkan data lain jika perlu
    ];

    const viewContainer = document.getElementById("salary-view");
    const yearSelect = document.querySelector("[data-model='selectedYear']");
    const searchInput = document.querySelector("[data-model='paySlipSearch']");
    const bindYearText = document.querySelector("[data-bind='selectedYear']");
    const tbody = document.querySelector("[data-payslips]");
    const paginationSummary = document.querySelector("[data-pagination-summary]");
    const prevBtn = document.querySelector("[data-prev-page]");
    const nextBtn = document.querySelector("[data-next-page]");

    const modal = document.querySelector("[data-modal]");
    const closeModalBtn = document.querySelector("[data-close-modal]");
    const downloadModalBtn = document.querySelector("[data-download-modal]");

    const bindModalFields = () => {
        modal.querySelectorAll("[data-bind]").forEach(el => {
            const key = el.getAttribute("data-bind");
            const value = key.split(".").reduce((o, i) => o?.[i], state);
            el.textContent = value || "";
        });
    };

    const filterPaySlips = () => {
        return state.paySlips.filter(slip => {
            const matchesYear = slip.issueDate.startsWith(state.selectedYear);
            const matchesSearch = slip.period.toLowerCase().includes(state.paySlipSearch.toLowerCase()) ||
            slip.status.toLowerCase().includes(state.paySlipSearch.toLowerCase());
            return matchesYear && matchesSearch;
        });
    };

    const renderPaySlips = () => {
        const filtered = filterPaySlips();
        const start = (state.paySlipPage - 1) * state.paySlipsPerPage;
        const pageData = filtered.slice(start, start + state.paySlipsPerPage);

        tbody.innerHTML = pageData.map((slip, i) => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${slip.period}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${slip.issueDate}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${slip.netPay}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">${slip.status}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button class="text-gray-600 hover:text-gray-900" data-view-index="${i + start}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                    <button class="text-gray-600 hover:text-gray-900" data-download-index="${i + start}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </button>
                </td>
            </tr>
        `).join("");

        bindYearText.textContent = state.selectedYear;
        paginationSummary.textContent = `Showing ${Math.min(state.paySlipPage * state.paySlipsPerPage, filtered.length)} of ${filtered.length} pay slips`;

        prevBtn.disabled = state.paySlipPage === 1;
        nextBtn.disabled = state.paySlipPage >= Math.ceil(filtered.length / state.paySlipsPerPage);
    };

    const openModal = () => {
        modal.classList.remove("hidden");
    };

    const closeModal = () => {
        modal.classList.add("hidden");
    };

    const downloadPaySlip = (slip) => {
        alert(`Download PDF for ${slip.period}`);
    };

    yearSelect?.addEventListener("change", (e) => {
        state.selectedYear = e.target.value;
        renderPaySlips();
    });

    searchInput?.addEventListener("input", (e) => {
        state.paySlipSearch = e.target.value;
        renderPaySlips();
    });

    prevBtn?.addEventListener("click", () => {
        if (state.paySlipPage > 1) {
            state.paySlipPage--;
            renderPaySlips();
        }
    });

    nextBtn?.addEventListener("click", () => {
        const totalPages = Math.ceil(filterPaySlips().length / state.paySlipsPerPage);
        if (state.paySlipPage < totalPages) {
            state.paySlipPage++;
            renderPaySlips();
        }
    });

    tbody?.addEventListener("click", (e) => {
        const viewBtn = e.target.closest("[data-view-index]");
        const downloadBtn = e.target.closest("[data-download-index]");

        if (viewBtn) {
            const index = parseInt(viewBtn.getAttribute("data-view-index"), 10);
            state.selectedPaySlip = filterPaySlips()[index];
            bindModalFields();
            openModal();
        }

        if (downloadBtn) {
            const index = parseInt(downloadBtn.getAttribute("data-download-index"), 10);
            const slip = filterPaySlips()[index];
            downloadPaySlip(slip);
        }
    });

    closeModalBtn?.addEventListener("click", closeModal);
    downloadModalBtn?.addEventListener("click", () => downloadPaySlip(state.selectedPaySlip));

    // Inisialisasi awal
    viewContainer?.classList.remove("hidden");
    renderPaySlips();
});
