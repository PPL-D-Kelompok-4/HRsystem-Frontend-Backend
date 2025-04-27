const addBtn = document.getElementById('addEventBtn');
const modal = document.getElementById('eventModal');
const cancel = document.getElementById('cancelModal');
const form = document.getElementById('eventForm');
const allDayCheckbox = document.getElementById('allDayCheckbox');
const timeFields = document.getElementById('timeFields');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function openModal() {
  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
}

function updateTimeFieldState() {
  if (allDayCheckbox.checked) {
    timeFields.classList.add('hidden');
    form.startTime.removeAttribute('required');
    form.endTime.removeAttribute('required');
  } else {
    timeFields.classList.remove('hidden');
    form.startTime.setAttribute('required', 'required');
    form.endTime.setAttribute('required', 'required');
  }
}

function generateTimeOptions() {
  const startTimeSelect = document.getElementById('startTime');
  const endTimeSelect = document.getElementById('endTime');

  function addOption(select, value) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  }

  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, '0');
      const minute = m.toString().padStart(2, '0');
      const time = `${hour}:${minute}`;
      addOption(startTimeSelect, time);
      addOption(endTimeSelect, time);
    }
  }
}


addBtn?.addEventListener('click', openModal);
cancel?.addEventListener('click', closeModal);
allDayCheckbox?.addEventListener('change', updateTimeFieldState);

form?.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
  
    if (!data.allDay) {
      const start = data.startTime;
      const end = data.endTime;
      if (start && end && start >= end) {
        alert("Start time must be earlier than end time!");
        return;
      }
    }
  
    console.log("Event submitted:", data);
    modal.classList.add('hidden');
    alert("Event saved (you can now connect to backend)");
  });  

  function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      view: params.get('view') || 'month',
      date: params.get('date'), 
      month: params.get('month'),
      year: params.get('year')
    };
  }
  
  function navigateCalendar(direction) {
    const { view, date, month, year } = getQueryParams();
    let newUrl = '';
  
    if (view === 'month') {
      let newMonth = parseInt(month) + direction;
      let newYear = parseInt(year);
      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }
      newUrl = `/calendar?month=${newMonth}&year=${newYear}&view=month`;
    } else if (view === 'week' || view === 'day') {
      const currentDate = date ? new Date(date) : new Date();
      if (view === 'week') {
        currentDate.setDate(currentDate.getDate() + (7 * direction));
      } else if (view === 'day') {
        currentDate.setDate(currentDate.getDate() + direction);
      }
      const isoDate = currentDate.toISOString().split('T')[0]; // yyyy-mm-dd
      newUrl = `/calendar?view=${view}&date=${isoDate}`;
    }
  
    window.location.href = newUrl;
  }
  
  prevBtn?.addEventListener('click', e => {
    e.preventDefault();
    navigateCalendar(-1);
  });
  
  nextBtn?.addEventListener('click', e => {
    e.preventDefault();
    navigateCalendar(1);
  });
  

// Set default saat load
updateTimeFieldState();
generateTimeOptions();
