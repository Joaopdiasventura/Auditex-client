import { TestBed } from '@angular/core/testing';

import { WalletVaultService } from './wallet-vault.service';

describe('WalletVaultService', () => {
  let service: WalletVaultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletVaultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
