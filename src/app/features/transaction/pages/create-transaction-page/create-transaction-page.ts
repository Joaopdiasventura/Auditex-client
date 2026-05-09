import { Component, OnInit, inject, signal } from '@angular/core';
import { WalletVaultService } from '../../../../core/services/wallet-vault/wallet-vault.service';
import { StoredWallet } from '../../../../core/models/wallet/stored-wallet';
import { TransactionService } from '../../../../core/services/transaction/transaction.service';
import { SignatureService } from '../../../../shared/services/signature/signature.service';

interface CreateTransactionDto {
  type: string;
  payload: string;
  password: string;
}

@Component({
  selector: 'app-create-transaction-page',
  imports: [],
  templateUrl: './create-transaction-page.html',
  styleUrl: './create-transaction-page.scss',
})
export class CreateTransactionPage implements OnInit {
  protected readonly isLoading = signal(false);
  protected readonly wallets = signal<StoredWallet[]>([]);
  protected readonly selectedAddress = signal('');
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly transactionHash = signal<string | null>(null);

  protected readonly createTransactionDto = signal<CreateTransactionDto>({
    type: 'INVOICE_PAID',
    payload: '{ "invoiceId": "INV-001", "amount": 1500.75, "currency": "BRL" }',
    password: '',
  });

  private readonly walletVaultService = inject(WalletVaultService);
  private readonly signatureService = inject(SignatureService);
  private readonly transactionService = inject(TransactionService);

  async ngOnInit(): Promise<void> {
    const wallets = await this.walletVaultService.findAll();

    this.wallets.set(wallets);

    if (wallets.length > 0) {
      this.selectedAddress.set(wallets[0].address);
    }
  }

  protected async submit(): Promise<void> {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.transactionHash.set(null);

    const wallet = this.wallets().find((item) => item.address === this.selectedAddress());

    if (!wallet) {
      this.errorMessage.set('Selecione uma carteira');
      return;
    }

    const dto = this.createTransactionDto();

    if (!dto.type.trim()) {
      this.errorMessage.set('Digite o tipo da transação');
      return;
    }

    if (!dto.payload.trim()) {
      this.errorMessage.set('Digite o payload da transação');
      return;
    }

    if (!dto.password.trim()) {
      this.errorMessage.set('Digite a senha local da carteira');
      return;
    }

    if (!this.isValidJson(dto.payload)) {
      this.errorMessage.set('O payload precisa ser um JSON válido');
      return;
    }

    this.isLoading.set(true);

    try {
      const nonce = crypto.randomUUID();

      const privateKey = await this.walletVaultService.decryptPrivateKey(wallet, dto.password);

      const canonicalData = this.canonicalize(dto.type.trim(), dto.payload.trim(), nonce);

      const signature = await this.signatureService.sign(canonicalData, privateKey);

      this.transactionService
        .create({
          type: dto.type.trim(),
          payload: dto.payload.trim(),
          publicKey: wallet.publicKey,
          signature,
          nonce,
        })
        .subscribe({
          next: (transaction) => {
            this.transactionHash.set(transaction.hash);
            this.successMessage.set('Transação assinada e enviada para a mempool');
            this.createTransactionDto.update((current) => ({
              ...current,
              password: '',
            }));
            this.isLoading.set(false);
          },
          error: () => {
            this.errorMessage.set('Não foi possível criar a transação');
            this.isLoading.set(false);
          },
        });
    } catch {
      this.errorMessage.set('Senha inválida ou carteira local corrompida');
      this.isLoading.set(false);
    }
  }

  protected updateField<K extends keyof CreateTransactionDto>(
    field: K,
    value: CreateTransactionDto[K],
  ): void {
    this.createTransactionDto.update((current) => ({
      ...current,
      [field]: value,
    }));
  }

  protected updateSelectedAddress(address: string): void {
    this.selectedAddress.set(address);
  }

  protected formatAddress(address: string): string {
    if (address.length <= 18) return address;

    return `${address.slice(0, 10)}...${address.slice(-8)}`;
  }

  private canonicalize(type: string, payload: string, nonce: string): string {
    return `${type}|${payload}|${nonce}`;
  }

  private isValidJson(value: string): boolean {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  }
}
