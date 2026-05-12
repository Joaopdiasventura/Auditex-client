import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WalletService } from './wallet.service';

describe('WalletService', () => {
  let service: WalletService;
  let http: HttpTestingController;

  beforeEach(() => {
    (globalThis as typeof globalThis & { API_URL: string }).API_URL = 'http://localhost:8080';

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(WalletService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a wallet', () => {
    service.create({ ownerName: 'Audit Team' }).subscribe((wallet) => {
      expect(wallet.address).toBe('AX-1');
      expect(wallet.ownerName).toBe('Audit Team');
    });

    const request = http.expectOne('http://localhost:8080/wallet');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ ownerName: 'Audit Team' });
    request.flush({
      id: 'wallet-1',
      ownerName: 'Audit Team',
      address: 'AX-1',
      publicKey: 'public',
      privateKey: 'private',
      createdAt: '2026-05-11T10:00:00Z',
    });
  });
});
