export enum FieldType {
  TEXT = 'text',
  NUMBER = 'number',
  EMAIL = 'email',

  DATE = 'date',

  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  SELECT = 'select',
  MULTIPLE_SELECT = 'multiple_select',
}

export const FIELD_TYPES = Object.values(FieldType);
