// Toggle Leave Submenu
const leaveToggleBtn = document.getElementById("leave-toggle");
const leaveSubmenu = document.getElementById("leave-submenu");

leaveToggleBtn.addEventListener("click", () => {
  leaveSubmenu.classList.toggle("hidden");
});

// Toggle Employee Submenu
const employeeToggleBtn = document.getElementById("employee-toggle");
const employeeSubmenu = document.getElementById("employee-submenu");

employeeToggleBtn.addEventListener("click", () => {
  employeeSubmenu.classList.toggle("hidden");
});

// Fetch user info and kontrol visibilitas menu berdasarkan role/department
document.addEventListener("DOMContentLoaded", async () => {
  const userNameElement = document.getElementById("user-name");
  const addEmployeeMenuItem = document.getElementById("add-employee-menu");
  const reportsMenuItem = document.getElementById("reports-menu");

  try {
    const response = await fetch("http://localhost:3000/api/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Gagal mendapatkan user info");
    }

    const user = await response.json();

    console.log("✅ User fetched:", user);

    if (userNameElement) {
      userNameElement.textContent = user.nama || "Unknown User";
    }

    // Cek apakah user adalah HR Manager (positionID = 1 && departmentID = 1)
    const isHRManager = Number(user.positionID) === 1 && Number(user.departmentID) === 1;
    console.log("✅ Is user HR Manager:", isHRManager);

    // Sembunyikan menu "Add Employee" jika bukan HR Manager
    if (!isHRManager && addEmployeeMenuItem) {
      addEmployeeMenuItem.classList.add("hidden");
    }

    // Tampilkan menu Reports hanya jika departmentID = 4
    if (Number(user.departmentID) !== 1 && reportsMenuItem) {
      reportsMenuItem.classList.add("hidden");
    }

  } catch (error) {
    console.error("❌ Error fetching user data:", error);
    if (error instanceof TypeError) {
      console.error("⚠️ Sepertinya API tidak bisa diakses (server mati?)");
    } else {
      console.error("⚠️ Ada masalah di response atau parsing JSON");
    }

    // Redirect ke login jika error
    window.location.href = "/login";
  }
});
