import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersListRoutingModule } from './users-list-routing.module';
import { UsersListComponent } from './users-list.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from '@app/shared/components/table/table.module';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

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
  ],
})
export class UsersListModule {}
