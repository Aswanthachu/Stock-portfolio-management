export default function formatDate(inputDate) {
    const currentDate = new Date();
    const inputDateTime = inputDate.getTime();
    const currentDateTime = currentDate.getTime();
    const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
  
    // If it's today
    if (inputDate.toDateString() === currentDate.toDateString()) {
      return `Today ${formatTime(inputDate)}`;
    }
  
    // If it's yesterday
    if (
      inputDateTime >= currentDateTime - oneDay &&
      inputDateTime < currentDateTime
    ) {
      return `Yesterday ${formatTime(inputDate)}`;
    }
  
    // If it's before yesterday and within 7 days
    if (inputDateTime > currentDateTime - 7 * oneDay) {
      const dayOfWeek = getDayOfWeek(inputDate);
      return `${dayOfWeek} ${formatTime(inputDate)}`;
    }
  
    // For dates older than 7 days
    return `${formatFullDate(inputDate)} ${formatTime(inputDate)}`;
  }
  

function formatTime(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${formattedHours}.${formattedMinutes} ${ampm}`;
}

function formatFullDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-indexed
  const year = date.getFullYear();

  return `${padZero(month)}-${padZero(day)}-${year}`;
}

function getDayOfWeek(date) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayIndex = date.getDay();
  return daysOfWeek[dayIndex];
}

function padZero(number) {
  return number < 10 ? `0${number}` : number;
}

