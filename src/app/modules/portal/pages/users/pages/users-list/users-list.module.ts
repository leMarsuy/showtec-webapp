import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TableModule } from '@app/shared/components/table/table.module';
import { UsersListRoutingModule } from './users-list-routing.module';
import { UsersListComponent } from './users-list.component';

@NgModule({
  declarations: [UsersListComponent],
  imports: [
    CommonModule,
    UsersListRoutingModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    MatIconModule,
    MatInputModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class UsersListModule {}
