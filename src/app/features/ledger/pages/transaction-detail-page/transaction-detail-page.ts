import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  FINANCIAL_EVENT_LABELS,
  FinancialEventType,
} from '../../../../core/models/financial-event/financial-event-type';
import { Transaction } from '../../../../core/models/transaction/transaction';
import { TransactionService } from '../../../../core/services/transaction/transaction.service';
import { HashValue } from '../../../../shared/components/hash-value/hash-value';
import { JsonPreview } from '../../../../shared/components/json-preview/json-preview';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { SectionCard } from '../../../../shared/components/section-card/section-card';
import { StatusBadge } from '../../../../shared/components/status-badge/status-badge';
import { formatDateTime, formatJson, shortValue } from '../../../../shared/utils/format';

@Component({
  selector: 'app-transaction-detail-page',
  imports: [RouterLink, PageHeader, StatusBadge, HashValue, JsonPreview, SectionCard],
  templateUrl: './transaction-detail-page.html',
  styleUrl: './transaction-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionDetailPage implements OnInit {
  protected readonly transaction = signal<Transaction | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = signal(false);
  private readonly route = inject(ActivatedRoute);
  private readonly transactionService = inject(TransactionService);

  ngOnInit(): void {
    const hash = this.route.snapshot.paramMap.get('hash');
    if (!hash) {
      this.errorMessage.set('Transaction hash is required');
      return;
    }

    this.isLoading.set(true);
    this.transactionService.findByHash(hash).subscribe({
      next: (transaction) => {
        this.transaction.set(transaction);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load transaction');
        this.isLoading.set(false);
      },
    });
  }

  protected label(type: string): string {
    return FINANCIAL_EVENT_LABELS[type as FinancialEventType] ?? type;
  }

  protected short(value: string | null): string {
    return shortValue(value, 12, 10);
  }

  protected payload(value: unknown): string {
    return formatJson(value);
  }

  protected formatDate(value: string | null): string {
    return formatDateTime(value, 'medium');
  }
}
