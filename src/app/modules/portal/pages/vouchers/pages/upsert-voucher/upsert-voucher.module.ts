import { AsyncPipe, CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableModule } from '@app/shared/components/table/table.module';
import { SignatoriesFormModule } from '@app/shared/forms/signatories-form/signatories-form.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AccountsArrayFormComponent } from './components/accounts-array-form/accounts-array-form.component';
import { ParticularsArrayFormComponent } from './components/particulars-array-form/particulars-array-form.component';
import { SkeletonFormLoadingComponent } from './components/skeleton-form-loading/skeleton-form-loading.component';
import { SupplierAutocompleteComponent } from './components/supplier-autocomplete/supplier-autocomplete.component';
import { UpsertVoucherRoutingModule } from './upsert-voucher-routing.module';
import { UpsertVoucherComponent } from './upsert-voucher.component';

@NgModule({
  declarations: [
    UpsertVoucherComponent,
    AccountsArrayFormComponent,
    ParticularsArrayFormComponent,
    SkeletonFormLoadingComponent,
  ],
  imports: [
    CommonModule,
    UpsertVoucherRoutingModule,
    TableModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
    NgxSkeletonLoaderModule,
    AsyncPipe,
    SignatoriesFormModule,
    SupplierAutocompleteComponent,
  ],
  exports: [UpsertVoucherComponent],
})
export class UpsertVoucherModule {}
