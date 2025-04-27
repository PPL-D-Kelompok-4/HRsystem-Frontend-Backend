document.addEventListener("DOMContentLoaded", () => {
    const recentHiresContainer = document.querySelector("[data-dashboard-recent-hires]");
    const noRecentHires = document.querySelector("[data-dashboard-no-recent-hires]");
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
          employeeChartInstance.destroy(); // Hancurkan chart lama sebelum render baru
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
  
    refreshChartBtn?.addEventListener("click", () => {
      renderEmployeeChart();
    });
  
    // Initial load
    renderEmployeeChart();
    renderRecentHires();
  });
  