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

// Fetch user info and hide "Add Employee" if not HR
document.addEventListener("DOMContentLoaded", async () => {
  const userNameElement = document.getElementById("user-name");
  const addEmployeeMenuItem = document.getElementById("add-employee-menu"); // target menu Add Employee

  try {
    const response = await fetch("http://localhost:3000/api/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // penting untuk cookie/session
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

    // Cek apakah user adalah HR
    const isHR = Number(user.positionID) === 1 && Number(user.departmentID) === 1;
    console.log("✅ Is user HR:", isHR);

    // Kalau BUKAN HR, sembunyikan menu Add Employee
    if (!isHR && addEmployeeMenuItem) {
      addEmployeeMenuItem.classList.add("hidden");
    }
  } catch (error) {
    console.error("❌ Error fetching user data:", error);
    if (error instanceof TypeError) {
      console.error("⚠️ Sepertinya API tidak bisa diakses (server mati?)");
    } else {
      console.error("⚠️ Ada masalah di response atau parsing JSON");
    }
    // Kalau error, langsung redirect ke login
    window.location.href = "/login";
  }
});
