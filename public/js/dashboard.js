document.addEventListener("DOMContentLoaded", () => {
  const recentHiresContainer = document.querySelector("[data-dashboard-recent-hires]");
  const noRecentHires = document.querySelector("[data-dashboard-no-recent-hires]");
  const pendingLeavesContainer = document.querySelector("[data-dashboard-pending-leave-requests]");
  const refreshChartBtn = document.getElementById("refresh-employee-chart");
  let employeeChartInstance = null;

  async function renderEmployeeChart() {
    const ctx = document.getElementById('employeeChart').getContext('2d');
    try {
      const res = await fetch('/api/overview');
      const data = await res.json();

      const labels = data.map(item => item.department);
      const counts = data.map(item => item.total_employees);

      if (employeeChartInstance) {
        employeeChartInstance.destroy();
      }

      employeeChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Number of Employees',
            data: counts,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              stepSize: 1
            }
          }
        }
      });
    } catch (error) {
      console.error('Failed to load employee overview:', error);
    }
  }

  async function renderRecentHires() {
    try {
      const res = await fetch('/api/recenthires');
      const hires = await res.json();

      recentHiresContainer.innerHTML = "";

      if (hires.length === 0) {
        noRecentHires.classList.remove("hidden");
      } else {
        noRecentHires.classList.add("hidden");
      }

      hires.forEach(emp => {
        const el = document.createElement("div");
        el.className = "flex justify-between items-center";
        el.innerHTML = `
          <div class="flex items-center">
            <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span class="text-gray-600 font-medium">${emp.nama.split(' ').map(n => n[0]).join('')}</span>
            </div>
            <div class="ml-3">
              <p class="font-medium">${emp.nama}</p>
              <p class="text-gray-500 text-sm">${emp.department} - ${emp.position}</p>
            </div>
          </div>
          <div>${new Date(emp.tanggal_Bergabung).toLocaleDateString()}</div>
        `;
        recentHiresContainer.appendChild(el);
      });
    } catch (error) {
      console.error('Failed to load recent hires:', error);
    }
  }

  async function renderPendingLeaves() {
    try {
      const res = await fetch('/api/pendingleaves');
      const leaves = await res.json();
  
      pendingLeavesContainer.innerHTML = "";
  
      if (leaves.length === 0) {
        pendingLeavesContainer.innerHTML = `
          <div class="text-center py-4 text-gray-500">
            No pending leave requests
          </div>
        `;
      } else {
        leaves.forEach(leave => {
          const el = document.createElement("div");
          el.className = "bg-gray-50 p-3 rounded-md border border-gray-200 mb-2";
          el.innerHTML = `
            <p class="text-gray-700 font-medium">${leave.employee}</p>
            <p class="text-sm text-gray-500 mb-2">
              From ${leave.startDate} to ${leave.endDate} — Reason: ${leave.reason}
            </p>
            <div class="flex space-x-2">
              <button data-approve="${leave.leaveID}" class="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600">Approve</button>
              <button data-reject="${leave.leaveID}" class="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600">Reject</button>
            </div>
          `;
          pendingLeavesContainer.appendChild(el);
        });
  
        // Add event listeners after render
        pendingLeavesContainer.querySelectorAll("[data-approve]").forEach(btn => {
          btn.addEventListener("click", async (e) => {
            const id = btn.getAttribute("data-approve");
            await updateLeaveStatus(id, "Disetujui");
            await renderPendingLeaves();
          });
        });
  
        pendingLeavesContainer.querySelectorAll("[data-reject]").forEach(btn => {
          btn.addEventListener("click", async (e) => {
            const id = btn.getAttribute("data-reject");
            const { value: reason } = await Swal.fire({
              title: 'Reason for rejection',
              input: 'text',
              inputPlaceholder: 'Enter reason...',
              showCancelButton: true,
              confirmButtonText: 'Reject',
              cancelButtonText: 'Cancel',
            });
  
            if (reason) {
              await updateLeaveStatus(id, "Ditolak", reason);
              await renderPendingLeaves();
            }
          });
        });
      }
    } catch (error) {
      console.error('Failed to load pending leaves:', error);
    }
  }
  
  async function updateLeaveStatus(id, status, reason = "") {
    try {
      const res = await fetch(`/api/leaves/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: status,
          keterangan_Cuti: reason
        })
      });
  
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update leave status");
      }
  
      Swal.fire({
        icon: "success",
        title: `${status === "Disetujui" ? "Approved" : "Rejected"}!`,
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message
      });
    }
  }

  refreshChartBtn?.addEventListener("click", () => {
    renderEmployeeChart();
  });

  // Initial load
  renderEmployeeChart();
  renderRecentHires();
  renderPendingLeaves(); // <-- ✅ Tambahkan ini
});
