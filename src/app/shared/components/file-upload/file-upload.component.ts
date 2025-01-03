import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { SnackbarService } from '../snackbar/snackbar.service';
interface FileUploadProps {
  allowedExtensions: string[];
  label: string;
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  @Output()
  fileUploaded: EventEmitter<File> = new EventEmitter<File>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  isUploading = false;
  allowedExtensions = '';

  constructor(private snackbarService: SnackbarService) {}

  ngOnInit() {}

  fileSelected(event: Event) {
    const fileInput: HTMLInputElement = event.target as HTMLInputElement;

    if (!fileInput?.files?.length) {
      return;
    }

    const fileList = fileInput.files;
    this.fileUploaded.emit(fileList[0]);
  }

  private _formatFileExtensionDisplay(fileExtensions: Array<string>): string {
    const fileExtensionsToUpper = fileExtensions.map((fileExtension: string) =>
      fileExtension.toUpperCase(),
    );

    if (fileExtensions.length === 1) {
      return fileExtensionsToUpper[0].toUpperCase();
    }

    const lastExtension = fileExtensionsToUpper.pop();
    const otherExtensions = fileExtensionsToUpper.join(', ');
    const formattedStr = `${otherExtensions} or ${lastExtension}`;

    return formattedStr;
  }
}
