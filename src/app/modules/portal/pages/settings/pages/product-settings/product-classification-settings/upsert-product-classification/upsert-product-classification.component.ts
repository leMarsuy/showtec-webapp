import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-upsert-product-classification',
  templateUrl: './upsert-product-classification.component.html',
  styleUrl: './upsert-product-classification.component.scss',
})
export class UpsertProductClassificationComponent {
  productClassificationControl = this.fb.control('', Validators.required);
  title = 'Add Product Classification';
  submitLabel = 'Add';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly dialogRef: MatDialogRef<UpsertProductClassificationComponent>,
    private readonly fb: FormBuilder,
  ) {
    if (this.data) {
      this.productClassificationControl.setValue(this.data);
      this.title = 'Update Product Classification';
      this.submitLabel = 'Update';
    }
  }

  onInputChange() {
    const value = this.productClassificationControl.value ?? '';
    this.productClassificationControl.setValue(value?.toUpperCase());
  }

  onSubmit() {
    this.dialogRef.close(this.productClassificationControl.value);
  }
}
