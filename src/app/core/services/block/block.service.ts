import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Block } from '../../models/block/block';
import { BlockTransactions } from '../../models/block/block-transactions';
import { PageResponse } from '../../models/page/page-response';

declare const API_URL: string;

@Injectable({
  providedIn: 'root',
})
export class BlockService {
  private readonly apiUrl = API_URL + '/block';
  private readonly http = inject(HttpClient);

  public page(page = 0, size = 20): Observable<PageResponse<Block>> {
    return this.http.get<PageResponse<Block>>(this.apiUrl, {
      params: { page, size },
    });
  }

  public latest(): Observable<Block> {
    return this.http.get<Block>(`${this.apiUrl}/latest`);
  }

  public findById(id: string): Observable<Block> {
    return this.http.get<Block>(`${this.apiUrl}/id/${encodeURIComponent(id)}`);
  }

  public transactions(id: string, page = 0, size = 50): Observable<BlockTransactions> {
    return this.http.get<BlockTransactions>(`${this.apiUrl}/${encodeURIComponent(id)}/transaction`, {
      params: { page, size },
    });
  }
}
