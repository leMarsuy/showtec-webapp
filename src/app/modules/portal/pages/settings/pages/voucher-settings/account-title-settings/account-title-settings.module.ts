import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountTitleSettingsComponent } from './account-title-settings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UpsertTitleComponent } from './upsert-title/upsert-title.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [AccountTitleSettingsComponent, UpsertTitleComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  exports: [AccountTitleSettingsComponent],
})
export class AccountTitleSettingsModule {}
