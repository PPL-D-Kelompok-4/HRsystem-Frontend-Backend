
const populateProfile = () => {
    // Basic Info
    document.getElementById("profile-name").textContent = `${userProfile.firstName} ${userProfile.lastName}`;
    document.getElementById("profile-department").textContent = userProfile.department;
    document.getElementById("profile-firstname").textContent = userProfile.firstName;
    document.getElementById("profile-lastname").textContent = userProfile.lastName;
    document.getElementById("profile-email").textContent = userProfile.email;
    document.getElementById("profile-phone").textContent = userProfile.phone;
    document.getElementById("profile-dob").textContent = userProfile.dateOfBirth;

    // Address Info
    document.getElementById("profile-street").textContent = userProfile.address.street;
    document.getElementById("profile-city").textContent = userProfile.address.city;
    document.getElementById("profile-state").textContent = userProfile.address.state;
    document.getElementById("profile-zip").textContent = userProfile.address.zipCode;
    document.getElementById("profile-country").textContent = userProfile.address.country;
    document.getElementById("profile-emergency").textContent = userProfile.emergencyContact;
};

const toggleEditMode = (editing) => {
    document.getElementById("profile-view-mode").classList.toggle("hidden", editing);
    document.getElementById("profile-edit-mode").classList.toggle("hidden", !editing);
    document.getElementById("address-view-mode").classList.toggle("hidden", editing);
    document.getElementById("address-edit-mode").classList.toggle("hidden", !editing);
    document.getElementById("profile-edit-toggle").classList.toggle("hidden", editing);
};

const fillEditForm = () => {
    document.getElementById("editFirstName").value = userProfile.firstName;
    document.getElementById("editLastName").value = userProfile.lastName;
    document.getElementById("editEmail").value = userProfile.email;
    document.getElementById("editPhone").value = userProfile.phone;
    document.getElementById("editDateOfBirth").value = userProfile.dateOfBirth;
    document.getElementById("editStreet").value = userProfile.address.street;
    document.getElementById("editCity").value = userProfile.address.city;
    document.getElementById("editState").value = userProfile.address.state;
    document.getElementById("editZipCode").value = userProfile.address.zipCode;
    document.getElementById("editCountry").value = userProfile.address.country;
    document.getElementById("editEmergencyContact").value = userProfile.emergencyContact;
};

const saveProfile = () => {
    userProfile.firstName = document.getElementById("editFirstName").value;
    userProfile.lastName = document.getElementById("editLastName").value;
    userProfile.email = document.getElementById("editEmail").value;
    userProfile.phone = document.getElementById("editPhone").value;
    userProfile.dateOfBirth = document.getElementById("editDateOfBirth").value;
    userProfile.address.street = document.getElementById("editStreet").value;
    userProfile.address.city = document.getElementById("editCity").value;
    userProfile.address.state = document.getElementById("editState").value;
    userProfile.address.zipCode = document.getElementById("editZipCode").value;
    userProfile.address.country = document.getElementById("editCountry").value;
    userProfile.emergencyContact = document.getElementById("editEmergencyContact").value;

    populateProfile();
    toggleEditMode(false);
};

function setupTogglePassword(passwordInputId) {
    const passwordInput = document.getElementById(passwordInputId);
    const eyeIconSpan = passwordInput.previousElementSibling.querySelector('svg');

    passwordInput.previousElementSibling.addEventListener('click', function () {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIconSpan.innerHTML = `
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.166-3.692m3.516-2.835A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.957 9.957 0 01-4.478 5.568M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
            `;
        } else {
            passwordInput.type = 'password';
            eyeIconSpan.innerHTML = `
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            `;
        }
    });
}

const editPassword1 = document.getElementById('editPassword1');
    const editPassword2 = document.getElementById('editPassword2');

    editPassword2.addEventListener('input', function () {
        editPassword1.value = editPassword2.value;
    });

// Jalankan fungsi untuk dua password
setupTogglePassword('editPassword1');
setupTogglePassword('editPassword2');


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

// Init on load
document.addEventListener("DOMContentLoaded", () => {
    populateProfile();
});


