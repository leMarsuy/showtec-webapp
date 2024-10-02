import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VouchersListComponent } from './vouchers-list.component';
import { VouchersListRoutingModule } from './vouchers-list-routing.module';
import { TableModule } from '@app/shared/components/table/table.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [VouchersListComponent],
  imports: [
    CommonModule,
    VouchersListRoutingModule,
    TableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [VouchersListComponent],
})
export class VouchersListModule {}
