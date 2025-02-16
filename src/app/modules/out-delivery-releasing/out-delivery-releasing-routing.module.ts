import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  outDeliveryReleasingAuthGuard,
  outDeliveryReleasingPortalGuard,
} from './out-delivery-releasing.guard';
import { OutDeliveryReleasingService } from './out-delivery-releasing.service';

const routes: Routes = [
  {
    path: 'auth',
    canActivate: [outDeliveryReleasingAuthGuard],
    loadChildren: () =>
      import('./auth-login/auth-login.module').then((m) => m.AuthLoginModule),
  },
  {
    path: 'portal',
    canActivate: [outDeliveryReleasingPortalGuard],
    providers: [OutDeliveryReleasingService],
    loadChildren: () =>
      import('./portal/portal.module').then((m) => m.PortalModule),
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OutDeliveryReleasingRoutingModule {}
