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

// Tambahkan event listener untuk submit form
addEmployeeForm.addEventListener("submit", async (event) => {
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

    const isEditMode = window.location.pathname.includes("/edit/");

    try {
        const response = await fetch(addEmployeeForm.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEmployee),
        });

        if (!response.ok) throw new Error('Server Error');

        const result = await response.json();

        if (isEditMode) {
            await Swal.fire({
                icon: 'success',
                title: 'Employee Updated!',
                text: 'The employee data has been successfully updated.',
                confirmButtonColor: '#000',
            });
            window.location.href = "/allemployees";
        } else {
            await Swal.fire({
                icon: 'success',
                title: 'Employee Added!',
                html: `
                    <div style="text-align: left;">
                        <b>Email:</b> ${result.email}<br>
                        <b>Password:</b> ${result.password}
                    </div>
                `,
                confirmButtonColor: '#000',
            });
            window.location.href = "/allemployees";
        }
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: isEditMode ? 'Failed to update employee.' : 'Failed to add employee.',
            confirmButtonColor: '#d33',
        });
    }
});
