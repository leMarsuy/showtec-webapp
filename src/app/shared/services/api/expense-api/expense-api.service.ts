import { Injectable } from '@angular/core';
import { QueryParams } from '@app/core/interfaces/query-params.interface';
import { Expense } from '@app/core/models/expense.model';
import { enviroment } from '@env/environment';
import { HttpService } from '../../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseApiService {
  apiUrl = enviroment.API_URL;
  apiPrefix = 'expenses';
  constructor(private httpService: HttpService) {}

  createExpense(expense: Expense) {
    return this.httpService.post(`${this.apiPrefix}`, expense);
  }

  getExpenses(query?: QueryParams, status?: string) {
    status = status || '';
    var sanitizedQuery: QueryParams = {};
    if (query) {
      sanitizedQuery = {
        pageIndex: query.pageIndex || 0,
        pageSize: query.pageSize || 0,
        sort: query.sort || '',
        searchText: query.searchText || '',
      };
    }

    return this.httpService.get(`${this.apiPrefix}`, {
      ...sanitizedQuery,
      status,
    });
  }

  getExpenseById(_id: string) {
    return this.httpService.get(`${this.apiPrefix}/${_id}`);
  }

  updateExpenseById(_id: string, updateBody: Expense) {
    return this.httpService.patch(`${this.apiPrefix}/${_id}`, updateBody);
  }
}
