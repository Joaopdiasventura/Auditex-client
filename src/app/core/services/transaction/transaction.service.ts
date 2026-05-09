import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Transaction } from '../../models/transaction/transaction';
import { Observable } from 'rxjs';

declare const API_URL: string;

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly apiUrl = API_URL + '/transaction';
  private readonly http = inject(HttpClient);

  public create(createTransactionDto: CreateTransactionDto): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, createTransactionDto);
  }
}
