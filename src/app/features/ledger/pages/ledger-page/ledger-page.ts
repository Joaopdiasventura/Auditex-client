import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FINANCIAL_EVENT_TYPES,
  financialEventLabel,
} from '../../../../core/models/financial-event/financial-event-type';
import { PageResponse } from '../../../../core/models/page/page-response';
import { Transaction } from '../../../../core/models/transaction/transaction';
import { TransactionService } from '../../../../core/services/transaction/transaction.service';
import { HashValue } from '../../../../shared/components/hash-value/hash-value';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { StatusBadge } from '../../../../shared/components/status-badge/status-badge';
import { formatDateTime, shortValue } from '../../../../shared/utils/format';

@Component({
  selector: 'app-ledger-page',
  imports: [RouterLink, PageHeader, StatusBadge, HashValue],
  templateUrl: './ledger-page.html',
  styleUrl: './ledger-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LedgerPage implements OnInit {
  protected readonly pageData = signal<PageResponse<Transaction> | null>(null);
  protected readonly typeFilter = signal('');
  protected readonly processingIdFilter = signal('');
  protected readonly fileHashFilter = signal('');
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly eventTypes = FINANCIAL_EVENT_TYPES;
  private readonly pageSize = 20;
  private readonly transactionService = inject(TransactionService);

  ngOnInit(): void {
    this.load(0);
  }

  protected load(page: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const type = this.typeFilter().trim();
    const processingId = this.processingIdFilter().trim();
    const fileHash = this.fileHashFilter().trim();
    const request = type
      ? this.transactionService.pageByType(type, page, this.pageSize)
      : processingId
        ? this.transactionService.pageByProcessingId(processingId, page, this.pageSize)
        : fileHash
          ? this.transactionService.pageByFileHash(fileHash, page, this.pageSize)
          : this.transactionService.page(page, this.pageSize);

    request.subscribe({
      next: (pageData) => {
        this.pageData.set(pageData);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar os eventos do ledger financeiro');
        this.isLoading.set(false);
      },
    });
  }

  protected applyFilters(): void {
    this.load(0);
  }

  protected clearFilters(): void {
    this.typeFilter.set('');
    this.processingIdFilter.set('');
    this.fileHashFilter.set('');
    this.load(0);
  }

  protected updateType(value: string): void {
    this.typeFilter.set(value);
  }

  protected updateProcessingId(value: string): void {
    this.processingIdFilter.set(value);
  }

  protected updateFileHash(value: string): void {
    this.fileHashFilter.set(value);
  }

  protected label(type: string): string {
    return financialEventLabel(type);
  }

  protected short(value: string | null): string {
    return shortValue(value);
  }

  protected formatDate(value: string | null): string {
    return formatDateTime(value);
  }
}
