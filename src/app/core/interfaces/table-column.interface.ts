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
}

export interface TableColumn {
  label: string;
  dotNotationPath: string;
  type: ColumnType;
  width?: string;
  editable?: boolean;
  actions?: Action[];
  colorCodes?: ColorCode[];
  align?: Alignment;
  options?: Array<string | number>;
}
