import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-upsert-category',
  templateUrl: './upsert-category.component.html',
  styleUrl: './upsert-category.component.scss',
})
export class UpsertCategoryComponent {
  categoryControl = this.fb.control('', Validators.required);
  title = 'Add Category';
  submitLabel = 'Add';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly dialogRef: MatDialogRef<UpsertCategoryComponent>,
    private readonly fb: FormBuilder,
  ) {
    if (this.data) {
      this.categoryControl.setValue(this.data);
      this.title = 'Update Category';
      this.submitLabel = 'Update';
    }
  }

  onInputChange() {
    const value = this.categoryControl.value ?? '';
    this.categoryControl.setValue(value?.toUpperCase());
  }

  onSubmit() {
    this.dialogRef.close(this.categoryControl.value);
  }
}
