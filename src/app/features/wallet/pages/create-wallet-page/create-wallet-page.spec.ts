import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { WalletService } from '../../../../core/services/wallet/wallet.service';
import { WalletVaultService } from '../../../../core/services/wallet-vault/wallet-vault.service';
import { CreateWalletPage } from './create-wallet-page';

describe('CreateWalletPage', () => {
  let component: CreateWalletPage;
  let fixture: ComponentFixture<CreateWalletPage>;
  const walletService = {
    create: vi.fn(),
  };
  const walletVaultService = {
    save: vi.fn(),
  };

  beforeEach(async () => {
    walletService.create.mockReturnValue(
      of({
        id: 'wallet-1',
        ownerName: 'Audit Team',
        address: 'AX-1',
        publicKey: 'public',
        privateKey: 'private',
        createdAt: '2026-05-11T10:00:00Z',
      }),
    );
    walletVaultService.save.mockResolvedValue({});

    await TestBed.configureTestingModule({
      imports: [CreateWalletPage],
      providers: [
        { provide: WalletService, useValue: walletService },
        { provide: WalletVaultService, useValue: walletVaultService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateWalletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the wallet creation form', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Criar carteira');
    expect(element.querySelector('input[type="text"]')).toBeTruthy();
    expect(element.querySelector('button')?.textContent).toContain('Criar carteira');
  });
});
