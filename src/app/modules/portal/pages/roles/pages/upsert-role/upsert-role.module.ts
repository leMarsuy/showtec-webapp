import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpsertRoleRoutingModule } from './upsert-role-routing.module';
import { UpsertRoleComponent } from './upsert-role.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [UpsertRoleComponent],
  exports: [UpsertRoleComponent],
  imports: [
    CommonModule,
    UpsertRoleRoutingModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    CdkAccordionModule,
    ReactiveFormsModule,
  ],
})
export class UpsertRoleModule {}
