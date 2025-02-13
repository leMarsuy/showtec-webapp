import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth-login/auth-login.module').then((m) => m.AuthLoginModule),
  },
  {
    path: 'portal',
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
