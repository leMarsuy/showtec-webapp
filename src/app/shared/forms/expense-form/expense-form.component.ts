import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  EXPENSE_PAYMENT_METHODS,
  PAYMENT_METHODS,
  PaymentMethod,
} from '@app/core/enums/payment-method.enum';
import { PAYMENT_STATUSES } from '@app/core/enums/payment-status.enum';
import { REGISTERED_BANKS } from '@app/core/enums/registered-bank.enum';
import { Expense } from '@app/core/models/expense.model';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-expense-form',
  providers: [provideNativeDateAdapter()],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.scss',
})
export class ExpenseFormComponent implements OnInit, OnDestroy {
  @Input() expense!: Expense;
  @Output() formEmitter: EventEmitter<FormGroup> = new EventEmitter();

  paymentStatuses = PAYMENT_STATUSES;
  paymentMethods = EXPENSE_PAYMENT_METHODS;
  registeredBanks: Array<any>;
  expenseForm: FormGroup;

  constructor(private fb: FormBuilder, private sb: SnackbarService) {
    this.expenseForm = this.fb.group({
      paymentMethod: [PaymentMethod.CHECK, Validators.required],
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

    this.registeredBanks = REGISTERED_BANKS.map((value) => value.toUpperCase()); //As per Expense Model, bank property is set to uppercase === true
  }

  destroyed$ = new Subject<void>();

  ngOnInit(): void {
    if (!!this.expense) this.expenseForm.patchValue(this.expense); //Has expense data; UPDATE/VIEW

    this._adjustFormBasedOnPaymentMethod(this.expenseForm);
    this._emitForm();

    this.expenseForm.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroyed$))
      .subscribe(() => {
        this._adjustFormBasedOnPaymentMethod(this.expenseForm);
        this._emitForm();
      });
  }

  get isPaymentCheck() {
    return this.expenseForm.get('paymentMethod')?.value === PaymentMethod.CHECK;
  }
  get isPaymentBankTransfer() {
    return (
      this.expenseForm.get('paymentMethod')?.value ===
      PaymentMethod.BANK_TRANSFER
    );
  }

  /**
   *  If paymentMethod === "BANK TRANSFER", then set refNo required and make checkNo not required, reset value
   *  If paymentMethod === "CHECK", then set checkNo required and make refNo not required, reset value
   */

  private _adjustFormBasedOnPaymentMethod(expenseForm: FormGroup) {
    const paymentMethod = expenseForm.get('paymentMethod')?.value;
    const refControl = expenseForm.get('refNo');
    const checkControl = expenseForm.get('checkNo');

    switch (paymentMethod) {
      case PaymentMethod.BANK_TRANSFER:
        checkControl?.clearValidators();
        checkControl?.reset(null, { emitEvent: false });
        refControl?.setValidators(Validators.required);
        break;
      case PaymentMethod.CHECK:
        refControl?.clearValidators();
        refControl?.reset(null, { emitEvent: false });
        checkControl?.setValidators(Validators.required);
        break;
    }

    refControl?.updateValueAndValidity({ emitEvent: false });
    checkControl?.updateValueAndValidity({ emitEvent: false });
  }

  private _emitForm() {
    this.formEmitter.emit(this.expenseForm);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
