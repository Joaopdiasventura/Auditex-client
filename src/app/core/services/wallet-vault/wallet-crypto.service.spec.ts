import { TestBed } from '@angular/core/testing';

import { WalletCryptoService } from './wallet-crypto.service';

describe('WalletCryptoService', () => {
  let service: WalletCryptoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletCryptoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
