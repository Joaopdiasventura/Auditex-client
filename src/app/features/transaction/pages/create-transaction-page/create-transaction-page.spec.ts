import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { TransactionService } from '../../../../core/services/transaction/transaction.service';
import { WalletVaultService } from '../../../../core/services/wallet-vault/wallet-vault.service';
import { SignatureService } from '../../../../shared/services/signature/signature.service';
import { CreateTransactionPage } from './create-transaction-page';

describe('CreateTransactionPage', () => {
  let component: CreateTransactionPage;
  let fixture: ComponentFixture<CreateTransactionPage>;
  const walletVaultService = {
    list: vi.fn(),
    decryptPrivateKey: vi.fn(),
  };
  const signatureService = {
    sign: vi.fn(),
  };
  const transactionService = {
    create: vi.fn(),
  };

  beforeEach(async () => {
    walletVaultService.list.mockResolvedValue([]);
    walletVaultService.decryptPrivateKey.mockResolvedValue('private-key');
    signatureService.sign.mockResolvedValue('signature');
    transactionService.create.mockReturnValue(of({ hash: 'tx-hash' }));

    await TestBed.configureTestingModule({
      imports: [CreateTransactionPage],
      providers: [
        provideRouter([]),
        { provide: WalletVaultService, useValue: walletVaultService },
        { provide: SignatureService, useValue: signatureService },
        { provide: TransactionService, useValue: transactionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTransactionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the empty wallet state', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Registrar evidência auditável de processamento');
    expect(element.textContent).toContain('Nenhuma carteira local encontrada');
  });
});
