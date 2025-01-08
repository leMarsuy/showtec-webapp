import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OutDeliveryStatus } from '@app/core/enums/out-delivery-status.enum';
import { OutDelivery } from '@app/core/models/out-delivery.model';
import { ConfirmationService } from '@app/shared/components/confirmation/confirmation.service';
import { SnackbarService } from '@app/shared/components/snackbar/snackbar.service';
import { OutDeliveryApiService } from '@app/shared/services/api/out-delivery-api/out-delivery-api.service';
import { PurchaseOrderApiService } from '@app/shared/services/api/purchase-order-api/purchase-order-api.service';
import {
  debounceTime,
  filter,
  map,
  Observable,
  startWith,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'app-add-delivery-receipts',
  templateUrl: './add-delivery-receipts.component.html',
  styleUrl: './add-delivery-receipts.component.scss',
})
export class AddDeliveryReceiptsComponent implements OnInit, OnDestroy {
  outDeliveries$ = new Observable<OutDelivery[]>();

  searchDrControl = new FormControl('');
  fArray: FormArray = new FormArray<any>([]);
  filteredDr$!: Observable<any>;

  destroyed$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddDeliveryReceiptsComponent>,
    private readonly outDeliveryApi: OutDeliveryApiService,
    private readonly purchaseOrderApi: PurchaseOrderApiService,
    private readonly snackbar: SnackbarService,
    private readonly confirmation: ConfirmationService,
    private readonly fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.filteredDr$ = this.searchDrControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap((val: any) => {
        return this._fetchOutDeliveries(val || '');
      }),
      takeUntil(this.destroyed$),
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  isInArray(option: any) {
    return !!this.fArray.getRawValue().find((item) => item._id === option._id);
  }

  pushToList(outDelivery: OutDelivery) {
    const exists = this.isInArray(outDelivery);

    if (exists) {
      this.searchDrControl.reset();
      return;
    }

    const formGroup = this.fb.group({
      STATIC: outDelivery.STATIC,
      code: outDelivery.code,
      _id: outDelivery._id,
      items: this.fb.array(outDelivery.items),
      _customerId: outDelivery._customerId,
    });

    this.fArray.push(formGroup);
    this.searchDrControl.reset();
  }

  removeFromList(index: number) {
    this.fArray.removeAt(index);
  }

  displayOutDeliveryOption(outDelivery: any) {
    const companyName = outDelivery._customerId.name ?? '';
    const contactPerson = outDelivery._customerId.contactPerson ?? '';

    const cleanString = (str: string) => {
      return str.trim().toLowerCase();
    };

    if (cleanString(companyName) === cleanString(contactPerson)) {
      return companyName;
    } else {
      return `${companyName} (${contactPerson})`;
    }
  }

  submitChanges() {
    const body = this._formatBodyRequest();
    this.confirmation
      .open(
        'Are you sure?',
        'Do you want to add these delivery receipts in this PO?',
      )
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() => {
          this.snackbar.openLoadingSnackbar(
            'Updating Purchase Order',
            'Please wait...',
          );
          return this.purchaseOrderApi.patchAddPurchaseOrderOutDeliveriesById(
            this.data.purchaseOrderId,
            body,
          );
        }),
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.snackbar.closeLoadingSnackbar();
            this.snackbar.openSuccessSnackbar(
              'Update Success!',
              'Addition of Outdeliveries has been successful',
            );

            this.dialogRef.close(true);
          }
        },
        error: ({ error }: HttpErrorResponse) => {
          console.error(error);
          this.snackbar.openErrorSnackbar(error.errorCode, error.message);
        },
      });
  }

  private _formatBodyRequest() {
    console.log(this.fArray.getRawValue());

    return this.fArray.getRawValue().reduce((acc: any, item: OutDelivery) => {
      acc.push({
        _outDeliveryId: item._id,
        status: item.status,
        code: item.code,
      });
      return acc;
    }, []);
  }

  private _fetchOutDeliveries(text: string) {
    return this.outDeliveryApi
      .getOutDeliverys({
        searchText: text,
        pageSize: 10,
        hasPurchaseOrder: false,
        status: OutDeliveryStatus.PENDING,
      })
      .pipe(map((response: any) => response.records as OutDelivery[]));
  }
}
