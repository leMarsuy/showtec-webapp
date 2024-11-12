import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';

import { VoucherSettingsRoutingModule } from './voucher-settings-routing.module';
import { VoucherSettingsComponent } from './voucher-settings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { AccountCategorySettingsModule } from './account-category-settings/account-category-settings.module';
import { AccountTitleSettingsModule } from './account-title-settings/account-title-settings.module';

@NgModule({
  declarations: [VoucherSettingsComponent],
  imports: [
    CommonModule,
    VoucherSettingsRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    AsyncPipe,
    AccountCategorySettingsModule,
    AccountTitleSettingsModule,
  ],
  exports: [VoucherSettingsComponent],
})
export class VoucherSettingsModule {}
