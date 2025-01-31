import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AddNewCustomerModule } from '@app/modules/portal/pages/purchase-order/add-new-customer/add-new-customer.module';
import { TableModule } from '@app/shared/components/table/table.module';
import { TypeOfPipe } from '@app/shared/pipes/type-of/type-of.pipe';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AttachCustomerFormComponent } from './attach-customer-form.component';
import { SkeletonLoadingComponent } from './skeleton-loading/skeleton-loading.component';

@NgModule({
  declarations: [AttachCustomerFormComponent, SkeletonLoadingComponent],
  imports: [
    CommonModule,
    TableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    NgxSkeletonLoaderModule,
    AddNewCustomerModule,
    TypeOfPipe,
  ],
  exports: [AttachCustomerFormComponent],
})
export class AttachCustomerFormModule {}
