export const generateTimeOptions = (start: boolean, end: boolean) => {
  let times = [];

  if (start) {
    for (let i = 6; i <= 11; i++) {
      times.push(`${i}:00 AM`);
    }
    times.push(`12:00 PM`);
  }

  if (end) {
    for (let i = 1; i <= 11; i++) {
      times.push(`${i}:00 PM`);
    }
    times.push(`12:00 AM`);
  }

  return times;
};
