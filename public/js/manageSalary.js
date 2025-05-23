document.addEventListener("DOMContentLoaded", () => {
    const baseInput = document.querySelector('input[value="3000000"]');
    const bonusInput = document.querySelector('input[value="300000"]');
    const allowanceInput = document.querySelector('input[value="200000"]');
    const deductionInput = document.querySelector('input[value="50000"]');

    const netSalaryDisplay = document.querySelector(".text-2xl.font-semibold.text-gray-800.mt-1");
    const breakdownItems = document.querySelectorAll(".text-sm.text-gray-500 span.font-medium");

    const calculateButton = document.querySelector("button.bg-black");
    const saveButton = document.querySelector("button.bg-green-600");
    const resetButton = document.querySelector("button.border.border-gray-300");

    function parseNumber(str) {
        return parseInt(str.replace(/[^\d]/g, "")) || 0;
    }

    function formatRupiah(amount) {
        return 'Rp' + amount.toLocaleString('id-ID');
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
        breakdownItems[3].textContent = "-"+formatRupiah(deductions);
    }

    function resetForm() {
        baseInput.value = 3000000;
        bonusInput.value = 300000;
        allowanceInput.value = 200000;
        deductionInput.value = 50000;
        calculateNetSalary();
    }

    calculateButton.addEventListener("click", (e) => {
        e.preventDefault();
        calculateNetSalary();
    });

    resetButton.addEventListener("click", (e) => {
        e.preventDefault();
        resetForm();
    });

    saveButton.addEventListener("click", (e) => {
        e.preventDefault();
        alert("Salary data saved (simulation only)");
        // Di sini kamu bisa menambahkan logic AJAX atau penyimpanan lainnya jika diperlukan
    });

    // Initial calculation
    calculateNetSalary();
});
