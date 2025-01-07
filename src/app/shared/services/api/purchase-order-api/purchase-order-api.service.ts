import { Injectable } from '@angular/core';
import { QueryParams } from '@app/core/interfaces/query-params.interface';
import { PurchaseOrder } from '@app/core/models/purchase-order.model';
import { Transaction } from '@app/core/models/soa.model';
import { environment } from '@env/environment';
import { map } from 'rxjs';
import { FileService } from '../../file/file.service';
import { HttpService } from '../../http/http.service';
import { UtilService } from '../../util/util.service';

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderApiService {
  apiUrl = environment.API_URL;
  apiPrefix = 'purchase-orders';

  constructor(
    private httpService: HttpService,
    private file: FileService,
    private utilService: UtilService,
  ) {}

  createPurchaseOrder(purchaseOrder: PurchaseOrder) {
    return this.httpService.post(`${this.apiPrefix}`, purchaseOrder);
  }

  createPayment(_id: string, transaction: Transaction) {
    return this.httpService.post(
      `${this.apiPrefix}/payment/${_id}`,
      transaction,
    );
  }

  deletePayment(_transId: string) {
    return this.httpService.delete(`${this.apiPrefix}/payment/${_transId}`);
  }

  updatePayment(_transId: string, body: any) {
    return this.httpService.patch(
      `${this.apiPrefix}/payment/${_transId}`,
      body,
    );
  }

  getPurchaseOrders(query?: QueryParams & { hasSoa?: any }) {
    let sanitizedQuery: any = {};
    if (query) {
      sanitizedQuery = {
        pageIndex: query.pageIndex ?? 0,
        pageSize: query.pageSize ?? 0,
        sort: query.sort ?? '',
        searchText: query.searchText ?? '',
        monitorStatus: query.status ?? '', // monitorStatus is used
      };

      if (query.hasSoa) {
        sanitizedQuery = { hasSoa: query.hasSoa };
      }

      if (query?.date) {
        const date = this.utilService.date.dateToQueryParam(query?.date);
        sanitizedQuery = { ...sanitizedQuery, date };
      }
    }
    return this.httpService.get(`${this.apiPrefix}`, sanitizedQuery);
  }

  getPurchaseOrderById(_id: string) {
    return this.httpService.get(`${this.apiPrefix}/${_id}`);
  }

  updatePurchaseOrderById(_id: string, updateBody: PurchaseOrder) {
    return this.httpService.patch(`${this.apiPrefix}/${_id}`, updateBody);
  }

  getPdfPurchaseOrder(_id: string) {
    return this.httpService.getBlob(`${this.apiPrefix}/pdf/${_id}`).pipe(
      map((response: any) => {
        const filename = this.file.getFileNameFromResponseHeader(response);
        return {
          blob: response.body,
          filename,
        };
      }),
    );
  }

  getMostRecentPurchaseOrder() {
    return this.httpService.get(`${this.apiPrefix}/recent`);
  }

  exportExcelPurchaseOrder(query?: QueryParams) {
    let sanitizedQuery: QueryParams = {};
    if (query) {
      sanitizedQuery = {
        pageIndex: 0,
        pageSize: 0,
        searchText: query.searchText || '',
      };
    }
    return this.httpService.getBlob(
      `${this.apiPrefix}/export/excel`,
      sanitizedQuery,
    );
  }

  patchAddPurchaseOrderOutDeliveriesById(
    purchaseOrderId: string,
    outDeliveries: any,
  ) {
    return this.httpService.patch(
      `${this.apiPrefix}/${purchaseOrderId}/out-deliveries`,
      { outDeliveries },
    );
  }

  getPurchaseOrderPdfReceipt(_id: string) {
    return this.httpService.getBlob(`${this.apiPrefix}/pdf/${_id}`).pipe(
      map((response: any) => {
        const filename = this.file.getFileNameFromResponseHeader(response);
        return {
          blob: response.body,
          filename,
        };
      }),
    );
  }
}
