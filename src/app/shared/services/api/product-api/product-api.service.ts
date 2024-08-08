import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { enviroment } from '../../../../../environments/environment';
import { QueryParams } from '@core/interfaces/query-params.interface';
import { Product } from '@core/models/product.model';
import { Stock } from '@core/models/stock.model';

@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  apiUrl = enviroment.API_URL;
  apiPrefix = 'products';
  constructor(private httpService: HttpService) {}

  createProduct(product: Product) {
    return this.httpService.post(`${this.apiPrefix}`, product);
  }

  createProductByBatch(products: Product[]) {
    return this.httpService.post(`${this.apiPrefix}/batch`, products);
  }

  getProducts(query?: QueryParams & { searchField?: string }) {
    var sanitizedQuery: QueryParams & { searchField?: string } = {};
    if (query)
      sanitizedQuery = {
        pageIndex: query.pageIndex || 0,
        pageSize: query.pageSize || 0,
        sort: query.sort || '',
        searchText: query.searchText || '',
        searchField: query.searchField || '',
      };

    console.log(sanitizedQuery);
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
        stocks
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
}
