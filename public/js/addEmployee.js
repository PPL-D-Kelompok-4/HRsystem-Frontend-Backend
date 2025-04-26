// Data employees sementara
let employees = [];
let editingEmployeeIndex = null; // null = mode tambah baru

const addEmployeeForm = document.getElementById("addEmployeeForm");
const submitEmployeeBtn = document.getElementById("submitEmployeeBtn");
const addEmployeeTitle = document.getElementById("add-employee-title");

// Ambil semua field input
const employeeFields = {
    firstName: document.getElementById("firstName"),
    lastName: document.getElementById("lastName"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    department: document.getElementById("department"),
    position: document.getElementById("position"),
    startDate: document.getElementById("startDate"),
    address: {
        street: document.getElementById("street"),
        city: document.getElementById("city"),
        state: document.getElementById("state"),
        zipCode: document.getElementById("zipCode"),
        country: document.getElementById("country")
    },
    emergencyContact: document.getElementById("emergencyContact")
};

// Reset semua field input
function resetForm() {
    addEmployeeForm.reset();
    editingEmployeeIndex = null;
    addEmployeeTitle.textContent = "Add New Employee";
    submitEmployeeBtn.textContent = "Add Employee";
}

// Isi form dengan data employee yang diedit
function fillEditForm(employee) {
    employeeFields.firstName.value = employee.firstName;
    employeeFields.lastName.value = employee.lastName;
    employeeFields.email.value = employee.email;
    employeeFields.phone.value = employee.phone;
    employeeFields.department.value = employee.department;
    employeeFields.position.value = employee.position;
    employeeFields.startDate.value = employee.startDate;
    employeeFields.address.street.value = employee.address.street;
    employeeFields.address.city.value = employee.address.city;
    employeeFields.address.state.value = employee.address.state;
    employeeFields.address.zipCode.value = employee.address.zipCode;
    employeeFields.address.country.value = employee.address.country;
    employeeFields.emergencyContact.value = employee.emergencyContact;
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
        address: {
            street: employeeFields.address.street.value,
            city: employeeFields.address.city.value,
            state: employeeFields.address.state.value,
            zipCode: employeeFields.address.zipCode.value,
            country: employeeFields.address.country.value
        },
        emergencyContact: employeeFields.emergencyContact.value
    };

    if (editingEmployeeIndex !== null) {
        employees[editingEmployeeIndex] = newEmployee;
        alert("Employee updated successfully.");
    } else {
        employees.push(newEmployee);
        alert("Employee added successfully.");
    }

    resetForm();
    console.log(employees); // debug output
}

// Untuk masuk ke mode edit (dipanggil dari luar, misal dari daftar employees)
function editEmployee(index) {
    const employee = employees[index];
    if (!employee) return;

    editingEmployeeIndex = index;
    addEmployeeTitle.textContent = "Edit Employee";
    submitEmployeeBtn.textContent = "Update Employee";

    fillEditForm(employee);
    // Tampilkan view add employee jika perlu
    document.getElementById("add-employee-view").classList.remove("hidden");
}

// Attach event listener
addEmployeeForm.addEventListener("submit", submitNewEmployee);

// Inisialisasi jika perlu
resetForm();
