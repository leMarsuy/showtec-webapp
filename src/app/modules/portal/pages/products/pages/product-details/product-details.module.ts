import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DeepFindPipe } from '@shared/pipes/deep-find/deep-find.pipe';
import { UpdateStockComponent } from './update-stock/update-stock.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TableModule } from '@shared/components/table/table.module';
import { ProductDetailsRoutingModule } from './product-details-routing.module';
import { ProductDetailsComponent } from './product-details.component';
import { EditStockComponent } from './edit-stock/edit-stock.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    ProductDetailsComponent,
    UpdateStockComponent,
    EditStockComponent,
  ],
  imports: [
    DeepFindPipe,
    CommonModule,
    ProductDetailsRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    TableModule,
    MatMenuModule,
  ],
})
export class ProductDetailsModule {}
