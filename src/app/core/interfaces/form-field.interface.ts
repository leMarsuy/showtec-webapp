import { MatFormFieldAppearance } from '@angular/material/form-field';
import { FieldType } from '../enums/field-type.enum';

export interface FormField {
  label: string;
  path: string;
  type?: FieldType;
  _attr?: {
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    placeholder?: string;
    appearance?: MatFormFieldAppearance;
  };
  select?: {
    options?: Array<any>;
    path?: string;
  };
}
