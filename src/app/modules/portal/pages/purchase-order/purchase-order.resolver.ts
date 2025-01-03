import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { PurchaseOrderApiService } from '@app/shared/services/api/purchase-order-api/purchase-order-api.service';
import { catchError, of } from 'rxjs';

export const purchaseOrderResolver = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const router = inject(Router);
  const purchaseOrderApi = inject(PurchaseOrderApiService);
  const purchaseOrderId = route.paramMap.get('id');

  if (!purchaseOrderId) {
    router.navigate(['portal/purchase-order/list']);
    return null;
  }

  return purchaseOrderApi.getPurchaseOrderById(purchaseOrderId).pipe(
    catchError((error) => {
      console.error(error);
      router.navigate(['portal/purchase-order/list']);
      return of('PO not found');
    }),
  );
};
