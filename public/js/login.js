// login.js

document.addEventListener("DOMContentLoaded", function () {
	const loginForm = document.getElementById("loginForm");
	const emailInput = document.getElementById("email");
	const passwordInput = document.getElementById("password");
	const togglePasswordBtn = document.getElementById("togglePassword");
	const errorMessage = document.getElementById("errorMessage");

	let showPassword = false;

	// Toggle show/hide password
	togglePasswordBtn.addEventListener("click", function () {
		showPassword = !showPassword;
		passwordInput.type = showPassword ? "text" : "password";
		togglePasswordBtn.textContent = showPassword ? "Hide" : "Show";
	});

	// Handle form submit
	loginForm.addEventListener("submit", async function (e) {
		e.preventDefault();
		const email = emailInput.value.trim();
		const password = passwordInput.value.trim();

		if (!email || !password) {
			displayError("Email dan password wajib diisi");
			return;
		}

		clearError();

		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Login gagal");
			}
			// Redirect ke dashboard atau halaman lain
			window.location.href = "/"; // ganti sesuai rute dashboard kamu
		} catch (error) {
			displayError(error.message);
		}
	});

	function displayError(message) {
		errorMessage.textContent = message;
		errorMessage.classList.remove("hidden");
	}

	function clearError() {
		errorMessage.textContent = "";
		errorMessage.classList.add("hidden");
	}
});
