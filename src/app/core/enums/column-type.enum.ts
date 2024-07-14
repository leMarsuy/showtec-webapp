export enum ColumnType {
  STRING = 'string',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
  CURRENCY = 'currency',
  AGE_IN_DAYS = 'age-in-days',
  AGE_IN_MONTHS = 'age-in-months',
  AGE_IN_YEARS = 'age-in-years',
  // special
}

export const COLUMN_TYPES = Object.values(ColumnType);
