import { Alignment } from '../enums/align.enum';
import { Color } from '../enums/color.enum';
import { ColumnType } from '../enums/column-type.enum';

export interface ColorCode {
  value: string;
  color: Color;
}

interface Action {
  name: string;
  icon: string;
  color: Color;
  action?: string;
  showIfCondition?: any;
}

export interface TableColumn {
  label: string;
  dotNotationPath: string | string[];
  type: ColumnType;
  display?: (element: any) => string;
  width?: string;
  editable?: boolean;
  actions?: Action[];
  colorCodes?: ColorCode[];
  align?: Alignment;
  options?: Array<string | number>;
  valueIfEmpty?: string;
}
