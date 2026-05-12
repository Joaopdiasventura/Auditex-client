import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LedgerService } from './ledger.service';

describe('LedgerService', () => {
  let service: LedgerService;
  let http: HttpTestingController;

  beforeEach(() => {
    (globalThis as typeof globalThis & { API_URL: string }).API_URL = 'http://localhost:8080';

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(LedgerService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request ledger status', () => {
    service.status().subscribe((status) => {
      expect(status.valid).toBe(true);
      expect(status.blocksCount).toBe(3);
    });

    const request = http.expectOne('http://localhost:8080/ledger/status');
    expect(request.request.method).toBe('GET');
    request.flush({
      valid: true,
      blocksCount: 3,
      minedTransactions: 7,
      pendingTransactions: 1,
      latestBlockIndex: 3,
      latestBlockHash: 'hash',
      lastMinedAt: '2026-05-11T10:00:00Z',
    });
  });

  it('should request ledger validation', () => {
    service.validate().subscribe((validation) => {
      expect(validation.valid).toBe(false);
      expect(validation.reason).toBe('broken hash');
    });

    const request = http.expectOne('http://localhost:8080/ledger/validate');
    expect(request.request.method).toBe('GET');
    request.flush({
      valid: false,
      reason: 'broken hash',
      blocksChecked: 4,
      transactionsChecked: 10,
      brokenAtBlock: 'block-2',
      brokenAtTransaction: 'tx-1',
    });
  });
});
