import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Status, STATUS_TYPES } from '@app/core/enums/status.enum';

@Component({
  selector: 'app-vouchers-list',
  templateUrl: './vouchers-list.component.html',
  styleUrl: './vouchers-list.component.scss',
})
export class VouchersListComponent {
  placeholder = 'Search for Voucher No.';
  searchText: FormControl = new FormControl('');

  tableFilterStatuses = ['All', ...STATUS_TYPES];
  tableFilterStatus = 'All';

  vouchers: any = [];
  columns: any = [];

  page: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: -1,
  };

  constructor() {}

  onFilterStatusChange(status: Status | string) {
    this.tableFilterStatus = status;
    // this.getVouchers();
  }

  getVouchers() {}

  pageEvent(event: any) {}
}
// @for(status of tableFilterStatuses; track $index) {
//   <div
//     class="py-2 px-4 border-2 cursor-pointer rounded-3xl"
//     [ngClass]="{
//       'border-emerald-800 bg-emerald-100 text-emerald-800': tableFilterStatus === status,
//       'border-gray-500': tableFilterStatus !== status,
//     }"
//     (click)="onFilterStatusChange(status)"
//   >
//     {{ item }}
//   </div>
//   }
