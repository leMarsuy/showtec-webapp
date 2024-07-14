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

  getProducts(query: QueryParams & { searchField: string }) {
    return this.httpService.get(`${this.apiPrefix}`, query);
  }

  getProductById(_id: string) {
    return this.httpService.get(`${this.apiPrefix}/${_id}`);
  }

  updateProductById(_id: string, updateBody: Product) {
    return this.httpService.patch(`${this.apiPrefix}/${_id}`, updateBody);
  }

  stockToProduct(_id: string, stocks: Stock[]) {
    return this.httpService.patch(`${this.apiPrefix}/stock/${_id}`, stocks);
  }
}
