const leaveToggleBtn = document.getElementById("leave-toggle");
const leaveSubmenu = document.getElementById("leave-submenu");

if (leaveToggleBtn && leaveSubmenu) {
    leaveToggleBtn.addEventListener("click", () => {
        leaveSubmenu.classList.toggle("hidden");
    });
}

const salaryToggleBtn = document.getElementById("salary-toggle");
const salarySubmenu = document.getElementById("salary-submenu");

if (salaryToggleBtn && salarySubmenu) {
    salaryToggleBtn.addEventListener("click", () => {
        salarySubmenu.classList.toggle("hidden");
    });
}

const employeeToggleBtn = document.getElementById("employee-toggle");
const employeeSubmenu = document.getElementById("employee-submenu");

if (employeeToggleBtn && employeeSubmenu) {
    employeeToggleBtn.addEventListener("click", () => {
        employeeSubmenu.classList.toggle("hidden");
    });
}

const sidebarToggleBtn = document.getElementById("sidebar-toggle");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");

function toggleSidebar() {
    if (sidebar && sidebarOverlay) {
        sidebar.classList.toggle("-translate-x-full");
        sidebarOverlay.classList.toggle("hidden");
        document.body.classList.toggle("overflow-hidden");
    }
}

if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener("click", toggleSidebar);
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", toggleSidebar);
}

document.addEventListener("keydown", (e) => {
    if (sidebar && !sidebar.classList.contains("-translate-x-full") && e.key === "Escape") {
        toggleSidebar();
    }
});

window.addEventListener("resize", () => {
    if (
        sidebar &&
        sidebarOverlay &&
        window.innerWidth >= 1024 &&
        !sidebar.classList.contains("-translate-x-full") &&
        !sidebarOverlay.classList.contains("hidden")
    ) {
        toggleSidebar();
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const userNameElement = document.getElementById("user-name");
    const addEmployeeMenuItem = document.getElementById("add-employee-menu");
    const reportsMenuItem = document.getElementById("reports-menu");
    const manageSalaryMenuItem = document.getElementById("manage-salary-menu");

    try {
        const response = await fetch("http://localhost:3000/api/auth/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const errorText = await response.text();
            try {
                const errorJson = JSON.parse(errorText);
                throw new Error(errorJson.message || "Failed to get user info");
            } catch (e) {
                throw new Error(errorText || "Failed to get user info and could not parse error response");
            }
        }

        const user = await response.json();
        console.log("✅ User fetched:", user);

        if (userNameElement) {
            userNameElement.textContent = user.nama || "Unknown User";
        }

        const isHRManager =
            Number(user.positionID) === 1 && Number(user.departmentID) === 1;
        console.log("✅ Is user HR Manager:", isHRManager);

        if (!isHRManager && addEmployeeMenuItem) {
            addEmployeeMenuItem.classList.add("hidden");
        }

        if (reportsMenuItem) {
            if (Number(user.departmentID) !== 1) {
                reportsMenuItem.classList.add("hidden");
            } else {
                reportsMenuItem.classList.remove("hidden");
            }
        }
        
        if (manageSalaryMenuItem) {
            if (Number(user.departmentID) !== 2) {
                manageSalaryMenuItem.classList.add("hidden");
            } else {
                manageSalaryMenuItem.classList.remove("hidden");
            }
        }

    } catch (error) {
        console.error("❌ Error fetching user data or controlling menu visibility:", error);
        if (error.message.includes("NetworkError") || error.message.includes("fetch")) {
            console.error("⚠️ API might be inaccessible (server down or CORS issue).");
        } else {
            console.error("⚠️ Problem with the response or parsing JSON.");
        }

        if (window.location.pathname !== "/login" && window.location.pathname !== "/login.html") {
            window.location.href = "/login";
        }
    }
});