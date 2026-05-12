import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TransactionStatus } from '../../../../core/enums/transaction/transaction-status';
import { TransactionService } from '../../../../core/services/transaction/transaction.service';
import { LedgerPage } from './ledger-page';

describe('LedgerPage', () => {
  let fixture: ComponentFixture<LedgerPage>;
  const transactionService = {
    page: vi.fn(),
    pageByType: vi.fn(),
    pageByProcessingId: vi.fn(),
    pageByFileHash: vi.fn(),
  };

  beforeEach(async () => {
    transactionService.page.mockReturnValue(of(pageResponse()));
    transactionService.pageByType.mockReturnValue(of(pageResponse()));
    transactionService.pageByProcessingId.mockReturnValue(of(pageResponse()));
    transactionService.pageByFileHash.mockReturnValue(of(pageResponse()));

    await TestBed.configureTestingModule({
      imports: [LedgerPage],
      providers: [provideRouter([]), { provide: TransactionService, useValue: transactionService }],
    }).compileComponents();

    fixture = TestBed.createComponent(LedgerPage);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create and render transaction rows', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(fixture.componentInstance).toBeTruthy();
    expect(element.textContent).toContain('Auditable financial events');
    expect(element.textContent).toContain('Billing file received');
    expect(element.textContent).toContain('MINED');
  });

  it('should apply type filters', () => {
    const select = (fixture.nativeElement as HTMLElement).querySelector('select') as HTMLSelectElement;
    select.value = 'BILLING_FILE_RECEIVED';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector('button.primary-action') as HTMLButtonElement;
    button.click();

    expect(transactionService.pageByType).toHaveBeenCalledWith('BILLING_FILE_RECEIVED', 0, 20);
  });

  it('should render error state', async () => {
    transactionService.page.mockReturnValue(throwError(() => new Error('failed')));
    const errorFixture = TestBed.createComponent(LedgerPage);
    errorFixture.detectChanges();
    await errorFixture.whenStable();

    expect((errorFixture.nativeElement as HTMLElement).textContent).toContain('Unable to load financial ledger events');
  });
});

function pageResponse() {
  return {
    content: [
      {
        id: 'tx-1',
        hash: 'abcdef1234567890abcdef',
        type: 'BILLING_FILE_RECEIVED',
        payload: {},
        publicKey: 'public-key',
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
    size: 20,
    totalElements: 1,
    totalPages: 1,
    first: true,
    last: true,
  };
}
