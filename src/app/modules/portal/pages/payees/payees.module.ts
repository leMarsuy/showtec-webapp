import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayeesRoutingModule } from './payees-routing.module';
import { PayeesComponent } from './payees.component';
import { ContentHeaderModule } from '@app/shared/components/content-header/content-header.module';
import { UpsertPayeeComponent } from './components/upsert-payee/upsert-payee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableModule } from '@app/shared/components/table/table.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [PayeesComponent, UpsertPayeeComponent],
  imports: [
    CommonModule,
    PayeesRoutingModule,
    ContentHeaderModule,
    TableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [PayeesComponent],
})
export class PayeesModule {}
