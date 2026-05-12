import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WalletVaultService } from '../../../../core/services/wallet-vault/wallet-vault.service';
import { ImportWalletPage } from './import-wallet-page';

describe('ImportWalletPage', () => {
  let component: ImportWalletPage;
  let fixture: ComponentFixture<ImportWalletPage>;
  const walletVaultService = {
    saveImported: vi.fn(),
  };

  beforeEach(async () => {
    walletVaultService.saveImported.mockResolvedValue({});

    await TestBed.configureTestingModule({
      imports: [ImportWalletPage],
      providers: [{ provide: WalletVaultService, useValue: walletVaultService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportWalletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render import fields and submit action', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Importar carteira');
    expect(element.querySelectorAll('input').length).toBeGreaterThanOrEqual(4);
    expect(element.querySelectorAll('textarea').length).toBe(2);
  });
});
