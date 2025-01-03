import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  downloadFile(blob: Blob, fileName: string, openInNewTab = false) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);

    a.href = url;
    if (openInNewTab) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    } else {
      a.download = fileName;
    }

    a.click();
    window.URL.revokeObjectURL(url);
  }

  getFileNameFromResponseHeader<T>(response: HttpResponse<T>) {
    const contentDispositionHeader = response.headers.get(
      'content-disposition',
    );

    const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = fileNameRegex.exec(contentDispositionHeader as string);

    let filename = '';
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, '');
    }

    return filename;
  }
}
