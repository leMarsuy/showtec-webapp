import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-select-transfer-quantity',
  templateUrl: './select-transfer-quantity.component.html',
  styleUrl: './select-transfer-quantity.component.scss',
})
export class SelectTransferQuantityComponent {
  private fb = inject(FormBuilder);

  public data = inject<Record<string, any>>(MAT_DIALOG_DATA);
  public dialogRef = inject(MatDialogRef<SelectTransferQuantityComponent>);

  form!: FormGroup;
  fromWarehouse!: any;
  toWarehouse!: any;

  constructor() {
    const stocks = this.data['stocks'];
    const { fromWarehouse, toWarehouse } = this.data['warehouse'];

    this.fromWarehouse = fromWarehouse;
    this.toWarehouse = toWarehouse;

    const formArray = new FormArray<any>([]);

    for (const stock of stocks) {
      const formGroup = this.fb.group({
        _id: [{ value: stock._id, disabled: true }],
        serialNumber: [{ value: stock.serialNumber, disabled: true }],
        type: [{ value: stock.type, disabled: true }],
        sku: [{ value: stock.sku, disabled: true }],
        _productId: [{ value: stock._productId, disabled: true }],
        _warehouseId: [{ value: stock._warehouseId, disabled: true }],
        quantity: [0, [Validators.max(stock.quantity), Validators.min(1)]],
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
