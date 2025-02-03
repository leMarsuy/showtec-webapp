import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeaderModule } from './components/header/header.module';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { PortalRoutingModule } from './portal-routing.module';
import { PortalComponent } from './portal.component';
import { PortalService } from './portal.service';

@NgModule({
  declarations: [PortalComponent, SidenavComponent],
  imports: [
    CommonModule,
    PortalRoutingModule,
    HeaderModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  providers: [PortalService],
})
export class PortalModule {}
