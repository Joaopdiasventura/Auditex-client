import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateWalletDto } from '../../../features/wallet/dto/create-wallet-dto';
import { Observable } from 'rxjs';
import { ReturnWalletDto } from '../../../features/wallet/dto/return-wallet-dto';

declare const API_URL: string;

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private readonly apiUrl = API_URL + '/wallet';
  private readonly http = inject(HttpClient);

  public create(createWalletDto: CreateWalletDto): Observable<ReturnWalletDto> {
    return this.http.post<ReturnWalletDto>(this.apiUrl, createWalletDto);
  }
}
