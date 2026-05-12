import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TransactionStatus } from '../../../../core/enums/transaction/transaction-status';
import { BlockService } from '../../../../core/services/block/block.service';
import { BlockDetailPage } from './block-detail-page';

describe('BlockDetailPage', () => {
  let fixture: ComponentFixture<BlockDetailPage>;
  const blockService = {
    transactions: vi.fn(),
  };

  beforeEach(async () => {
    blockService.transactions.mockReturnValue(of(blockTransactions()));

    await TestBed.configureTestingModule({
      imports: [BlockDetailPage],
      providers: [
        provideRouter([]),
        { provide: BlockService, useValue: blockService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: 'block-1' }) } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlockDetailPage);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create and render block details', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(fixture.componentInstance).toBeTruthy();
    expect(element.textContent).toContain('Bloco #1');
    expect(element.textContent).toContain('Arquivo de faturamento recebido');
    expect(blockService.transactions).toHaveBeenCalledWith('block-1', 0, 50);
  });

  it('should render error state', async () => {
    blockService.transactions.mockReturnValue(throwError(() => new Error('failed')));
    const errorFixture = TestBed.createComponent(BlockDetailPage);
    errorFixture.detectChanges();
    await errorFixture.whenStable();

    expect((errorFixture.nativeElement as HTMLElement).textContent).toContain('Não foi possível carregar o bloco');
  });
});

function blockTransactions() {
  return {
    block: {
      id: 'block-1',
      index: 1,
      hash: 'hash-1',
      previousHash: 'hash-0',
      merkleRoot: 'root',
      nonce: 42,
      difficulty: 3,
      createdAt: '2026-05-11T10:00:00Z',
      minedAt: '2026-05-11T10:01:00Z',
      transactionsCount: 1,
    },
    transactions: {
      content: [
        {
          id: 'tx-1',
          hash: 'tx-hash',
          type: 'BILLING_FILE_RECEIVED',
          payload: {},
          publicKey: 'public',
          signature: 'signature',
          status: TransactionStatus.MINED,
          nonce: 'nonce',
          createdAt: '2026-05-11T10:00:00Z',
          minedAt: '2026-05-11T10:01:00Z',
          blockId: 'block-1',
          blockTransactionIndex: 0,
        },
      ],
      page: 0,
      size: 50,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true,
    },
  };
}
