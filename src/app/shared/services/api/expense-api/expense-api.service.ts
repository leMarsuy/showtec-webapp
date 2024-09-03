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

  getExpenses(query?: QueryParams) {
    var sanitizedQuery: QueryParams = {};
    if (query)
      sanitizedQuery = {
        pageIndex: query.pageIndex,
        pageSize: query.pageSize,
        sort: query.sort,
        searchText: query.searchText,
      };
    return this.httpService.get(`${this.apiPrefix}`, sanitizedQuery);
  }

  getExpenseById(_id: string) {
    return this.httpService.get(`${this.apiPrefix}/${_id}`);
  }

  updateExpenseById(_id: string, updateBody: Expense) {
    return this.httpService.patch(`${this.apiPrefix}/${_id}`, updateBody);
  }
}
