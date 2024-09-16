import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';

import { UpsertVoucherRoutingModule } from './upsert-voucher-routing.module';
import { UpsertVoucherComponent } from './upsert-voucher.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AccountsArrayFormComponent } from './components/accounts-array-form/accounts-array-form.component';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TableModule } from '@app/shared/components/table/table.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [UpsertVoucherComponent, AccountsArrayFormComponent],
  imports: [
    CommonModule,
    UpsertVoucherRoutingModule,
    TableModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatButtonModule,
    AsyncPipe,
  ],
  exports: [UpsertVoucherComponent],
})
export class UpsertVoucherModule {}
