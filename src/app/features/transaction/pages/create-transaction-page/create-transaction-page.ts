import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WalletVaultService } from '../../../../core/services/wallet-vault/wallet-vault.service';
import { StoredWallet } from '../../../../core/models/wallet/stored-wallet';
import { TransactionService } from '../../../../core/services/transaction/transaction.service';
import { SignatureService } from '../../../../shared/services/signature/signature.service';
import {
  FINANCIAL_EVENT_LABELS,
  FINANCIAL_EVENT_TYPES,
  FinancialEventType,
} from '../../../../core/models/financial-event/financial-event-type';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { HashValue } from '../../../../shared/components/hash-value/hash-value';
import { JsonPreview } from '../../../../shared/components/json-preview/json-preview';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { SectionCard } from '../../../../shared/components/section-card/section-card';
import { formatJson, shortValue } from '../../../../shared/utils/format';

interface FinancialEventForm {
  type: FinancialEventType;
  processingId: string;
  fileName: string;
  fileHash: string;
  recordsCount: string;
  recordsProcessed: string;
  totalAmount: string;
  currency: string;
  source: string;
  divergenceType: string;
  expectedAmount: string;
  actualAmount: string;
  affectedRecords: string;
  divergencesFound: string;
  durationMs: string;
  status: string;
  password: string;
}

@Component({
  selector: 'app-create-transaction-page',
  imports: [RouterLink, PageHeader, EmptyState, JsonPreview, HashValue, SectionCard],
  templateUrl: './create-transaction-page.html',
  styleUrl: './create-transaction-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTransactionPage implements OnInit {
  protected readonly isLoading = signal(false);
  protected readonly wallets = signal<StoredWallet[]>([]);
  protected readonly selectedAddress = signal('');
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly transactionHash = signal<string | null>(null);
  protected readonly eventTypes = FINANCIAL_EVENT_TYPES;
  protected readonly labels = FINANCIAL_EVENT_LABELS;

  protected readonly form = signal<FinancialEventForm>({
    type: 'BILLING_FILE_RECEIVED',
    processingId: globalThis.crypto?.randomUUID?.() ?? '00000000-0000-4000-8000-000000000000',
    fileName: 'billing_2026_05.csv',
    fileHash: 'sha256-do-arquivo',
    recordsCount: '120000',
    recordsProcessed: '120000',
    totalAmount: '1250000.75',
    currency: 'BRL',
    source: 'billing-pipeline',
    divergenceType: 'AMOUNT_MISMATCH',
    expectedAmount: '1250000.75',
    actualAmount: '1249980.50',
    affectedRecords: '3',
    divergencesFound: '3',
    durationMs: '8421',
    status: 'COMPLETED',
    password: '',
  });

  private readonly walletVaultService = inject(WalletVaultService);
  private readonly signatureService = inject(SignatureService);
  private readonly transactionService = inject(TransactionService);

  async ngOnInit(): Promise<void> {
    const wallets = await this.walletVaultService.list();

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
      this.errorMessage.set('Selecione uma carteira local');
      return;
    }

    const form = this.form();

    if (!form.processingId.trim() || !form.fileHash.trim()) {
      this.errorMessage.set('ID do processamento e hash do arquivo são obrigatórios');
      return;
    }

    if (!form.password.trim()) {
      this.errorMessage.set('Digite a senha da carteira local');
      return;
    }

    this.isLoading.set(true);

    try {
      const nonce = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`;
      const payload = this.buildPayload(form);
      const serializedPayload = JSON.stringify(this.sortJsonValue(payload));
      const privateKey = await this.walletVaultService.decryptPrivateKey(wallet, form.password);
      const rawContent = form.type + serializedPayload + wallet.publicKey + nonce;
      const signature = await this.signatureService.sign(rawContent, privateKey);

      this.transactionService
        .create({
          type: form.type,
          payload,
          publicKey: wallet.publicKey,
          signature,
          nonce,
        })
        .subscribe({
          next: (transaction) => {
            this.transactionHash.set(transaction.hash);
            this.successMessage.set('Evento financeiro assinado e enviado ao ledger');
            this.form.update((current) => ({
              ...current,
              password: '',
            }));
            this.isLoading.set(false);
          },
          error: () => {
            this.errorMessage.set('Não foi possível criar o evento financeiro');
            this.isLoading.set(false);
          },
        });
    } catch {
      this.errorMessage.set('Senha inválida ou carteira local corrompida');
      this.isLoading.set(false);
    }
  }

  protected updateField<K extends keyof FinancialEventForm>(
    field: K,
    value: FinancialEventForm[K],
  ): void {
    this.form.update((current) => ({
      ...current,
      [field]: value,
    }));
  }

  protected updateSelectedAddress(address: string): void {
    this.selectedAddress.set(address);
  }

  protected regenerateProcessingId(): void {
    this.updateField(
      'processingId',
      globalThis.crypto?.randomUUID?.() ?? '00000000-0000-4000-8000-000000000000',
    );
  }

  protected previewPayload(): string {
    return formatJson(this.buildPayload(this.form()));
  }

  protected previewPayloadValue(): Record<string, unknown> {
    return this.buildPayload(this.form());
  }

  protected formatAddress(address: string): string {
    return shortValue(address);
  }

  private buildPayload(form: FinancialEventForm): Record<string, unknown> {
    const base = {
      processingId: form.processingId.trim(),
      fileHash: form.fileHash.trim(),
    };

    if (form.type === 'BILLING_FILE_RECEIVED')
      return {
        ...base,
        fileName: form.fileName.trim(),
        recordsCount: this.numberValue(form.recordsCount),
        totalAmount: this.numberValue(form.totalAmount),
        currency: form.currency.trim(),
        source: form.source.trim(),
      };

    if (form.type === 'BILLING_DIVERGENCE_DETECTED')
      return {
        ...base,
        divergenceType: form.divergenceType.trim(),
        expectedAmount: this.numberValue(form.expectedAmount),
        actualAmount: this.numberValue(form.actualAmount),
        difference: this.numberValue(form.expectedAmount) - this.numberValue(form.actualAmount),
        affectedRecords: this.numberValue(form.affectedRecords),
      };

    if (form.type === 'BILLING_PROCESSING_FINISHED')
      return {
        ...base,
        recordsProcessed: this.numberValue(form.recordsProcessed),
        totalAmount: this.numberValue(form.totalAmount),
        divergencesFound: this.numberValue(form.divergencesFound),
        durationMs: this.numberValue(form.durationMs),
        status: form.status.trim(),
      };

    if (form.type === 'BILLING_CHARGE_CALCULATED')
      return {
        ...base,
        recordsProcessed: this.numberValue(form.recordsProcessed),
        totalAmount: this.numberValue(form.totalAmount),
        currency: form.currency.trim(),
      };

    if (form.type === 'BILLING_BATCH_APPROVED' || form.type === 'BILLING_BATCH_REJECTED')
      return {
        ...base,
        recordsProcessed: this.numberValue(form.recordsProcessed),
        totalAmount: this.numberValue(form.totalAmount),
        divergencesFound: this.numberValue(form.divergencesFound),
        status: form.type === 'BILLING_BATCH_APPROVED' ? 'APPROVED' : 'REJECTED',
      };

    if (form.type === 'BILLING_REPORT_EXPORTED')
      return {
        ...base,
        fileName: form.fileName.trim(),
        source: form.source.trim(),
        status: 'EXPORTED',
      };

    return {
      ...base,
      recordsCount: this.numberValue(form.recordsCount),
      totalAmount: this.numberValue(form.totalAmount),
      currency: form.currency.trim(),
      source: form.source.trim(),
      status: form.status.trim(),
    };
  }

  private numberValue(value: string): number {
    return Number(value || 0);
  }

  private sortJsonValue(value: unknown): unknown {
    if (Array.isArray(value)) return value.map((item) => this.sortJsonValue(item));

    if (value != null && typeof value == 'object')
      return Object.keys(value)
        .sort()
        .reduce<Record<string, unknown>>((result, key) => {
          result[key] = this.sortJsonValue((value as Record<string, unknown>)[key]);
          return result;
        }, {});

    return value;
  }
}
