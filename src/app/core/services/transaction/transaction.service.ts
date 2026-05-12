import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Transaction } from '../../models/transaction/transaction';
import { Observable } from 'rxjs';
import { PageResponse } from '../../models/page/page-response';
import { CreateTransactionDto } from '../../../features/transaction/dto/create-transaction-dto';

declare const API_URL: string;

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly apiUrl = API_URL + '/transaction';
  private readonly http = inject(HttpClient);

  public page(page = 0, size = 20): Observable<PageResponse<Transaction>> {
    return this.http.get<PageResponse<Transaction>>(this.apiUrl, {
      params: { page, size },
    });
  }

  public create(createTransactionDto: CreateTransactionDto): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, createTransactionDto);
  }

  public findByHash(hash: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/hash/${encodeURIComponent(hash)}`);
  }

  public pageByType(type: string, page = 0, size = 20): Observable<PageResponse<Transaction>> {
    return this.http.get<PageResponse<Transaction>>(`${this.apiUrl}/type/${encodeURIComponent(type)}`, {
      params: { page, size },
    });
  }

  public pageByProcessingId(
    processingId: string,
    page = 0,
    size = 20,
  ): Observable<PageResponse<Transaction>> {
    return this.http.get<PageResponse<Transaction>>(
      `${this.apiUrl}/processing/${encodeURIComponent(processingId)}`,
      {
        params: { page, size },
      },
    );
  }

  public pageByFileHash(fileHash: string, page = 0, size = 20): Observable<PageResponse<Transaction>> {
    return this.http.get<PageResponse<Transaction>>(`${this.apiUrl}/file/${encodeURIComponent(fileHash)}`, {
      params: { page, size },
    });
  }

  public pageByPublicKey(publicKey: string, page = 0, size = 20): Observable<PageResponse<Transaction>> {
    return this.http.get<PageResponse<Transaction>>(`${this.apiUrl}/public-key`, {
      params: { publicKey, page, size },
    });
  }
}
