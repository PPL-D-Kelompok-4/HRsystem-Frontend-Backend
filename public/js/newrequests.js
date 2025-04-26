// newrequest.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("new-request-form");
    const cancelButton = document.getElementById("cancel-new-request");
    const newRequestView = document.getElementById("new-request-view");
    const allRequestsView = document.getElementById("all-requests-view");

    function switchToAllRequests() {
        newRequestView.classList.add("hidden");
        allRequestsView?.classList.remove("hidden");
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const newRequest = {
            id: "LEA" + Math.floor(1000 + Math.random() * 9000),
            employee: "You", // can be dynamically fetched in a real system
            type: formData.get("type"),
            startDate: formData.get("startDate"),
            endDate: formData.get("endDate"),
            days: calculateDays(formData.get("startDate"), formData.get("endDate")),
            status: "Pending",
            reason: formData.get("reason"),
            contactInfo: formData.get("contactInfo") || ""
        };

        // Simulate adding to system (store temporarily)
        console.log("Submitted Leave Request:", newRequest);
        alert("Leave request submitted successfully.");
        form.reset();
        switchToAllRequests();
    });

    cancelButton?.addEventListener("click", () => {
        form.reset();
        switchToAllRequests();
    });

    function calculateDays(start, end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const timeDiff = endDate - startDate;
        return timeDiff >= 0 ? Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1 : 1;
    }
});
