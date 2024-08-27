const ONE_DAY = 24 * 60 * 60 * 1000;

export function getDateDiffInDays(firstDate: Date, secondDate: Date) {
  return Math.round(getDiff(firstDate, secondDate) / ONE_DAY);
}

export function getDateDiffInMonths(firstDate: Date, secondDate: Date) {
  return Math.round(getDiff(firstDate, secondDate) / ONE_DAY);
}

export function getDateDiffInYears(firstDate: Date, secondDate: Date) {
  return Math.round(getDiff(firstDate, secondDate) / ONE_DAY);
}

export function getPastDate(date: Date, pastDays: number) {
  return new Date(date.setDate(date.getDate() - pastDays));
}

export function getDateFloor(date: Date) {
  date.setHours(0, 0, 0, 0);
  return date;
}

export function getDateCeil(date: Date) {
  date.setHours(23, 59, 59, 99);
  return date;
}

function getDiff(firstDate: Date, secondDate: Date) {
  return new Date(secondDate).getTime() - new Date(firstDate).getTime();
}
