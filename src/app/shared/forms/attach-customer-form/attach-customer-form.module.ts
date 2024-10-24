import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TableModule } from '@app/shared/components/table/table.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AttachCustomerFormComponent } from './attach-customer-form.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SkeletonLoadingComponent } from './skeleton-loading/skeleton-loading.component';

@NgModule({
  declarations: [AttachCustomerFormComponent, SkeletonLoadingComponent],
  imports: [
    CommonModule,
    TableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    NgxSkeletonLoaderModule,
  ],
  exports: [AttachCustomerFormComponent],
})
export class AttachCustomerFormModule {}
