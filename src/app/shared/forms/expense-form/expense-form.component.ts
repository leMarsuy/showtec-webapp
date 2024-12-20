import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { PAYMENT_METHODS } from '@app/core/enums/payment-method.enum';
import { PAYMENT_STATUSES } from '@app/core/enums/payment-status.enum';
import { Expense } from '@app/core/models/expense.model';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';

@Component({
  selector: 'app-expense-form',
  providers: [provideNativeDateAdapter()],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.scss',
})
export class ExpenseFormComponent implements OnInit {
  @Input() expense!: Expense;
  @Output() formEmitter: EventEmitter<FormGroup> = new EventEmitter();

  paymentStatuses = PAYMENT_STATUSES;
  paymentMethods = PAYMENT_METHODS;
  expenseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private sb: SnackbarService,
  ) {
    this.expenseForm = this.fb.group({
      paymentMethod: ['', Validators.required],
      bank: ['', Validators.required],
      paymentDate: ['', Validators.required],
      refNo: [''],
      checkNo: [''],
      payee: ['', Validators.required],
      purpose: ['', Validators.required],
      description: [''],
      amount: ['', [Validators.required]],
      status: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (!!this.expense) {
      this.expenseForm.patchValue(this.expense);
    }
    this.formEmitter.emit(this.expenseForm);

    this.expenseForm.valueChanges.subscribe(() => {
      this.formEmitter.emit(this.expenseForm);
    });
  }
}
