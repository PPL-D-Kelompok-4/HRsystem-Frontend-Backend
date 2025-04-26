document.addEventListener("DOMContentLoaded", () => {
    const allEmployeesView = document.getElementById("allEmployeesView");
    const addEmployeeBtn = document.getElementById("addEmployeeBtn");
    const employeeSearchInput = document.getElementById("employeeSearchInput");
    const sortMenuToggle = document.getElementById("sortMenuToggle");
    const sortDropdown = document.getElementById("sortDropdown");
    const sortLabel = document.getElementById("sortLabel");
    const employeeTableBody = document.getElementById("employeeTableBody");
    const employeeCountText = document.getElementById("employeeCountText");
    const prevPageBtn = document.getElementById("prevPageBtn");
    const nextPageBtn = document.getElementById("nextPageBtn");

    let employees = [
        { id: "EMP001", firstName: "John", lastName: "Doe", email: "john@example.com", department: "HR", position: "Manager", status: "Active", showMenu: false },
        { id: "EMP002", firstName: "Jane", lastName: "Smith", email: "jane@example.com", department: "Finance", position: "Analyst", status: "On Leave", showMenu: false },
        // Tambah data dummy lainnya di sini kalau mau
    ];

    let employeeSearch = "";
    let employeeSortType = "name-asc";
    let employeePage = 1;
    const employeesPerPage = 10;

    // Helper
    const getSortLabelEmployee = () => {
        switch (employeeSortType) {
            case "name-asc": return "Name (A-Z)";
            case "name-desc": return "Name (Z-A)";
            case "id": return "Employee ID";
            default: return "Sort";
        }
    };

    const getFilteredEmployees = () => {
        return employees.filter(emp =>
            (`${emp.firstName} ${emp.lastName}`.toLowerCase().includes(employeeSearch.toLowerCase()))
        );
    };

    const getSortedEmployees = () => {
        const filtered = getFilteredEmployees();
        switch (employeeSortType) {
            case "name-asc":
                return filtered.sort((a, b) => (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName));
            case "name-desc":
                return filtered.sort((a, b) => (b.firstName + b.lastName).localeCompare(a.firstName + a.lastName));
            case "id":
                return filtered.sort((a, b) => a.id.localeCompare(b.id));
            default:
                return filtered;
        }
    };

    const getPaginatedEmployees = () => {
        const sorted = getSortedEmployees();
        const start = (employeePage - 1) * employeesPerPage;
        return sorted.slice(start, start + employeesPerPage);
    };

    const renderEmployees = () => {
        const employeesToRender = getPaginatedEmployees();
        const sorted = getSortedEmployees();
        const filtered = getFilteredEmployees();

        employeeTableBody.innerHTML = "";

        if (sorted.length === 0) {
            employeeTableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="px-3 py-4 text-center text-sm text-gray-500">
                        No employees found. Add your first employee.
                    </td>
                </tr>`;
        } else {
            employeesToRender.forEach((employee, index) => {
                const statusClass =
                    employee.status === "On Leave" ? "bg-yellow-100 text-yellow-800" :
                    employee.status === "Inactive" ? "bg-gray-100 text-gray-800" :
                    "bg-black text-white";

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td class="px-3 py-4"><input type="checkbox" class="rounded border-gray-300" /></td>
                    <td class="px-3 py-4 text-sm text-gray-500">${employee.id}</td>
                    <td class="px-3 py-4 text-sm font-medium text-gray-900">${employee.firstName} ${employee.lastName}</td>
                    <td class="px-3 py-4 text-sm text-gray-500">${employee.email}</td>
                    <td class="px-3 py-4 text-sm text-gray-500">${employee.department}</td>
                    <td class="px-3 py-4 text-sm text-gray-500">${employee.position}</td>
                    <td class="px-3 py-4">
                        <span class="px-2 py-1 text-xs rounded-full ${statusClass}">
                            ${employee.status}
                        </span>
                    </td>
                    <td class="px-3 py-4 text-sm text-gray-500">
                        <div class="relative flex justify-center">
                            <button class="text-gray-400 hover:text-gray-600" onclick="toggleEmployeeMenu(${index})">
                                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>
                            </button>
                            <div id="employeeMenu-${index}" class="absolute mt-8 w-48 bg-white rounded-md shadow-lg border">
                                <div class="py-1">
                                    <button onclick="editEmployee(${index})" class="block w-full text-left px-4 py-2 hover:bg-gray-100">Edit</button>
                                    <button onclick="changeEmployeeStatus(${index}, 'Active')" class="block w-full text-left px-4 py-2 hover:bg-gray-100">Set as Active</button>
                                    <button onclick="changeEmployeeStatus(${index}, 'On Leave')" class="block w-full text-left px-4 py-2 hover:bg-gray-100">Set as On Leave</button>
                                    <button onclick="changeEmployeeStatus(${index}, 'Inactive')" class="block w-full text-left px-4 py-2 hover:bg-gray-100">Set as Inactive</button>
                                    <button onclick="deleteEmployee(${index})" class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Delete</button>
                                </div>
                            </div>
                        </div>
                    </td>`;
                employeeTableBody.appendChild(row);
            });
        }

        employeeCountText.textContent = filtered.length === employees.length
            ? `${sorted.length} employee(s) in the system.`
            : `${sorted.length} of ${employees.length} employee(s) shown.`;

        // Disable prev/next buttons
        prevPageBtn.disabled = employeePage === 1;
        nextPageBtn.disabled = employeePage >= Math.ceil(sorted.length / employeesPerPage);
    };

    // Global functions
    window.toggleEmployeeMenu = (index) => {
        const menu = document.getElementById(`employeeMenu-${index}`);
        menu.classList.toggle("hidden");
        document.addEventListener("click", (e) => {
            if (!menu.contains(e.target)) {
                menu.classList.add("hidden");
            }
        }, { once: true });
    };

    window.editEmployee = (index) => {
        alert("Edit employee: " + employees[index].firstName);
    };

    window.changeEmployeeStatus = (index, status) => {
        employees[index].status = status;
        renderEmployees();
    };

    window.deleteEmployee = (index) => {
        employees.splice(index, 1);
        renderEmployees();
    };

    // Event Listeners
    addEmployeeBtn.addEventListener("click", () => {
        alert("Redirect to Add Employee form");
    });

    employeeSearchInput.addEventListener("input", (e) => {
        employeeSearch = e.target.value;
        employeePage = 1;
        renderEmployees();
    });

    sortMenuToggle.addEventListener("click", () => {
        sortDropdown.classList.toggle("hidden");
    });

    document.querySelectorAll(".sortOption").forEach(btn => {
        btn.addEventListener("click", () => {
            employeeSortType = btn.dataset.sort;
            sortLabel.textContent = getSortLabelEmployee();
            sortDropdown.classList.add("hidden");
            renderEmployees();
        });
    });

    prevPageBtn.addEventListener("click", () => {
        if (employeePage > 1) {
            employeePage--;
            renderEmployees();
        }
    });

    nextPageBtn.addEventListener("click", () => {
        const totalPages = Math.ceil(getSortedEmployees().length / employeesPerPage);
        if (employeePage < totalPages) {
            employeePage++;
            renderEmployees();
        }
    });

    // Initial render
    allEmployeesView.classList.remove("hidden");
    sortLabel.textContent = getSortLabelEmployee();
    renderEmployees();
});
