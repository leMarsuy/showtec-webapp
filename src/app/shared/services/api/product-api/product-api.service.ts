import { Injectable } from '@angular/core';
import { QueryParams } from '@core/interfaces/query-params.interface';
import { Product } from '@core/models/product.model';
import { Stock } from '@core/models/stock.model';
import { environment } from '../../../../../environments/environment';
import { HttpService } from '../../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  apiUrl = environment.API_URL;
  apiPrefix = 'products';
  constructor(private httpService: HttpService) {}

  createProduct(product: Product) {
    return this.httpService.post(`${this.apiPrefix}`, product);
  }

  createProductByBatch(products: Product[]) {
    return this.httpService.post(`${this.apiPrefix}/batch`, products);
  }

  getProducts(query?: QueryParams) {
    var sanitizedQuery: QueryParams = {};
    if (query) {
      sanitizedQuery = {
        pageIndex: query.pageIndex || 0,
        pageSize: query.pageSize || 0,
        sort: query.sort || '',
        searchText: query.searchText || '',
      };

      if (query['_warehouseId']) {
        sanitizedQuery['_warehouseId'] = query['_warehouseId'];
      }
    }

    return this.httpService.get(`${this.apiPrefix}`, sanitizedQuery);
  }

  getAllStocks(query?: QueryParams) {
    return this.httpService.get(`${this.apiPrefix}/all-stocks`, query);
  }

  getProductById(_id: string) {
    return this.httpService.get(`${this.apiPrefix}/${_id}`);
  }

  updateProductById(_id: string, updateBody: Product) {
    return this.httpService.patch(`${this.apiPrefix}/${_id}`, updateBody);
  }

  getInStockProductBySerialNumber(sn: string) {
    return this.httpService.get(`${this.apiPrefix}/stock/serial-number/${sn}`);
  }

  stockToProduct(_id: string, stocks: Stock[], allowDuplicates: boolean) {
    if (allowDuplicates) {
      return this.httpService.post(
        `${this.apiPrefix}/stock-with-duplicate/${_id}`,
        stocks,
      );
    }
    return this.httpService.post(`${this.apiPrefix}/stock/${_id}`, stocks);
  }

  removeStockFromProduct(_stockId: string) {
    var _id = _stockId;
    return this.httpService.delete(`${this.apiPrefix}/stock/${_id}`);
  }

  updateStockById(_id: string, updateBody: Stock) {
    return this.httpService.patch(`${this.apiPrefix}/stock/${_id}`, updateBody);
  }

  exportExcelProducts(query?: QueryParams) {
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

  checkStockInOutDelivery(stockId: string) {
    const _id = stockId;
    return this.httpService.get(
      `${this.apiPrefix}/stock/${_id}/check-delivery-status`,
    );
  }

  exportExcelProductSerialNos(query?: QueryParams) {
    let sanitizedQuery: QueryParams = {};
    if (query) {
      sanitizedQuery = {
        pageIndex: 0,
        pageSize: 0,
        searchText: query.searchText || '',
      };
    }
    return this.httpService.getBlob(
      `${this.apiPrefix}/export/excel/serial-number`,
      sanitizedQuery,
    );
  }
}
