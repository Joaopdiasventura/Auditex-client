import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LedgerService } from '../../../../core/services/ledger/ledger.service';
import { DashboardPage } from './dashboard-page';

describe('DashboardPage', () => {
  let fixture: ComponentFixture<DashboardPage>;
  const ledgerService = {
    status: vi.fn(),
    validate: vi.fn(),
  };

  beforeEach(async () => {
    ledgerService.status.mockReturnValue(
      of({
        valid: true,
        blocksCount: 4,
        minedTransactions: 10,
        pendingTransactions: 2,
        latestBlockIndex: 4,
        latestBlockHash: 'abcdef1234567890abcdef',
        lastMinedAt: '2026-05-11T10:00:00Z',
      }),
    );
    ledgerService.validate.mockReturnValue(
      of({
        valid: true,
        blocksChecked: 4,
        transactionsChecked: 10,
        brokenAtBlock: null,
        brokenAtTransaction: null,
        reason: null,
      }),
    );

    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [provideRouter([]), { provide: LedgerService, useValue: ledgerService }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create and render ledger status', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(fixture.componentInstance).toBeTruthy();
    expect(element.textContent).toContain('Audit and integrity overview');
    expect(element.textContent).toContain('Validated');
    expect(element.textContent).toContain('10');
  });

  it('should render validation result after action', () => {
    const button = (fixture.nativeElement as HTMLElement).querySelector('button');
    button?.click();
    fixture.detectChanges();

    expect(ledgerService.validate).toHaveBeenCalled();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Chain is valid');
  });

  it('should render loading fallback when status is unavailable', async () => {
    ledgerService.status.mockReturnValue(throwError(() => new Error('failed')));
    const errorFixture = TestBed.createComponent(DashboardPage);
    errorFixture.detectChanges();
    await errorFixture.whenStable();

    expect((errorFixture.nativeElement as HTMLElement).textContent).toContain('Unable to load ledger status');
  });
});
