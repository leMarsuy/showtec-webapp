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

function getDiff(firstDate: Date, secondDate: Date) {
  return new Date(secondDate).getTime() - new Date(firstDate).getTime();
}
