import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SoaRoutingModule } from './soa-routing.module';
import { SoaComponent } from './soa.component';
import { ContentHeaderModule } from '@app/shared/components/content-header/content-header.module';
import { AddPaymentComponent } from './pages/add-payment/add-payment.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { TableModule } from '@app/shared/components/table/table.module';
import { ViewSoaComponent } from './pages/view-soa/view-soa.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { UpdatePaymentComponent } from './pages/update-payment/update-payment.component';

@NgModule({
  declarations: [
    SoaComponent,
    AddPaymentComponent,
    UpdatePaymentComponent,
    ViewSoaComponent,
  ],
  imports: [
    CommonModule,
    SoaRoutingModule,
    ContentHeaderModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTableModule,
  ],
})
export class SoaModule {}
