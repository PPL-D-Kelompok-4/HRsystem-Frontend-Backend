// login.js

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const errorMessage = document.getElementById('errorMessage');

    let showPassword = false;

    // Toggle show/hide password
    togglePasswordBtn.addEventListener('click', function () {
        showPassword = !showPassword;
        passwordInput.type = showPassword ? 'text' : 'password';
        togglePasswordBtn.textContent = showPassword ? 'Hide' : 'Show';
    });

    // Handle form submit
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            displayError('Email dan password wajib diisi');
        } else {
            clearError();
            // Di sini kamu bisa kirimkan data ke server (misal pakai fetch atau axios)
            console.log({
                email,
                password
            });

            // Contoh simulasi login sukses (nanti ganti pakai request ke server)
            // window.location.href = '/dashboard'; // <-- redirect kalau login sukses
        }
    });

    function displayError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    function clearError() {
        errorMessage.textContent = '';
        errorMessage.classList.add('hidden');
    }
});