import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TransactionStatus } from '../../../../core/enums/transaction/transaction-status';
import { TransactionService } from '../../../../core/services/transaction/transaction.service';
import { TransactionDetailPage } from './transaction-detail-page';

describe('TransactionDetailPage', () => {
  let fixture: ComponentFixture<TransactionDetailPage>;
  const transactionService = {
    findByHash: vi.fn(),
  };

  beforeEach(async () => {
    transactionService.findByHash.mockReturnValue(of(transactionResponse()));

    await TestBed.configureTestingModule({
      imports: [TransactionDetailPage],
      providers: [
        provideRouter([]),
        { provide: TransactionService, useValue: transactionService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ hash: 'tx-hash' }) } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionDetailPage);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create and render transaction detail', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(fixture.componentInstance).toBeTruthy();
    expect(element.textContent).toContain('Arquivo de faturamento recebido');
    expect(element.textContent).toContain('Minerada');
    expect(element.textContent).toContain('"amount": 10');
    expect(transactionService.findByHash).toHaveBeenCalledWith('tx-hash');
  });

  it('should render error state', async () => {
    transactionService.findByHash.mockReturnValue(throwError(() => new Error('failed')));
    const errorFixture = TestBed.createComponent(TransactionDetailPage);
    errorFixture.detectChanges();
    await errorFixture.whenStable();

    expect((errorFixture.nativeElement as HTMLElement).textContent).toContain('Não foi possível carregar a transação');
  });
});

function transactionResponse() {
  return {
    id: 'tx-1',
    hash: 'tx-hash',
    type: 'BILLING_FILE_RECEIVED',
    payload: { amount: 10 },
    publicKey: 'public',
    signature: 'signature',
    status: TransactionStatus.MINED,
    nonce: 'nonce',
    createdAt: '2026-05-11T10:00:00Z',
    minedAt: '2026-05-11T10:01:00Z',
    blockId: 'block-1',
    blockTransactionIndex: 0,
  };
}
