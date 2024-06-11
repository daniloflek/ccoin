function padMilliseconds(milliseconds: number) {
  return milliseconds.toString().padEnd(7, '0');
}
export function formatISO8601(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const milliseconds = padMilliseconds(date.getUTCMilliseconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}

export const timeout = (time: number) =>
  new Promise((res) => setTimeout(res, time));

export function compareDatesByDay(date1: Date, date2: Date) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  const year1 = d1.getFullYear();
  const month1 = d1.getMonth();
  const day1 = d1.getDate();

  const year2 = d2.getFullYear();
  const month2 = d2.getMonth();
  const day2 = d2.getDate();

  if (year1 === year2 && month1 === month2 && day1 === day2) {
    return 0;
  } else if (
    year1 < year2 ||
    (year1 === year2 && month1 < month2) ||
    (year1 === year2 && month1 === month2 && day1 < day2)
  ) {
    return -1;
  } else {
    return 1;
  }
}
