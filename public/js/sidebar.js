const leaveToggleBtn = document.getElementById('leave-toggle');
const leaveSubmenu = document.getElementById('leave-submenu');

leaveToggleBtn.addEventListener('click', () => {
    leaveSubmenu.classList.toggle('hidden');
});

const employeeToggleBtn = document.getElementById('employee-toggle');
const employeeSubmenu = document.getElementById('employee-submenu');

employeeToggleBtn.addEventListener('click', () => {
    employeeSubmenu.classList.toggle('hidden');
});

const userProfile = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "(123) 456-7890",
    dateOfBirth: "1990-01-01",
    department: "Engineering",
    position: "Senior Developer",
    address: {
        street: "123 Main St",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        country: "USA",
    },
    emergencyContact: "Jane Doe (Wife) - (123) 456-7891",
};
