import express from 'express';
import moment from 'moment';

const router = express.Router();

router.get('/', (req, res) => {
  const { view = 'month', month, year, date } = req.query;

  const realToday = moment(); // Hari ini

  let currentDate = moment();
  if (view === 'month') {
    if (month && year) {
      currentDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD');
    }
  } else if (view === 'week' || view === 'day') {
    if (date) {
      currentDate = moment(date, 'YYYY-MM-DD');
    }
  }

  const monthName = currentDate.format('MMMM');
  const yearValue = currentDate.year();
  const monthNumber = currentDate.month() + 1; // moment 0-based, jadi +1

  const selectedWeekLabel = `${currentDate.clone().startOf('week').format('MMM D')} – ${currentDate.clone().endOf('week').format('MMM D')}`;
  const selectedDayLabel = currentDate.format('dddd, MMM D, YYYY');

  let prevLink = '';
  let nextLink = '';

  if (view === 'month') {
    const prevDate = currentDate.clone().subtract(1, 'month');
    const nextDate = currentDate.clone().add(1, 'month');
    prevLink = `?month=${prevDate.month() + 1}&year=${prevDate.year()}&view=${view}`;
    nextLink = `?month=${nextDate.month() + 1}&year=${nextDate.year()}&view=${view}`;
  } else if (view === 'week') {
    const prevWeek = currentDate.clone().subtract(1, 'week');
    const nextWeek = currentDate.clone().add(1, 'week');
    prevLink = `?date=${prevWeek.format('YYYY-MM-DD')}&view=${view}`;
    nextLink = `?date=${nextWeek.format('YYYY-MM-DD')}&view=${view}`;
  } else if (view === 'day') {
    const prevDay = currentDate.clone().subtract(1, 'day');
    const nextDay = currentDate.clone().add(1, 'day');
    prevLink = `?date=${prevDay.format('YYYY-MM-DD')}&view=${view}`;
    nextLink = `?date=${nextDay.format('YYYY-MM-DD')}&view=${view}`;
  }

  let weekDays = [];

  if (view === 'week') {
    const startOfWeek = currentDate.clone().startOf('week'); // Mulai dari Minggu
    for (let i = 0; i < 7; i++) {
      const day = startOfWeek.clone().add(i, 'days');
      weekDays.push({
        label: day.format('ddd, MMM D'), // contoh: Sun, Apr 27
        date: day.format('YYYY-MM-DD')
      });
    }
  }

  res.render('calendar', {
    view,
    monthName,
    year: yearValue,
    month: monthNumber,
    prevLink,
    nextLink,
    selectedDayLabel,
    selectedWeekLabel,
    selectedDate: currentDate.format('YYYY-MM-DD'),
    startDay: currentDate.clone().startOf('month').day(),
    daysInMonth: currentDate.daysInMonth(),
    today: realToday.toDate(),
    weekDays, // <-- 🔥 tambahkan ini
  });  
});

export default router;
