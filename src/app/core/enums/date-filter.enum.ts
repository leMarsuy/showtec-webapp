export enum DateFilterType {
  ALL_TIME = 'all-time',
  THIS_WEEK = 'this-week',
  THIS_MONTH = 'this-month',
  THIS_YEAR = 'this-year',
  DATE_RANGE = 'date-range',
}

export const DATE_FILTER_MENU_OPTIONS = Object.entries(DateFilterType).map(
  ([key, value]) => ({
    label: key
      .toLowerCase() // Convert to lowercase
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()), // Capitalize each word
    value: value,
  }),
);
