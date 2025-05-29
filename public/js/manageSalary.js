document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector('[data-salary-rows]');
    const nameInput = document.querySelector('input[name="employeeName"]');
    const positionInput = document.querySelector('input[name="employeePosition"]');
    const departmentInput = document.querySelector('input[name="employeeDepartment"]');
    let currentPayrollID = null;

    const baseInput = document.querySelector('input[name="baseSalary"]');
    const bonusInput = document.querySelector('input[name="bonus"]');
    const allowanceInput = document.querySelector('input[name="allowance"]');
    const deductionInput = document.querySelector('input[name="deduction"]');
    const paymentStatusInput = document.querySelector('select[name="paymentStatus"]');

    const netSalaryDisplay = document.querySelector(".text-2xl.font-semibold.text-gray-800.mt-1");
    const breakdownItems = document.querySelectorAll(".text-sm.text-gray-500 span.font-medium");
    const calculateButton = document.querySelector("button.bg-black");
    const saveButton = document.querySelector("button.bg-green-600");
    const resetButton = document.querySelector("button.border.border-gray-300");

    const periodeFilter = document.querySelector('select[name="periode"]');
    const deptFilter = document.querySelector('select[name="department"]');
    const statusFilter = document.querySelector('select[name="status"]');
    const searchInput = document.querySelector('input[name="search"]');

    const STATUS_PAID_DB = "Lunas";
    const STATUS_PENDING_DB = "Belum Lunas";
    const STATUS_PAID_DISPLAY = "Paid";
    const STATUS_PENDING_DISPLAY = "Pending";

    function formatRupiah(amount) {
        return 'Rp' + Number(amount).toLocaleString('id-ID');
    }

    function parseNumber(str) {
        return parseInt(String(str).replace(/[^\d]/g, "")) || 0;
    }

    function calculateNetSalary() {
        const base = parseNumber(baseInput.value);
        const bonus = parseNumber(bonusInput.value);
        const allowance = parseNumber(allowanceInput.value);
        const deductions = parseNumber(deductionInput.value);
        const net = base + bonus + allowance - deductions;

        netSalaryDisplay.textContent = formatRupiah(net);
        breakdownItems[0].textContent = formatRupiah(base);
        breakdownItems[1].textContent = formatRupiah(bonus);
        breakdownItems[2].textContent = formatRupiah(allowance);
        breakdownItems[3].textContent = "-" + formatRupiah(deductions);
    }

    function resetForm() {
        nameInput.value = '';
        positionInput.value = '';
        departmentInput.value = '';
        baseInput.value = 0;
        bonusInput.value = 0;
        allowanceInput.value = 0;
        deductionInput.value = 0;
        paymentStatusInput.value = STATUS_PENDING_DISPLAY;
        paymentStatusInput.disabled = true;
        currentPayrollID = null;
        calculateNetSalary();
    }

    function getStatusBadge(statusDB) {
        if (statusDB === STATUS_PAID_DB) {
            return `<span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">${STATUS_PAID_DISPLAY}</span>`;
        } else {
            return `<span class="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">${STATUS_PENDING_DISPLAY}</span>`;
        }
    }

    function renderSalaries(data) {
        tbody.innerHTML = '';
        data.forEach(payroll => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payroll.employee_name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${payroll.nama_Jabatan || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatRupiah(payroll.gaji_Pokok)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatRupiah(payroll.bonus)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatRupiah(payroll.tunjangan)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatRupiah(payroll.potongan)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatRupiah(payroll.total_Gaji)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${getStatusBadge(payroll.status_Pembayaran)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <button class="text-gray-600 hover:text-gray-900 edit-salary p-1" data-id="${payroll.payrollID}" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    async function loadSalaries() {
        const params = new URLSearchParams();
        const periode = periodeFilter?.value;
        const department = deptFilter?.value;
        const statusQuery = statusFilter?.value; // Renamed for clarity from 'status'
        const search = searchInput?.value;

        if (periode && periode !== "Select Period") params.append("periode", periode);
        if (department && department !== "Select Department") params.append("department", department);

        // Make sure to map display status to DB status if they are different
        // For now, assuming statusQuery directly matches DB values like "Lunas" or "Belum Lunas" if used
        if (statusQuery && statusQuery !== "All Status") {
            params.append("status", statusQuery); // 'status' is the query param the backend expects
        }

        if (search) params.append("search", search);

        try {
            const res = await fetch('/api/payrolls?' + params.toString()); // Fetches from the backend
            const data = await res.json();
            renderSalaries(data); // Calls function to update the table
        } catch (err) {
            console.error('Failed to load salaries:', err);
        }
    }

    tbody.addEventListener("click", async (e) => {
        const editButton = e.target.closest("button.edit-salary");
        if (editButton) {
            const id = editButton.dataset.id;
            try {
                const res = await fetch(`/api/payrolls/${id}`);
                const data = await res.json(); 

                baseInput.value = Math.round(data.gaji_Pokok);
                bonusInput.value = Math.round(data.bonus);
                allowanceInput.value = Math.round(data.tunjangan);
                deductionInput.value = Math.round(data.potongan);
                
                if (data.status_Pembayaran === STATUS_PAID_DB) {
                    paymentStatusInput.value = STATUS_PAID_DISPLAY;
                } else {
                    paymentStatusInput.value = STATUS_PENDING_DISPLAY;
                }
                paymentStatusInput.disabled = false;
                
                nameInput.value = data.employee_name || "";
                positionInput.value = data.nama_Jabatan || "";
                departmentInput.value = data.nama_Departemen || "";

                currentPayrollID = data.payrollID;
                calculateNetSalary();
            } catch (err) {
                console.error("Failed to fetch salary detail:", err);
                paymentStatusInput.disabled = true;
            }
        }
    });

    calculateButton.addEventListener("click", (e) => {
        e.preventDefault();
        calculateNetSalary();
    });

    resetButton.addEventListener("click", (e) => {
        e.preventDefault();
        resetForm();
    });

    saveButton.addEventListener("click", async (e) => {
        e.preventDefault();
        
        if (!currentPayrollID || !nameInput.value.trim() || paymentStatusInput.disabled) {
            Swal.fire({
                icon: 'warning',
                title: 'Incomplete Data or Form Not Ready',
                text: 'Please select an employee from the table to edit first.',
            });
            return;
        }

        let statusToSave = STATUS_PENDING_DB;
        if (paymentStatusInput.value === STATUS_PAID_DISPLAY) {
            statusToSave = STATUS_PAID_DB;
        }

        const payload = {
            gaji_Pokok: parseNumber(baseInput.value),
            bonus: parseNumber(bonusInput.value),
            tunjangan: parseNumber(allowanceInput.value),
            potongan: parseNumber(deductionInput.value),
            status_Pembayaran: statusToSave
        };

        Swal.fire({
            title: 'Save Changes?',
            text: "Are you sure you want to save this salary data?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`/api/payrolls/${currentPayrollID}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });
                    const responseData = await res.json();
                    if (res.ok) {
                        Swal.fire(
                            'Saved!',
                            'Salary data has been updated successfully.',
                            'success'
                        );
                        loadSalaries();
                        resetForm();
                    } else {
                        Swal.fire(
                            'Failed!',
                            responseData.message || "Failed to update data.",
                            'error'
                        );
                    }
                } catch (err) {
                    console.error("Error updating salary:", err);
                    Swal.fire(
                        'Error!',
                        'An error occurred while contacting the server.',
                        'error'
                    );
                }
            }
        });
    });

    periodeFilter?.addEventListener("change", loadSalaries);
    deptFilter?.addEventListener("change", loadSalaries);
    statusFilter?.addEventListener("change", loadSalaries);
    
    searchInput?.addEventListener("input", () => {
        clearTimeout(window._searchDelay);
        window._searchDelay = setTimeout(loadSalaries, 300);
    });

    resetForm();
    loadSalaries();
});