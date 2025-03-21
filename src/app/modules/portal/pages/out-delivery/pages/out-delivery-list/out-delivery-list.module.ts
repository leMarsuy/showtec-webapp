import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutDeliveryListRoutingModule } from './out-delivery-list-routing.module';
import { TableModule } from '@app/shared/components/table/table.module';
import { OutDeliveryListComponent } from './out-delivery-list.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CancelOutDeliveryComponent } from './cancel-out-delivery/cancel-out-delivery.component';
import { DeepFindPipe } from '@app/shared/pipes/deep-find/deep-find.pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { DateFilterInputModule } from '@app/shared/components/date-filter-input/date-filter-input.module';

@NgModule({
  declarations: [OutDeliveryListComponent, CancelOutDeliveryComponent],
  imports: [
    CommonModule,
    OutDeliveryListRoutingModule,
    TableModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    DeepFindPipe,
    DateFilterInputModule,
  ],
})
export class OutDeliveryListModule {}
