import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleListRoutingModule } from './role-list-routing.module';
import { RoleListComponent } from './role-list.component';
import { TableModule } from '@app/shared/components/table/table.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DateFilterInputModule } from '@app/shared/components/date-filter-input/date-filter-input.module';

@NgModule({
  declarations: [RoleListComponent],
  imports: [
    CommonModule,
    RoleListRoutingModule,
    TableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatIconModule,
    ReactiveFormsModule,
    DateFilterInputModule,
  ],
})
export class RoleListModule {}
