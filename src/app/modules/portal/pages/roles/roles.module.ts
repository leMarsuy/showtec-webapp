import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ContentHeaderModule } from '@app/shared/components/content-header/content-header.module';
import { UpsertRoleModule } from './pages/upsert-role/upsert-role.module';
import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { RolesService } from './roles.service';

@NgModule({
  declarations: [RolesComponent],
  imports: [
    CommonModule,
    RolesRoutingModule,
    ContentHeaderModule,
    UpsertRoleModule,
  ],
  providers: [RolesService],
})
export class RolesModule {}
