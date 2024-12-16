import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'portal',
    loadChildren: () =>
      import('./modules/portal/portal.module').then((m) => m.PortalModule),
  },
  {
    path: 'customer-registration',
    loadChildren: () =>
      import(
        './modules/customer-registration/customer-registration.module'
      ).then((m) => m.CustomerRegistrationModule),
  },
  {
    path: 'stock-checker',
    loadChildren: () =>
      import('./modules/stock-checker/stock-checker.module').then(
        (m) => m.StockCheckerModule
      ),
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
