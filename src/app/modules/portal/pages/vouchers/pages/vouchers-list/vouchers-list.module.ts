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
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChangeStatusModalModule } from './components/change-status-modal/change-status-modal.module';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { DateRangeFilterComponent } from './components/date-range-filter/date-range-filter.component';

@NgModule({
  declarations: [VouchersListComponent, DateRangeFilterComponent],
  imports: [
    CommonModule,
    VouchersListRoutingModule,
    TableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatDividerModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    ChangeStatusModalModule,
    MatMenuModule,
  ],
  exports: [VouchersListComponent],
})
export class VouchersListModule {}
