import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BlockService } from './block.service';

describe('BlockService', () => {
  let service: BlockService;
  let http: HttpTestingController;

  beforeEach(() => {
    (globalThis as typeof globalThis & { API_URL: string }).API_URL = 'http://localhost:8080';

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(BlockService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request paginated blocks', () => {
    service.page(1, 12).subscribe((response) => {
      expect(response.page).toBe(1);
      expect(response.size).toBe(12);
    });

    const request = http.expectOne('http://localhost:8080/block?page=1&size=12');
    expect(request.request.method).toBe('GET');
    request.flush({ content: [], page: 1, size: 12, totalElements: 0, totalPages: 0, first: false, last: true });
  });

  it('should request latest block and block by encoded id', () => {
    service.latest().subscribe((block) => {
      expect(block.id).toBe('latest');
    });

    service.findById('block/1').subscribe((block) => {
      expect(block.id).toBe('block/1');
    });

    const latest = http.expectOne('http://localhost:8080/block/latest');
    expect(latest.request.method).toBe('GET');
    latest.flush(blockResponse('latest'));

    const byId = http.expectOne('http://localhost:8080/block/id/block%2F1');
    expect(byId.request.method).toBe('GET');
    byId.flush(blockResponse('block/1'));
  });

  it('should request block transactions with pagination', () => {
    service.transactions('block/1', 2, 25).subscribe((response) => {
      expect(response.block.id).toBe('block/1');
      expect(response.transactions.size).toBe(25);
    });

    const request = http.expectOne('http://localhost:8080/block/block%2F1/transaction?page=2&size=25');
    expect(request.request.method).toBe('GET');
    request.flush({
      block: blockResponse('block/1'),
      transactions: { content: [], page: 2, size: 25, totalElements: 0, totalPages: 0, first: false, last: true },
    });
  });
});

function blockResponse(id: string) {
  return {
    id,
    index: 1,
    hash: 'hash',
    previousHash: 'previous',
    merkleRoot: 'root',
    nonce: 10,
    difficulty: 3,
    createdAt: '2026-05-11T10:00:00Z',
    minedAt: '2026-05-11T10:01:00Z',
    transactionsCount: 0,
  };
}
