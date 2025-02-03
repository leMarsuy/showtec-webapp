import { CommonModule, KeyValuePipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { CdkAccordionModule } from '@angular/cdk/accordion';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RoleAccordionComponent } from './role-accordion/role-accordion.component';
import { UpsertRoleRoutingModule } from './upsert-role-routing.module';
import { UpsertRoleComponent } from './upsert-role.component';

@NgModule({
  declarations: [UpsertRoleComponent, RoleAccordionComponent],
  exports: [UpsertRoleComponent],
  imports: [
    CommonModule,
    UpsertRoleRoutingModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatInputModule,
    MatIconModule,
    CdkAccordionModule,
    ReactiveFormsModule,
    KeyValuePipe,
  ],
})
export class UpsertRoleModule {}
