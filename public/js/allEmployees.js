document.addEventListener("DOMContentLoaded", () => {
    const employeeSearchInput = document.getElementById("employeeSearchInput");
    const sortMenuToggle = document.getElementById("sortMenuToggle");
    const sortDropdown = document.getElementById("sortDropdown");
    const sortLabel = document.getElementById("sortLabel");
    const employeeCountText = document.getElementById("employeeCountText");
    const prevPageBtn = document.getElementById("prevPageBtn");
    const nextPageBtn = document.getElementById("nextPageBtn");

    const tableBody = document.getElementById("employeeTableBody");
    let rows = Array.from(tableBody.querySelectorAll("tr"));
    let currentPage = 1;
    const rowsPerPage = 10;
    let employeeSortType = "name-asc";

    // Pagination setup
    function showPage(page) {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        rows.forEach((row, index) => {
            row.style.display = (index >= start && index < end) ? "" : "none";
        });

        employeeCountText.textContent = `Showing ${Math.min(start + 1, rows.length)} - ${Math.min(end, rows.length)} of ${rows.length} employees`;
    }

    function updateButtonStates() {
        prevPageBtn.disabled = currentPage <= 1;
        prevPageBtn.classList.toggle('opacity-50', currentPage <= 1);
        prevPageBtn.classList.toggle('cursor-not-allowed', currentPage <= 1);
    
        nextPageBtn.disabled = currentPage * rowsPerPage >= rows.length;
        nextPageBtn.classList.toggle('opacity-50', currentPage * rowsPerPage >= rows.length);
        nextPageBtn.classList.toggle('cursor-not-allowed', currentPage * rowsPerPage >= rows.length);
    }    

    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
            updateButtonStates();
        }
    });
    
    nextPageBtn.addEventListener("click", () => {
        if (currentPage * rowsPerPage < rows.length) {
            currentPage++;
            showPage(currentPage);
            updateButtonStates();
        }
    }); 

    document.addEventListener('click', (event) => {
        const isClickInsideMenuButton = event.target.closest("[id^='employeeMenuButton-']");
        const isClickInsideMenu = event.target.closest("[id^='employeeMenu-']");
        const isClickInsideSortButton = event.target.closest("#sortMenuToggle");
        const isClickInsideSortDropdown = event.target.closest("#sortDropdown");
    
        if (!isClickInsideMenuButton && !isClickInsideMenu) {
            // Kalau klik di luar employee menu, tutup semua employee menu
            document.querySelectorAll("[id^='employeeMenu-']").forEach(menu => {
                menu.classList.add('hidden');
            });
    
            document.querySelectorAll("[id^='employeeMenuButton-']").forEach(button => {
                button.classList.remove('z-30');
                button.classList.add('z-10');
            });
        }
    
        if (!isClickInsideSortButton && !isClickInsideSortDropdown) {
            // Kalau klik di luar tombol sort atau dropdown sort, tutup sort dropdown
            sortDropdown.classList.add('hidden');
        }
    });
    

    document.addEventListener('click', (event) => {
        const isClickInsideMenuButton = event.target.closest("[id^='employeeMenuButton-']");
        const isClickInsideMenu = event.target.closest("[id^='employeeMenu-']");
        
        if (!isClickInsideMenuButton && !isClickInsideMenu) {
            // Kalau klik BUKAN di tombol menu atau isi menu -> tutup semua menu
            document.querySelectorAll("[id^='employeeMenu-']").forEach(menu => {
                menu.classList.add('hidden');
            });
    
            document.querySelectorAll("[id^='employeeMenuButton-']").forEach(button => {
                button.classList.remove('z-30');
                button.classList.add('z-10');
            });
        }
    });

    // Initial load
    showPage(currentPage);
    updateButtonStates();

    // Sort Dropdown toggle
    sortMenuToggle.addEventListener("click", (event) => {        
        // 🔥 Tambahkan ini: saat buka Sort, tutup semua menu employee
        document.querySelectorAll("[id^='employeeMenu-']").forEach(menu => {
            menu.classList.add('hidden');
        });
    
        document.querySelectorAll("[id^='employeeMenuButton-']").forEach(button => {
            button.classList.remove('z-30');
            button.classList.add('z-10');
        });
    
        sortDropdown.classList.toggle("hidden");
    });
    

    document.querySelectorAll(".sortOption").forEach(btn => {
        btn.addEventListener("click", () => {
            employeeSortType = btn.dataset.sort;
            sortLabel.textContent = getSortLabel(employeeSortType);
            sortTableRows(employeeSortType);
            sortDropdown.classList.add("hidden"); // Hide dropdown after selecting
            currentPage = 1;
            showPage(currentPage);
        });
    });

    // Sort helper
    function sortTableRows(sortType) {
        rows.sort((a, b) => {
            const nameA = a.querySelector("td:nth-child(3)")?.textContent.toLowerCase();
            const nameB = b.querySelector("td:nth-child(3)")?.textContent.toLowerCase();
            const idA = a.querySelector("td:nth-child(2)")?.textContent.replace("EMP", "");
            const idB = b.querySelector("td:nth-child(2)")?.textContent.replace("EMP", "");

            switch (sortType) {
                case "name-asc": return nameA.localeCompare(nameB);
                case "name-desc": return nameB.localeCompare(nameA);
                case "id": return parseInt(idA) - parseInt(idB);
                default: return 0;
            }
        });

        rows.forEach(row => tableBody.appendChild(row)); // reorder table
        rows = Array.from(tableBody.querySelectorAll("tr"));
    }

    function getSortLabel(type) {
        switch (type) {
            case "name-asc": return "Name (A-Z)";
            case "name-desc": return "Name (Z-A)";
            case "id": return "Employee ID";
            default: return "Sort";
        }
    }

    // Search filter
    employeeSearchInput.addEventListener("input", (e) => {
        const search = e.target.value.toLowerCase();
        rows.forEach(row => {
            const name = row.querySelector("td:nth-child(3)")?.textContent.toLowerCase();
            row.style.display = name.includes(search) ? "" : "none";
        });
    });

    // Menu toggle
    window.toggleEmployeeMenu = (index) => {
        // 🔥 Tambahkan ini: saat buka menu employee, tutup Sort dropdown
        sortDropdown.classList.add('hidden');
    
        const menu = document.getElementById(`employeeMenu-${index}`);
        const button = document.getElementById(`employeeMenuButton-${index}`);
        
        document.querySelectorAll("[id^='employeeMenu-']").forEach(m => {
            if (m !== menu) m.classList.add("hidden");
        });
        document.querySelectorAll("[id^='employeeMenuButton-']").forEach(b => {
            b.classList.remove('z-30');
            b.classList.add('z-10');
        });
    
        if (menu.classList.contains('hidden')) {
            menu.classList.remove('hidden');
            button.classList.remove('z-10');
            button.classList.add('z-30');
        } else {
            menu.classList.add('hidden');
            button.classList.remove('z-30');
            button.classList.add('z-10');
        }
    };
    

    window.editEmployee = (employeeId) => {
        if (employeeId) {
            window.location.href = `/allemployees/edit/${employeeId}`;
        }
    };    

    window.deleteEmployee = (index) => {
        const employeeId = rows[index].dataset.id;
    
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000000',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`/allemployees/${employeeId}`, {
                    method: "DELETE"
                })
                .then(response => {
                    if (!response.ok) throw new Error("Failed to delete employee");
                    rows[index].remove();
                    rows = Array.from(tableBody.querySelectorAll("tr"));
                    showPage(currentPage);
                    Swal.fire(
                        'Deleted!',
                        'Employee has been deleted.',
                        'success'
                    );
                })
                .catch(err => {
                    console.error(err);
                    Swal.fire(
                        'Failed!',
                        'Failed to delete employee.',
                        'error'
                    );
                });
            }
        });
    };    

    window.changeEmployeeStatus = (index, employeeId, status) => {
        const statusMapping = {
            "Active": "Aktif",
            "On Leave": "Cuti",
            "Inactive": "Inaktif"
        };
    
        fetch(`/api/employees/${employeeId}/status`, {  // 🔥 Ganti ke API beneran
            method: "PUT",
            headers: { 
                "Content-Type": "application/json"
                // Tidak perlu Authorization manual karena pakai cookie HttpOnly
            },
            body: JSON.stringify({ status_Karyawan: statusMapping[status] })
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to update status");
            return response.json();
        })
        .then(() => {
            const row = document.getElementById(`employeeRow-${index}`);
            const statusCell = row.querySelector("td:nth-child(7) span");
    
            if (statusCell) {
                statusCell.textContent = status;
                if (status === "Active") {
                    statusCell.className = "px-2 py-1 text-xs rounded-full bg-black text-white";
                } else if (status === "On Leave") {
                    statusCell.className = "px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800";
                } else if (status === "Inactive") {
                    statusCell.className = "px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800";
                }
            }
            toggleEmployeeMenu(index);
    
            // 🔥 Tambahkan SweetAlert success
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Employee status updated successfully!",
                timer: 2000,
                showConfirmButton: false
            });
        })
        .catch(err => {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: "Failed to update employee status"
            });
        });
    };    

    sortLabel.textContent = getSortLabel(employeeSortType);
});
