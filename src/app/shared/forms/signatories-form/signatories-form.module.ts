import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignatoriesFormComponent } from './signatories-form.component';
import { TableModule } from '@app/shared/components/table/table.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  declarations: [SignatoriesFormComponent],
  imports: [
    CommonModule,
    TableModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    NgxSkeletonLoaderModule,
  ],
  exports: [SignatoriesFormComponent],
})
export class SignatoriesFormModule {}
