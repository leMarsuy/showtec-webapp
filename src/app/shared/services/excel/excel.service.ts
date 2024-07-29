import * as XLSX from 'xlsx';

import { Injectable } from '@angular/core';

const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  download(filename: string, json: Array<object>) {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, filename + EXCEL_EXTENSION);
  }

  excel2json(ws: XLSX.WorkSheet): Array<any> {
    return [...XLSX.utils.sheet_to_json(ws)];
  }
}
