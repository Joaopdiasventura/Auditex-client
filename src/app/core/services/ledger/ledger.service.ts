import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LedgerStatus } from '../../models/ledger/ledger-status';
import { ValidateResponse } from '../../models/ledger/validate-response';

declare const API_URL: string;

@Injectable({
  providedIn: 'root',
})
export class LedgerService {
  private readonly apiUrl = API_URL + '/ledger';
  private readonly http = inject(HttpClient);

  public status(): Observable<LedgerStatus> {
    return this.http.get<LedgerStatus>(`${this.apiUrl}/status`);
  }

  public validate(): Observable<ValidateResponse> {
    return this.http.get<ValidateResponse>(`${this.apiUrl}/validate`);
  }
}
