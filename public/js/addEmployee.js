// Data employees sementara
let employees = [];
let editingEmployeeIndex = null; // null = mode tambah baru

const addEmployeeForm = document.getElementById("addEmployeeForm");
const submitEmployeeBtn = document.getElementById("submitEmployeeBtn");
const addEmployeeTitle = document.getElementById("add-employee-title");

// Ambil semua field input (hanya yang ADA di form)
const employeeFields = {
    firstName: document.getElementById("firstName"),
    lastName: document.getElementById("lastName"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    department: document.getElementById("department"),
    position: document.getElementById("position"),
    startDate: document.getElementById("startDate"),
};

// Reset semua field input
function resetForm() {
    addEmployeeForm.reset();
    editingEmployeeIndex = null;
    if (addEmployeeTitle) {
        addEmployeeTitle.textContent = "Add New Employee";
    }
    if (submitEmployeeBtn) {
        submitEmployeeBtn.textContent = "Add Employee";
    }
}

// Simpan employee baru atau update
function submitNewEmployee(event) {
    event.preventDefault();

    const newEmployee = {
        firstName: employeeFields.firstName.value,
        lastName: employeeFields.lastName.value,
        email: employeeFields.email.value,
        phone: employeeFields.phone.value,
        department: employeeFields.department.value,
        position: employeeFields.position.value,
        startDate: employeeFields.startDate.value,
    };

    // Kirim data ke server
    fetch('/addemployee', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
    })
    .then(response => {
        if (response.ok) {
            alert('Employee added successfully!');
            resetForm();
        } else {
            alert('Failed to add employee.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error submitting employee.');
    });
}


// Attach event listener
addEmployeeForm.addEventListener("submit", submitNewEmployee);

// Inisialisasi saat page load
resetForm();
