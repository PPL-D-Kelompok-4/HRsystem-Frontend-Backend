
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