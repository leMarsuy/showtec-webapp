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

@NgModule({
  declarations: [SoaComponent, AddPaymentComponent, ViewSoaComponent],
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
  ],
})
export class SoaModule {}
