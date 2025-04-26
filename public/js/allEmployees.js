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

    window.changeEmployeeStatus = (index, employeeId, status) => {
        // Mapping dari English ke DB ENUM
        const statusMapping = {
            "Active": "Aktif",
            "On Leave": "Cuti",
            "Inactive": "Inaktif"
        };
    
        fetch(`/allemployees/${employeeId}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status_Karyawan: statusMapping[status] })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to update status");
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
    
            // Update tampilan status di halaman tanpa reload
            const row = document.getElementById(`employeeRow-${index}`);
            const statusCell = row.querySelector("td:nth-child(7) span");
    
            if (statusCell) {
                statusCell.textContent = status;
    
                // Update warna status
                if (status === "Active") {
                    statusCell.className = "px-2 py-1 text-xs rounded-full bg-black text-white";
                } else if (status === "On Leave") {
                    statusCell.className = "px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800";
                } else if (status === "Inactive") {
                    statusCell.className = "px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800";
                } else {
                    statusCell.className = "px-2 py-1 text-xs rounded-full bg-gray-300 text-gray-700";
                }
            }
    
            // Tutup menu dropdown setelah update
            toggleEmployeeMenu(index);
        })
        .catch(err => {
            console.error(err);
            alert("Failed to update employee status");
        });
    };       

    window.deleteEmployee = (index) => {
        alert("Delete employee index: " + index);
        // Optional: Confirm delete and send request
    };

    // Set initial label
    sortLabel.textContent = getSortLabel(employeeSortType);
});
