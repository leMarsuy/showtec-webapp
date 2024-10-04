import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/shared/services/api';
import { SnackbarService } from '@shared/components/snackbar/snackbar.service';
import { catchError, map, of } from 'rxjs';

export const resetPasswordGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const snackbarService = inject(SnackbarService);

  const token = route.paramMap.get('token');
  if (!token) {
    router.navigate(['auth', 'login']);
    return of(false);
  }

  return authService.verifyResetPasswordToken(token).pipe(
    map((response) => response.found),
    catchError((e) => {
      snackbarService.openErrorSnackbar(e.error.message);
      router.navigate(['auth', 'login']);
      return of(false);
    })
  );
};
