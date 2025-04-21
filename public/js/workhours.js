// workschedule.js

document.addEventListener("DOMContentLoaded", () => {
    const state = {
        workSchedules: [
            { description: "Shift Pagi", startTime: "08:00", endTime: "16:00" },
            { description: "Shift Siang", startTime: "12:00", endTime: "20:00" },
        ],
        editingIndex: null,
    };

    const tableBody = document.querySelector("[data-work-schedule]");
    const modal = document.querySelector("[data-modal-edit-schedule]");
    const form = document.querySelector("[data-schedule-form]");
    const cancelBtn = document.querySelector("[data-cancel-edit]");

    function renderSchedules() {
        tableBody.innerHTML = state.workSchedules.map((item, index) => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${index + 1}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.description}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.startTime}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.endTime}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button class="inline-flex items-center px-3 py-1 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-700" data-edit-index="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit
                    </button>
                </td>
            </tr>
        `).join("");
    }

    function openModal(index) {
        const schedule = state.workSchedules[index];
        form.description.value = schedule.description;
        form.startTime.value = schedule.startTime;
        form.endTime.value = schedule.endTime;
        state.editingIndex = index;
        modal.classList.remove("hidden");
    }

    function closeModal() {
        modal.classList.add("hidden");
        form.reset();
        state.editingIndex = null;
    }

    tableBody.addEventListener("click", (e) => {
        const editBtn = e.target.closest("[data-edit-index]");
        if (editBtn) {
            const index = parseInt(editBtn.getAttribute("data-edit-index"), 10);
            openModal(index);
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const { description, startTime, endTime } = form;
        if (state.editingIndex !== null) {
            state.workSchedules[state.editingIndex] = {
                description: description.value,
                startTime: startTime.value,
                endTime: endTime.value
            };
        }
        renderSchedules();
        closeModal();
    });

    cancelBtn.addEventListener("click", closeModal);

    renderSchedules();
});
