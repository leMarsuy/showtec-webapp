import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-upsert-title',
  templateUrl: './upsert-title.component.html',
  styleUrl: './upsert-title.component.scss',
})
export class UpsertTitleComponent {
  accountTitleGroup!: FormGroup;
  title = 'Add Title';
  submitLabel = 'Add';

  categories!: Array<string>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly dialogRef: MatDialogRef<UpsertTitleComponent>,
    private readonly fb: FormBuilder,
  ) {
    this.accountTitleGroup = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
    });

    if (this.data?.accountTitle) {
      this.accountTitleGroup.patchValue(this.data?.accountTitle);
      this.title = 'Update Title';
      this.submitLabel = 'Update';
    }
    this.categories = this.data?.categories ?? [];
  }

  onInputChange() {
    const value = this.accountTitleGroup.get('name')?.value;
    this.accountTitleGroup.get('name')?.setValue(value.toUpperCase());
  }

  onSubmit() {
    this.dialogRef.close(this.accountTitleGroup.getRawValue());
  }
}
