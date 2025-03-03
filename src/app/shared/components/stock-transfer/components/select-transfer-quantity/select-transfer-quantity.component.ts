import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
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
import { Subject, takeUntil } from 'rxjs';
import { WarehouseStock } from '../../stock-transfer.component';

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
export class SelectTransferQuantityComponent implements OnDestroy {
  private fb = inject(FormBuilder);

  public data = inject<Record<string, any>>(MAT_DIALOG_DATA);
  public dialogRef = inject(MatDialogRef<SelectTransferQuantityComponent>);

  form!: FormGroup;

  private _destroyed$ = new Subject<void>();

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
        quantity: [
          stock.quantity === 1 ? 1 : undefined,
          [
            Validators.max(stock.quantity),
            Validators.min(1),
            Validators.required,
          ],
        ],
        _stockIds: [{ value: stock._stockIds, disabled: true }],
      }) as FormGroup;

      formArray.push(formGroup);
    }

    this.form = this.fb.group({
      stocks: formArray,
    });

    this.form
      .get('stocks')
      ?.valueChanges.pipe(takeUntil(this._destroyed$))
      .subscribe(() => {
        const stocks = this.form.getRawValue().stocks;
        for (const stock of stocks) {
          if (!stock.quantity) {
            continue;
          }

          const stockIndex = this.data['stocks'].findIndex(
            (s: WarehouseStock) => s._id === stock._id,
          );

          const stockQuantity = this.data['stocks'][stockIndex]['quantity'];

          if (stock.quantity > stockQuantity || stock.quantity < 1) {
            this.form
              .get('stocks')
              ?.get(String(stockIndex))
              ?.get('quantity')
              ?.patchValue(stockQuantity);
          }
        }
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

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
