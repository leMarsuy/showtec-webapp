import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { PORTAL_PATHS } from '@app/core/constants/nav-paths';
import { VoucherApiService } from '@app/shared/services/api/voucher-api/voucher-api.service';
import { catchError, of } from 'rxjs';

export const vouchersResolver = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const router = inject(Router);
  const voucherApi = inject(VoucherApiService);
  const voucherId = route.paramMap.get('id');

  const navigateFallback = () => {
    router.navigate([PORTAL_PATHS.vouchers.relativeUrl]);
  };

  if (!voucherId) {
    navigateFallback();
    return false;
  }

  return voucherApi.getVoucherById(voucherId).pipe(
    catchError(({ error }: HttpErrorResponse) => {
      console.error(error);
      navigateFallback();
      return of(false);
    }),
  );
};
