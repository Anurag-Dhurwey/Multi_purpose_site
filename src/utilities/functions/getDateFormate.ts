const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// const date = new Date();
const now = new Date();

let previousDate: string | undefined;

function returnDate(dateOrTime: string) {
  if (previousDate === dateOrTime) {
    return null;
  } else {
    previousDate = dateOrTime;
    return dateOrTime;
  }
}

export const getDateFormate = (date: Date) => {
  if (
    date.getFullYear() == now.getFullYear() &&
    date.getMonth() == now.getMonth() &&
    date.getDate() == now.getDate()
  ) {
    return returnDate("Today");
  } else if (
    date.getFullYear() == now.getFullYear() &&
    date.getMonth() == now.getMonth()
  ) {
    const diff = now.getDate() - date.getDate();
    if (diff >= 0 && diff <= 6) {
      return returnDate(days[date.getDay()]);
    } else {
      return returnDate(`${date.getDate()} ${months[date.getMonth()]}`);
    }
  } else if (date.getFullYear() == now.getFullYear()) {
    return returnDate(`${date.getDate()} ${months[date.getMonth()]}`);
  } else {
    return returnDate(
      `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
    );
  }
};
