import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { TableComponent } from './table.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DeepFindPipe } from '@app/shared/pipes/deep-find/deep-find.pipe';
import { AgingPipe } from '@app/shared/pipes/aging/aging.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  exports: [TableComponent],
})
export class TableModule {}
