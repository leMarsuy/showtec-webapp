import { ColumnType } from '../enums/column-type.enum';

export interface TableColumn {
  label: string;
  dotNotationPath: string;
  type: ColumnType;
  width?: string;
}
