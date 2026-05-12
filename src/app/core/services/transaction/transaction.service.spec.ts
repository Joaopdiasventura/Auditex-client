import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let http: HttpTestingController;

  beforeEach(() => {
    (globalThis as typeof globalThis & { API_URL: string }).API_URL = 'http://localhost:8080';

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TransactionService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request a paginated ledger', () => {
    service.page(2, 15).subscribe((response) => {
      expect(response.page).toBe(2);
      expect(response.size).toBe(15);
    });

    const request = http.expectOne((item) => item.url === 'http://localhost:8080/transaction');
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('size')).toBe('15');
    request.flush({ content: [], page: 2, size: 15, totalElements: 0, totalPages: 0, first: true, last: true });
  });

  it('should create a transaction', () => {
    const dto = {
      type: 'BILLING_FILE_RECEIVED',
      payload: { processingId: 'p-1' },
      publicKey: 'public-key',
      signature: 'signature',
      nonce: 'nonce',
    };

    service.create(dto).subscribe((transaction) => {
      expect(transaction.hash).toBe('hash-1');
    });

    const request = http.expectOne('http://localhost:8080/transaction');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(dto);
    request.flush({
      id: 'tx-1',
      hash: 'hash-1',
      type: dto.type,
      payload: dto.payload,
      publicKey: dto.publicKey,
      signature: dto.signature,
      status: 'PENDING',
      nonce: dto.nonce,
      createdAt: '2026-05-11T10:00:00Z',
      minedAt: null,
      blockId: null,
      blockTransactionIndex: null,
    });
  });

  it('should request filtered pages', () => {
    service.pageByType('BILLING_FILE_RECEIVED', 1, 5).subscribe();
    service.pageByProcessingId('proc/1', 0, 10).subscribe();
    service.pageByFileHash('hash/1', 3, 7).subscribe();
    service.pageByPublicKey('public-key', 4, 8).subscribe();

    const byType = http.expectOne('http://localhost:8080/transaction/type/BILLING_FILE_RECEIVED?page=1&size=5');
    byType.flush({ content: [], page: 1, size: 5, totalElements: 0, totalPages: 0, first: false, last: true });

    const byProcessing = http.expectOne('http://localhost:8080/transaction/processing/proc%2F1?page=0&size=10');
    byProcessing.flush({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, first: true, last: true });

    const byFile = http.expectOne('http://localhost:8080/transaction/file/hash%2F1?page=3&size=7');
    byFile.flush({ content: [], page: 3, size: 7, totalElements: 0, totalPages: 0, first: false, last: true });

    const byPublicKey = http.expectOne('http://localhost:8080/transaction/public-key?publicKey=public-key&page=4&size=8');
    byPublicKey.flush({ content: [], page: 4, size: 8, totalElements: 0, totalPages: 0, first: false, last: true });
  });

  it('should find a transaction by encoded hash', () => {
    service.findByHash('hash/1').subscribe((transaction) => {
      expect(transaction.id).toBe('tx-1');
    });

    const request = http.expectOne('http://localhost:8080/transaction/hash/hash%2F1');
    expect(request.request.method).toBe('GET');
    request.flush({
      id: 'tx-1',
      hash: 'hash/1',
      type: 'BILLING_FILE_RECEIVED',
      payload: {},
      publicKey: 'public',
      signature: 'signature',
      status: 'MINED',
      nonce: 'nonce',
      createdAt: '2026-05-11T10:00:00Z',
      minedAt: '2026-05-11T10:01:00Z',
      blockId: 'block-1',
      blockTransactionIndex: 0,
    });
  });
});
