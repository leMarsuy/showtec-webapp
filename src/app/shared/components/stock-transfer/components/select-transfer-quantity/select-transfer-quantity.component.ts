import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-select-transfer-quantity',
  templateUrl: './select-transfer-quantity.component.html',
  styleUrl: './select-transfer-quantity.component.scss',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    CommonModule,
  ],
})
export class SelectTransferQuantityComponent {
  private fb = inject(FormBuilder);

  public data = inject<Record<string, any>>(MAT_DIALOG_DATA);
  public dialogRef = inject(MatDialogRef<SelectTransferQuantityComponent>);

  form!: FormGroup;

  constructor() {
    const formArray = new FormArray<any>([]);

    for (const stock of this.data['stocks']) {
      const formGroup = this.fb.group({
        _id: [{ value: stock._id, disabled: true }],
        serialNumber: [{ value: stock.serialNumber, disabled: true }],
        type: [{ value: stock.type, disabled: true }],
        sku: [{ value: stock.sku, disabled: true }],
        _productId: [{ value: stock._productId, disabled: true }],
        _warehouseId: [{ value: stock._warehouseId, disabled: true }],
        quantity: [0, [Validators.max(stock.quantity), Validators.min(1)]],
        _stockIds: [{ value: stock._stockIds, disabled: true }],
      }) as FormGroup;

      formArray.push(formGroup);
    }

    this.form = this.fb.group({
      stocks: formArray,
    });
  }

  addMinusStock(
    method: 'add' | 'minus',
    formControl: FormControl,
    index: number,
  ) {
    const maxValueLimit = this.data['stocks'][index]['quantity'];

    const currentValue = formControl.value;

    if (method === 'add' && currentValue + 1 <= maxValueLimit) {
      formControl.patchValue(currentValue + 1);
    } else if (method === 'minus' && currentValue - 1 >= 0) {
      formControl.patchValue(currentValue - 1);
    }
  }

  restrictNumericInput(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  onConfirm() {
    this.dialogRef.close(this.form.getRawValue().stocks);
  }
}
