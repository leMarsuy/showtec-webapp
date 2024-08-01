import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileService } from '@app/shared/services/file/file.service';
import { Observable } from 'rxjs';
import { SnackbarService } from '../snackbar/snackbar.service';

interface PdfViewerProps {
  apiCall: Observable<{
    blob: Blob;
    filename: string;
  }>;
  title: string;
}

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.scss',
})
export class PdfViewerComponent {
  @ViewChild('pdfRef', { static: false }) pdfRef!: ElementRef;
  loading = true;

  fileName!: string;
  blob!: Blob;
  pdfData!: SafeResourceUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: PdfViewerProps,
    private domSanitizer: DomSanitizer,
    private file: FileService,
    private sb: SnackbarService
  ) {
    data.apiCall.subscribe(
      (response: { blob: Blob; filename: string }) => {
        this.blob = response.blob;
        this.fileName = response.filename;
        const pdfLink = window.URL.createObjectURL(response.blob);
        setTimeout(() => {
          this.pdfData =
            this.domSanitizer.bypassSecurityTrustResourceUrl(pdfLink);
        }, 1000);
      },
      (error) => {
        var { errorCode, message } = error.error;
        this.sb.openErrorSnackbar(errorCode, message);
      }
    );
  }

  download() {
    this.sb.openLoadingSnackbar('Downloading', 'Please wait...');
    setTimeout(() => {
      this.sb._loadingSnackbarRef.dismiss();
    }, 1500);
    this.file.downloadFile(this.blob, this.fileName);
  }
}
