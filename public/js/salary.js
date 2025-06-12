// public/js/salary.js

document.addEventListener("DOMContentLoaded", () => {
    const state = {
        selectedYear: new Date().getFullYear().toString(),
        paySlipSearch: "",
        paySlipPage: 1,
        paySlipsPerPage: 10,
        selectedPaySlip: {},
        paySlips: [], // Akan diisi oleh EJS
    };

    if (typeof initialPaySlips !== 'undefined') {
        state.paySlips = initialPaySlips;
    } else {
        console.warn('initialPaySlips is not defined. Pastikan variabel ini di-passing dari template EJS.');
    }

    const viewContainer = document.getElementById("salaryView");
    const yearSelect = document.querySelector("[data-model='selectedYear']");
    const searchInput = document.querySelector("[data-model='paySlipSearch']");
    const bindYearText = document.querySelector("[data-bind='selectedYear']");
    const tbody = document.querySelector("[data-payslips]");
    const paginationSummary = document.querySelector("[data-pagination-summary]");
    const prevBtn = document.querySelector("[data-prev-page]");
    const nextBtn = document.querySelector("[data-next-page]");
    const modal = document.querySelector("[data-modal]");
    const closeModalBtn = document.querySelector("[data-close-modal]");
    
    // Tombol baru untuk download semua slip gaji
    const downloadAllBtn = document.getElementById('download-all-slips-btn');

    const bindModalFields = () => {
        if (!modal || !state.selectedPaySlip) return;
        const statusSpan = modal.querySelector('[data-bind-status-class][data-bind="selectedPaySlip.status"]');
        if (statusSpan && state.selectedPaySlip.status) {
            statusSpan.textContent = state.selectedPaySlip.status;
            statusSpan.classList.remove('bg-green-100', 'text-green-800', 'bg-yellow-100', 'text-yellow-800');
            if (state.selectedPaySlip.status === 'Paid') {
                statusSpan.classList.add('bg-green-100', 'text-green-800');
            } else {
                statusSpan.classList.add('bg-yellow-100', 'text-yellow-800');
            }
        }
        modal.querySelectorAll('[data-bind]:not([data-bind-status-class])').forEach(el => {
            const keyPath = el.getAttribute("data-bind");
            const actualKey = keyPath.startsWith("selectedPaySlip.") ? keyPath.substring("selectedPaySlip.".length) : keyPath;
            const value = actualKey.split(".").reduce((obj, part) => obj && obj[part], state.selectedPaySlip);
            el.textContent = value !== undefined && value !== null ? value : "";
        });
    };

    const filterPaySlips = () => {
        if (!state.paySlips || state.paySlips.length === 0) return [];
        return state.paySlips.filter(slip => {
            const matchesYear = slip.issueDate && slip.issueDate.startsWith(state.selectedYear);
            const searchLower = state.paySlipSearch.toLowerCase();
            const matchesSearch = (slip.period && slip.period.toLowerCase().includes(searchLower)) ||
                                  (slip.status && slip.status.toLowerCase().includes(searchLower)) ||
                                  (slip.netPay && String(slip.netPay).toLowerCase().includes(searchLower));
            return matchesYear && matchesSearch;
        });
    };

    const renderPaySlips = () => {
        if (!tbody) return;
        const filtered = filterPaySlips();
        const totalFiltered = filtered.length;
        const start = (state.paySlipPage - 1) * state.paySlipsPerPage;
        const end = start + state.paySlipsPerPage;
        const pageData = filtered.slice(start, end);
        
        tbody.innerHTML = pageData.map((slip, globalIndexOffset) => {
            const actualIndex = start + globalIndexOffset;
            return `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${slip.period || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${slip.issueDate || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${slip.netPay || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 text-xs rounded-full ${
                            slip.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }">${slip.status || 'N/A'}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button class="text-gray-600 hover:text-gray-900 p-1" data-view-index="${actualIndex}" title="View Details">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>
                    </td>
                </tr>
            `;
        }).join("");

        if (bindYearText) bindYearText.textContent = state.selectedYear;
        
        if (paginationSummary) {
            paginationSummary.textContent = totalFiltered > 0
                ? `Showing ${start + 1} to ${Math.min(end, totalFiltered)} of ${totalFiltered} pay slips`
                : `No pay slips found for ${state.selectedYear}.`;
        }
        
        if (prevBtn) prevBtn.disabled = state.paySlipPage === 1;
        if (nextBtn) nextBtn.disabled = end >= totalFiltered;
    };
    
    const openModal = () => {
        if (modal) modal.classList.remove("hidden");
    };
    
    const closeModal = () => {
        if (modal) modal.classList.add("hidden");
    };

    const downloadAllUserPaySlipsForYear = () => {
        const year = state.selectedYear;
        const downloadUrl = `/api/payrolls/download-all-my-payslips?year=${year}`;
        window.open(downloadUrl, '_blank'); 
    };

    // --- EVENT LISTENERS ---

    if (yearSelect) {
        yearSelect.value = state.selectedYear;
        yearSelect.addEventListener("change", (e) => {
            state.selectedYear = e.target.value;
            state.paySlipPage = 1;
            renderPaySlips();
            if(bindYearText) bindYearText.textContent = state.selectedYear;
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            state.paySlipSearch = e.target.value;
            state.paySlipPage = 1;
            renderPaySlips();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (state.paySlipPage > 1) {
                state.paySlipPage--;
                renderPaySlips();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            const totalFiltered = filterPaySlips().length;
            if (state.paySlipPage < Math.ceil(totalFiltered / state.paySlipsPerPage)) {
                state.paySlipPage++;
                renderPaySlips();
            }
        });
    }

    if (tbody) {
        tbody.addEventListener("click", (e) => {
            const viewBtn = e.target.closest("[data-view-index]");
            if (viewBtn) {
                const index = parseInt(viewBtn.getAttribute("data-view-index"), 10);
                const filteredSlips = filterPaySlips();
                if (index >= 0 && index < filteredSlips.length) {
                    state.selectedPaySlip = filteredSlips[index];
                    bindModalFields();
                    openModal();
                }
            }
        });
    }
    
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
    
    if (downloadAllBtn) {
        downloadAllBtn.addEventListener("click", downloadAllUserPaySlipsForYear);
    }

    // --- INITIAL RENDER ---
    if (viewContainer) viewContainer.classList.remove("hidden");
    renderPaySlips();
    if(bindYearText) bindYearText.textContent = state.selectedYear;
});