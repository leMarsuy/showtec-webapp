import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountsFormComponent } from './discounts-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TableModule } from '@app/shared/components/table/table.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  declarations: [DiscountsFormComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TableModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
  ],
  exports: [DiscountsFormComponent],
})
export class DiscountsFormModule {}
