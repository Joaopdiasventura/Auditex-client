import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CreateWalletDto } from '../../dto/create-wallet-dto';
import { form, max, min } from '@angular/forms/signals';
import { WalletService } from '../../../../core/services/wallet/wallet.service';
import { ReturnWalletDto } from '../../dto/return-wallet-dto';
import { WalletVaultService } from '../../../../core/services/wallet-vault/wallet-vault.service';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { SectionCard } from '../../../../shared/components/section-card/section-card';

@Component({
  selector: 'app-create-wallet-page',
  imports: [PageHeader, SectionCard],
  templateUrl: './create-wallet-page.html',
  styleUrl: './create-wallet-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateWalletPage {
  protected readonly isLoading = signal(false);
  protected readonly createdWallet = signal<ReturnWalletDto | null>(null);
  protected readonly vaultSaved = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly createWalletDto = signal<CreateWalletDto>({
    ownerName: '',
  });

  protected readonly vaultPassword = signal('');
  protected readonly confirmVaultPassword = signal('');

  protected readonly createWalletForm = form(this.createWalletDto, (s) => {
    min(s.ownerName, 2, { message: 'Digite um nome com mais de dois caracteres' });
    max(s.ownerName, 120, { message: 'Digite um nome com menos de 120 caracteres' });
  });

  private readonly walletService = inject(WalletService);
  private readonly walletVaultService = inject(WalletVaultService);

  protected submit(): void {
    if (!this.createWalletForm().valid()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.walletService.create(this.createWalletDto()).subscribe({
      next: (result) => {
        this.createdWallet.set(result);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Não foi possível criar a carteira');
        this.isLoading.set(false);
      },
    });
  }

  protected async saveInVault(): Promise<void> {
    const wallet = this.createdWallet();

    if (!wallet) return;

    if (this.vaultPassword().length < 8) {
      this.errorMessage.set('A senha precisa ter pelo menos 8 caracteres');
      return;
    }

    if (this.vaultPassword() != this.confirmVaultPassword()) {
      this.errorMessage.set('As senhas não conferem');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      await this.walletVaultService.save(wallet, this.vaultPassword());
      this.vaultSaved.set(true);
    } catch {
      this.errorMessage.set('Não foi possível salvar a carteira localmente');
    } finally {
      this.isLoading.set(false);
    }
  }
}
