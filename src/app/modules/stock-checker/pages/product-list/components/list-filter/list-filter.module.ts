import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ListFilterComponent } from './list-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CdkListboxModule } from '@angular/cdk/listbox';

@NgModule({
  declarations: [ListFilterComponent],
  exports: [ListFilterComponent],
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CdkListboxModule,
    AsyncPipe,
  ],
})
export class ListFilterModule {}
