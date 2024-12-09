import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListFilterComponent } from './list-filter.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SelectInputModule } from '../select-input/select-input.module';
import { CdkListboxModule } from '@angular/cdk/listbox';

@NgModule({
  declarations: [ListFilterComponent],
  exports: [ListFilterComponent],
  imports: [
    CommonModule,
    SelectInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CdkListboxModule,
  ],
})
export class ListFilterModule {}
