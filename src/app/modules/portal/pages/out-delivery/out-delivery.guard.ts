import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { OutDeliveryStatus } from '@app/core/enums/out-delivery-status.enum';
import { OutDelivery } from '@app/core/models/out-delivery.model';
import { OutDeliveryApiService } from '@app/shared/services/api/out-delivery-api/out-delivery-api.service';
import { catchError, map, of } from 'rxjs';

export const editOutDeliveryGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const outDeliveryApi = inject(OutDeliveryApiService);
  const outDeliveryId = route.paramMap.get('_id');
  const router = inject(Router);

  const allowedStatus: any = [
    OutDeliveryStatus.ACTIVE,
    OutDeliveryStatus.PENDING,
  ];

  if (!outDeliveryId) {
    router.navigate(['portal/purchase-order/list']);
    return false;
  }

  return outDeliveryApi.getOutDeliveryById(outDeliveryId).pipe(
    map((response) => {
      const dr = response as OutDelivery;
      if (dr && allowedStatus.includes(dr.status)) {
        return true;
      } else {
        return false;
      }
    }),
    catchError(() => of(false)),
  );
};
