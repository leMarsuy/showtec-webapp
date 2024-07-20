import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { TableComponent } from './table.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DeepFindPipe } from '@app/shared/pipes/deep-find/deep-find.pipe';
import { AgingPipe } from '@app/shared/pipes/aging/aging.pipe';

@NgModule({
  declarations: [TableComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    DeepFindPipe,
    AgingPipe,
  ],
  exports: [TableComponent],
})
export class TableModule {}
