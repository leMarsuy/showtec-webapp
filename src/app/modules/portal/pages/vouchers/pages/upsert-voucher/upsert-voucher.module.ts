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

@NgModule({
  declarations: [UpsertVoucherComponent, AccountsArrayFormComponent],
  imports: [
    CommonModule,
    UpsertVoucherRoutingModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    AsyncPipe,
  ],
  exports: [UpsertVoucherComponent],
})
export class UpsertVoucherModule {}
