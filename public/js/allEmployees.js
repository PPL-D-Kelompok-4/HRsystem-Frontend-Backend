document.addEventListener("DOMContentLoaded", () => {
    const employeeSearchInput = document.getElementById("employeeSearchInput");
    const sortMenuToggle = document.getElementById("sortMenuToggle");
    const sortDropdown = document.getElementById("sortDropdown");
    const sortLabel = document.getElementById("sortLabel");

    let employeeSortType = "name-asc";

    // 🔽 Dropdown toggle
    sortMenuToggle.addEventListener("click", () => {
        sortDropdown.classList.toggle("hidden");
    });

    document.querySelectorAll(".sortOption").forEach(btn => {
        btn.addEventListener("click", () => {
            employeeSortType = btn.dataset.sort;
            sortLabel.textContent = getSortLabel(employeeSortType);
            sortTableRows(employeeSortType);
        });
    });

    // 🔍 Search filter
    employeeSearchInput.addEventListener("input", (e) => {
        const search = e.target.value.toLowerCase();
        const rows = document.querySelectorAll("#employeeTableBody tr");

        rows.forEach(row => {
            const name = row.querySelector("td:nth-child(3)")?.textContent.toLowerCase();
            row.style.display = name.includes(search) ? "" : "none";
        });
    });

    // 🔀 Sort helper
    function sortTableRows(sortType) {
        const tableBody = document.getElementById("employeeTableBody");
        const rows = Array.from(tableBody.querySelectorAll("tr"));

        rows.sort((a, b) => {
            const nameA = a.querySelector("td:nth-child(3)")?.textContent.toLowerCase();
            const nameB = b.querySelector("td:nth-child(3)")?.textContent.toLowerCase();
            const idA = a.querySelector("td:nth-child(2)")?.textContent;
            const idB = b.querySelector("td:nth-child(2)")?.textContent;

            switch (sortType) {
                case "name-asc": return nameA.localeCompare(nameB);
                case "name-desc": return nameB.localeCompare(nameA);
                case "id": return idA.localeCompare(idB);
                default: return 0;
            }
        });

        rows.forEach(row => tableBody.appendChild(row)); // Re-append in new order
    }

    function getSortLabel(type) {
        switch (type) {
            case "name-asc": return "Name (A-Z)";
            case "name-desc": return "Name (Z-A)";
            case "id": return "Employee ID";
            default: return "Sort";
        }
    }

    // 🧭 Menu toggle
    window.toggleEmployeeMenu = (index) => {
        const menu = document.getElementById(`employeeMenu-${index}`);
        const button = document.getElementById(`employeeMenuButton-${index}`);
    
        // Tutup semua menu lain, reset semua tombol ke z-10
        document.querySelectorAll("[id^='employeeMenu-']").forEach(m => {
            if (m !== menu) m.classList.add("hidden");
        });
        document.querySelectorAll("[id^='employeeMenuButton-']").forEach(b => {
            b.classList.remove("z-30");
            b.classList.add("z-10");
        });
    
        // Toggle menu
        if (menu.classList.contains('hidden')) {
            menu.classList.remove('hidden');
            button.classList.remove('z-10');
            button.classList.add('z-30'); // Yang ditekan z-30
        } else {
            menu.classList.add('hidden');
            button.classList.remove('z-30');
            button.classList.add('z-10');
        }
    };


    window.editEmployee = (index) => {
        alert("Edit employee index: " + index);
        // Optional: Redirect to edit page with ID
    };

    window.changeEmployeeStatus = (index, status) => {
        alert(`Set status of employee index ${index} to ${status}`);
        // Optional: Call API or refresh page
    };

    window.deleteEmployee = (index) => {
        alert("Delete employee index: " + index);
        // Optional: Confirm delete and send request
    };

    // Set initial label
    sortLabel.textContent = getSortLabel(employeeSortType);
});
