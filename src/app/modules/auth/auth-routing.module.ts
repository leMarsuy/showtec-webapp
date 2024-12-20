import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { resetPasswordGuard } from './pages/reset-password/reset-password.guard';
import { authGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadChildren: () =>
          import('./pages/login/login.module').then((m) => m.LoginModule),
      },
      {
        path: 'forgot-password',
        loadChildren: () =>
          import('./pages/forgot-password/forgot-password.module').then(
            (m) => m.ForgotPasswordModule,
          ),
      },
      {
        path: 'reset-password/:token',
        canActivate: [resetPasswordGuard],
        loadChildren: () =>
          import('./pages/reset-password/reset-password.module').then(
            (m) => m.ResetPasswordModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
