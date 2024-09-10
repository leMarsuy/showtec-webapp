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

@NgModule({
  declarations: [OutDeliveryListComponent],
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
    MatTooltipModule,
  ],
})
export class OutDeliveryListModule {}
