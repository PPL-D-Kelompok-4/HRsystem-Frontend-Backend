const leaveToggleBtn = document.getElementById("leave-toggle");
const leaveSubmenu = document.getElementById("leave-submenu");

leaveToggleBtn.addEventListener("click", () => {
	leaveSubmenu.classList.toggle("hidden");
});

const employeeToggleBtn = document.getElementById("employee-toggle");
const employeeSubmenu = document.getElementById("employee-submenu");

employeeToggleBtn.addEventListener("click", () => {
	employeeSubmenu.classList.toggle("hidden");
});

document.addEventListener("DOMContentLoaded", async () => {
	const userNameElement = document.getElementById("user-name");

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

		// Update nama di sidebar
		userNameElement.textContent = user.nama || "Unknown User";
	} catch (error) {
		console.error("Error fetching user:", error.message);
		window.location.href = "/login"; // Kalau gagal, redirect login
	}
});
