const express = require('express');
const router = express.Router();
const moment = require('moment'); // Import moment.js untuk format tanggal yang lebih mudah

router.get('/', (req, res) => {
  const { view = 'month', month, year, date } = req.query;

  // Jika view = 'month', tentukan bulan dan tahun yang aktif
  let currentDate = date ? moment(date) : moment();
  if (view === 'month') {
    // Menentukan bulan dan tahun berdasarkan query atau default ke bulan ini
    currentDate = month && year ? moment(`${year}-${month}-01`, 'YYYY-MM-DD') : moment();
  } else if (view === 'week' || view === 'day') {
    currentDate = date ? moment(date) : moment(); // Default ke hari ini jika view = 'week' atau 'day'
  }

  // Mendapatkan nama bulan dan tahun
  const monthName = currentDate.format('MMMM');
  const yearValue = currentDate.year();
  const monthNumber = currentDate.month() + 1;

  // Menentukan minggu dan hari
  const selectedWeekLabel = `${currentDate.startOf('week').format('MMM D')} – ${currentDate.endOf('week').format('MMM D')}`;
  const selectedDayLabel = currentDate.format('dddd, MMM D, YYYY');

  // Menentukan tanggal sebelumnya dan setelahnya
  const prevMonth = currentDate.clone().subtract(1, 'month').month();
  const nextMonth = currentDate.clone().add(1, 'month').month();

  const prevYear = currentDate.clone().subtract(1, 'year').year();
  const nextYear = currentDate.clone().add(1, 'year').year();

  let prevLink = '';
  let nextLink = '';
  
  if (view === 'month') {
    prevLink = `?month=${prevMonth + 1}&year=${prevYear}&view=${view}`;
    nextLink = `?month=${nextMonth + 1}&year=${nextYear}&view=${view}`;
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

  // Render ke EJS dengan data yang sudah disiapkan
  res.render('calendar', {
    view,
    monthName,
    year: yearValue,
    month: monthNumber,
    prevMonth,
    nextMonth,
    prevYear,
    nextYear,
    prevLink,
    nextLink,
    selectedDayLabel,
    selectedWeekLabel,
    selectedDate: currentDate.format('YYYY-MM-DD'),
  });
});

module.exports = router;
