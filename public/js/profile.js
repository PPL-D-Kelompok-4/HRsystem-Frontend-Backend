// Populate Profile Information
const populateProfile = () => {
	document.getElementById(
		"profile-name"
	).textContent = `${userProfile.firstName} ${userProfile.lastName}`;
	document.getElementById("profile-department").textContent =
		userProfile.department;
	document.getElementById("profile-firstname").textContent =
		userProfile.firstName;
	document.getElementById("profile-lastname").textContent =
		userProfile.lastName;
	document.getElementById("profile-email").textContent = userProfile.email;
	document.getElementById("profile-password").textContent =
		userProfile.password;
	document.getElementById("profile-phone").textContent = userProfile.phone;
	const passwordDiv = document.getElementById("profile-password");
	passwordDiv.dataset.password = userProfile.password; // Simpan aslinya
	passwordDiv.textContent = "*".repeat(userProfile.password.length);
};

// Toggle Edit Mode
const toggleEditMode = (editing) => {
	document
		.getElementById("profile-view-mode")
		.classList.toggle("hidden", editing);
	document
		.getElementById("profile-edit-mode")
		.classList.toggle("hidden", !editing);
	document
		.getElementById("profile-edit-toggle")
		.classList.toggle("hidden", editing);
};

// Fill Edit Form with current profile
const fillEditForm = () => {
	document.getElementById("editFirstName").value = userProfile.firstName;
	document.getElementById("editLastName").value = userProfile.lastName;
	document.getElementById("editEmail").value = userProfile.email;
	document.getElementById("editPassword").value = userProfile.password;
	document.getElementById("editPhone").value = userProfile.phone;
};

// Save Profile after editing
const saveProfile = async () => {
	const updatedProfile = {
		nama: `${document.getElementById("editFirstName").value} ${
			document.getElementById("editLastName").value
		}`,
		email: document.getElementById("editEmail").value,
		password: document.getElementById("editPassword").value,
		no_Telp: document.getElementById("editPhone").value,
	};

	try {
		const response = await fetch(`/api/employees/${userProfile.employeeID}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(updatedProfile),
		});

		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.message || "Gagal update profile");
		}

		const updatedUser = await response.json();

		// Update local userProfile setelah berhasil update
		userProfile.firstName = updatedProfile.nama.split(" ")[0];
		userProfile.lastName = updatedProfile.nama.split(" ").slice(1).join(" ");
		userProfile.email = updatedProfile.email;
		userProfile.phone = updatedProfile.no_Telp;
		userProfile.password = updatedProfile.password;

		populateProfile();
		toggleEditMode(false);

		Swal.fire({
			icon: "success",
			title: "Profile Updated!",
			text: "Your profile has been successfully updated.",
			confirmButtonColor: "#3085d6",
		});
	} catch (error) {
		console.error("Error updating profile:", error.message);

		Swal.fire({
			icon: "error",
			title: "Update Failed",
			text: error.message || "Failed to update profile.",
			confirmButtonColor: "#d33",
		});
	}
};

// Event Listeners
document.getElementById("editProfileBtn").addEventListener("click", () => {
	fillEditForm();
	toggleEditMode(true);
});

document.getElementById("cancelEditBtn").addEventListener("click", () => {
	toggleEditMode(false);
});

document.getElementById("saveProfileBtn").addEventListener("click", () => {
	saveProfile();
});

// Init on page load
document.addEventListener("DOMContentLoaded", async () => {
	try {
		const response = await fetch("/api/auth/me", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.message || "Gagal fetch profile");
		}

		const user = await response.json();

		window.userProfile = {
			employeeID: user.employeeID,
			firstName: user.nama?.split(" ")[0] || "First",
			lastName: user.nama?.split(" ").slice(1).join(" ") || "Last",
			email: user.email || "email@example.com",
			phone: user.no_Telp || "08123456789",
			password: user.password || "password123",
			department: user.nama_Departemen || "IT Department",
		};

		populateProfile();
	} catch (error) {
		console.error("Error loading profile:", error.message);
		window.location.href = "/login";
	}
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
	const confirm = await Swal.fire({
		title: "Are you sure?",
		text: "You will be logged out!",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#d33",
		cancelButtonColor: "#3085d6",
		confirmButtonText: "Yes, logout!",
	});

	if (confirm.isConfirmed) {
		try {
			const response = await fetch("/api/auth/logout", {
				method: "POST", // atau GET tergantung API kamu
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error("Failed to logout");
			}

			Swal.fire({
				icon: "success",
				title: "Logged Out!",
				text: "You have been logged out successfully.",
				timer: 2000,
				showConfirmButton: false,
			});

			setTimeout(() => {
				window.location.href = "/login"; // Redirect ke login page
			}, 2000);
		} catch (error) {
			console.error("Logout error:", error.message);
			Swal.fire({
				icon: "error",
				title: "Logout Failed",
				text: error.message,
			});
		}
	}
});

document
	.getElementById("togglePassword")
	.addEventListener("click", function () {
		const passwordInput = document.getElementById("editPassword");
		const eyePath = document.getElementById("eyePath");

		const hidePasswordPath =
			"M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.41.294-2.75.825-3.975m2.122-2.122A9.966 9.966 0 0112 3c5.523 0 10 4.477 10 10 0 1.535-.344 2.99-.957 4.293M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18";
		const showPasswordPath =
			"M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z";

		if (passwordInput.type === "password") {
			passwordInput.type = "text";
			eyePath.setAttribute("d", showPasswordPath);
		} else {
			passwordInput.type = "password";
			eyePath.setAttribute("d", hidePasswordPath);
		}
	});

document
	.getElementById("togglePasswordView")
	.addEventListener("click", function () {
		const passwordDiv = document.getElementById("profile-password");
		const eyePath = document.getElementById("eyePathView");

		const hidePasswordPath =
			"M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.41.294-2.75.825-3.975m2.122-2.122A9.966 9.966 0 0112 3c5.523 0 10 4.477 10 10 0 1.535-.344 2.99-.957 4.293M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18";
		const showPasswordPath =
			"M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z";

		const currentText = passwordDiv.textContent.trim();

		// Jika saat ini teks bukan bintang2, berarti user sudah edit password
		if (!currentText.includes("*")) {
			passwordDiv.dataset.password = currentText;
		}

		// Cek mode: sedang sembunyi atau kelihatan
		if (currentText.includes("*")) {
			// Tampilkan password
			passwordDiv.textContent = passwordDiv.dataset.password || "";
			eyePath.setAttribute("d", showPasswordPath);
		} else {
			// Sembunyikan password
			const length = passwordDiv.dataset.password
				? passwordDiv.dataset.password.length
				: 8;
			passwordDiv.textContent = "*".repeat(length);
			eyePath.setAttribute("d", hidePasswordPath);
		}
	});
