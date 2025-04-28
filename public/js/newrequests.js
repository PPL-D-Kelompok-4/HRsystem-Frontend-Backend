document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("new-request-form");
    const cancelButton = document.getElementById("cancel-new-request");

    const currentUser = window.currentUser || {}; // ambil user dari global window

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData(form);
            const type = formData.get("type");
            const startDate = formData.get("startDate");
            const endDate = formData.get("endDate");
            const reason = formData.get("reason");

            if (!type || !startDate || !endDate || !reason) {
                Swal.fire("Error", "Please complete all fields!", "error");
                return;
            }

            // 🔥 Cek apakah user punya pending request
            const pendingRes = await fetch("/api/leaves/check-pending", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${getToken()}`,
                },
            });

            if (!pendingRes.ok) {
                throw new Error("Failed to check pending leave");
            }

            const pendingData = await pendingRes.json();

            if (pendingData.hasPending) {
                Swal.fire({
                    icon: "warning",
                    title: "Request Still Pending!",
                    text: "You already have a pending leave request. Please wait until it's approved or rejected before creating a new one.",
                });
                return;
            }

            // ✅ Lanjut submit request baru
            const response = await fetch("/api/leaves", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    tanggal_Mulai: startDate,
                    tanggal_Selesai: endDate,
                    keterangan_Cuti: reason,
                    leaveType: type,
                    contactInfo: currentUser.email || "", // ✨ AUTO ISI dari user login
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to submit request");
            }

            Swal.fire({
                icon: "success",
                title: "Request Submitted!",
                text: "Your leave request has been successfully submitted.",
            }).then(() => {
                window.location.href = "/allrequests";
            });

        } catch (error) {
            console.error("Error submitting leave request:", error);
            Swal.fire({
                icon: "error",
                title: "Submission Failed",
                text: error.message || "Unknown error occurred",
            });
        }
    });

    cancelButton.addEventListener("click", () => {
        window.location.href = "/allrequests";
    });

    function getToken() {
        const value = document.cookie.split('; ').find(row => row.startsWith('token='));
        return value ? value.split('=')[1] : '';
    }
});
