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

    let useStockFormControl: any;

    if (this.data['isArray']) {
      const formArray = new FormArray<any>([]);

      for (const stock of stocks) {
        const formGroup = this.fb.group({
          quantity: [0, [Validators.max(stock.quantity), Validators.min(1)]],
        }) as FormGroup;

        formArray.push(formGroup);
      }

      useStockFormControl = formArray as FormArray;
    } else {
      useStockFormControl = this.fb.group({
        quantity: [0, [Validators.max(stocks.quantity), Validators.min(1)]],
      }) as FormGroup;
    }

    this.form = this.fb.group({
      stocks: useStockFormControl,
    });
  }

  addMinusStock(
    method: 'add' | 'minus',
    formControl: FormControl,
    index?: number,
  ) {
    const maxValueLimit =
      this.data['isArray'] && index !== undefined
        ? this.data['stocks'][index]['quantity']
        : this.data['stocks']['quantity'];

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
}
