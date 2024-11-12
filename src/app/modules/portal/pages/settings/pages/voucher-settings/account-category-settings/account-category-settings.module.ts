import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountCategorySettingsComponent } from './account-category-settings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UpsertCategoryComponent } from './upsert-category/upsert-category.component';

@NgModule({
  declarations: [AccountCategorySettingsComponent, UpsertCategoryComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  exports: [AccountCategorySettingsComponent],
})
export class AccountCategorySettingsModule {}
