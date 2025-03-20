// Format date to YYYY-MM-DD
export const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Format time to HH:MM:SS
export const formatTime = (time) => {
  if (!time) return null;
  
  if (typeof time === 'string' && time.includes(':')) {
    return time;
  }
  
  const d = new Date(time);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

// Calculate date difference in days
export const dateDiffInDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Calculate working hours
export const calculateWorkingHours = (clockIn, clockOut) => {
  if (!clockIn || !clockOut) return 0;
  
  const [inHours, inMinutes, inSeconds] = clockIn.split(':').map(Number);
  const [outHours, outMinutes, outSeconds] = clockOut.split(':').map(Number);
  
  const inDate = new Date();
  inDate.setHours(inHours, inMinutes, inSeconds);
  
  const outDate = new Date();
  outDate.setHours(outHours, outMinutes, outSeconds);
  
  // If clock out is before clock in, assume it's the next day
  if (outDate < inDate) {
    outDate.setDate(outDate.getDate() + 1);
  }
  
  const diffMs = outDate - inDate;
  const diffHours = diffMs / (1000 * 60 * 60);
  
  return parseFloat(diffHours.toFixed(2));
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Generate random password
export const generateRandomPassword = (length = 8) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

// Validate phone number format
export const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^[0-9]{10,15}$/;
  return phoneRegex.test(phoneNumber);
};

// Sanitize input to prevent SQL injection
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[\0\x08\x09\x1a\n\r"'\\%]/g, (char) => {
      switch (char) {
        case '\0': return '\\0';
        case '\x08': return '\\b';
        case '\x09': return '\\t';
        case '\x1a': return '\\z';
        case '\n': return '\\n';
        case '\r': return '\\r';
        case '"':
        case "'":
        case '\\':
        case '%':
          return '\\' + char;
        default: return char;
      }
    });
};
