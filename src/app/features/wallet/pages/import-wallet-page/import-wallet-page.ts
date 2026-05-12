import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, max, min, required } from '@angular/forms/signals';
import { WalletVaultService } from '../../../../core/services/wallet-vault/wallet-vault.service';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { SectionCard } from '../../../../shared/components/section-card/section-card';

interface ImportWalletDto {
  ownerName: string;
  address: string;
  publicKey: string;
  privateKey: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-import-wallet-page',
  imports: [PageHeader, SectionCard],
  templateUrl: './import-wallet-page.html',
  styleUrl: './import-wallet-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportWalletPage {
  protected readonly isLoading = signal(false);
  protected readonly isSaved = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly importWalletDto = signal<ImportWalletDto>({
    ownerName: '',
    address: '',
    publicKey: '',
    privateKey: '',
    password: '',
    confirmPassword: '',
  });

  protected readonly importWalletForm = form(this.importWalletDto, (s) => {
    required(s.ownerName, { message: 'Digite o nome do proprietário' });
    min(s.ownerName, 2, { message: 'Digite um nome com mais de dois caracteres' });
    max(s.ownerName, 120, { message: 'Digite um nome com menos de 120 caracteres' });

    required(s.address, { message: 'Digite o endereço da carteira' });
    required(s.publicKey, { message: 'Digite a chave pública' });
    required(s.privateKey, { message: 'Digite a chave privada' });

    required(s.password, { message: 'Digite a senha local' });
    min(s.password, 8, { message: 'A senha precisa ter pelo menos 8 caracteres' });

    required(s.confirmPassword, { message: 'Confirme a senha local' });
  });

  private readonly walletVaultService = inject(WalletVaultService);

  protected async submit(): Promise<void> {
    if (!this.importWalletForm().valid()) return;

    const dto = this.importWalletDto();

    if (dto.password != dto.confirmPassword) {
      this.errorMessage.set('As senhas não conferem');
      return;
    }

    this.isLoading.set(true);
    this.isSaved.set(false);
    this.errorMessage.set(null);

    try {
      await this.walletVaultService.saveImported(
        {
          id: crypto.randomUUID(),
          ownerName: dto.ownerName.trim(),
          address: dto.address.trim(),
          publicKey: dto.publicKey.trim(),
          privateKey: dto.privateKey.trim(),
          createdAt: new Date().toISOString(),
        },
        dto.password,
      );

      this.importWalletDto.set({
        ownerName: '',
        address: '',
        publicKey: '',
        privateKey: '',
        password: '',
        confirmPassword: '',
      });

      this.isSaved.set(true);
    } catch {
      this.errorMessage.set('Não foi possível importar a carteira');
    } finally {
      this.isLoading.set(false);
    }
  }

  protected updateField<K extends keyof ImportWalletDto>(
    field: K,
    value: ImportWalletDto[K],
  ): void {
    this.importWalletDto.update((current) => ({
      ...current,
      [field]: value,
    }));
  }
}
