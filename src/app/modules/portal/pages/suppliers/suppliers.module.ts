import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuppliersRoutingModule } from './suppliers-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { SuppliersComponent } from './suppliers.component';
import { MatButtonModule } from '@angular/material/button';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';
import { EditSupplierComponent } from './edit-supplier/edit-supplier.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ContentHeaderModule } from '@shared/components/content-header/content-header.module';
import { TableModule } from '@shared/components/table/table.module';

@NgModule({
  declarations: [
    SuppliersComponent,
    AddSupplierComponent,
    EditSupplierComponent,
  ],
  imports: [
    CommonModule,
    SuppliersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    // custom
    ContentHeaderModule,
    TableModule,
  ],
})
export class SuppliersModule {}
