// Date utilities
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return new Date(date).toLocaleDateString('id-ID', defaultOptions);
};

export const formatTime = (date, options = {}) => {
  const defaultOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };
  
  return new Date(date).toLocaleTimeString('id-ID', defaultOptions);
};

export const formatDateTime = (date) => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const formatRelativeTime = (date) => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now - targetDate) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Baru saja';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} hari yang lalu`;
  }
  
  return formatDate(date);
};

export const isToday = (date) => {
  const today = new Date();
  const targetDate = new Date(date);
  
  return today.toDateString() === targetDate.toDateString();
};

export const isTomorrow = (date) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const targetDate = new Date(date);
  
  return tomorrow.toDateString() === targetDate.toDateString();
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getWeekDays = (startDate = new Date()) => {
  const days = [];
  const start = new Date(startDate);
  start.setDate(start.getDate() - start.getDay()); // Start from Sunday
  
  for (let i = 0; i < 7; i++) {
    days.push(new Date(start));
    start.setDate(start.getDate() + 1);
  }
  
  return days;
};

export const getBusinessHours = () => {
  return {
    start: '08:00',
    end: '20:00',
    isOpen: (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      const timeInMinutes = hours * 60 + minutes;
      return timeInMinutes >= 8 * 60 && timeInMinutes <= 20 * 60;
    }
  };
};

export const getAvailableTimeSlots = (date, duration = 60) => {
  const slots = [];
  const businessHours = getBusinessHours();
  const [startHour] = businessHours.start.split(':').map(Number);
  const [endHour] = businessHours.end.split(':').map(Number);
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += duration) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeString);
    }
  }
  
  return slots;
};