import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LedgerStatus } from '../../../../core/models/ledger/ledger-status';
import { ValidateResponse } from '../../../../core/models/ledger/validate-response';
import { LedgerService } from '../../../../core/services/ledger/ledger.service';
import { HashValue } from '../../../../shared/components/hash-value/hash-value';
import { MetricCard } from '../../../../shared/components/metric-card/metric-card';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { SectionCard } from '../../../../shared/components/section-card/section-card';
import { formatDateTime, shortValue } from '../../../../shared/utils/format';
import { validationReasonLabel } from '../../../../shared/utils/validation-reason-label';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, PageHeader, MetricCard, HashValue, SectionCard],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage implements OnInit {
  protected readonly status = signal<LedgerStatus | null>(null);
  protected readonly validation = signal<ValidateResponse | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly isValidating = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  private readonly ledgerService = inject(LedgerService);

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.ledgerService.status().subscribe({
      next: (status) => {
        this.status.set(status);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar o status do ledger');
        this.isLoading.set(false);
      },
    });
  }

  protected validate(): void {
    this.isValidating.set(true);
    this.errorMessage.set(null);

    this.ledgerService.validate().subscribe({
      next: (validation) => {
        this.validation.set(validation);
        this.isValidating.set(false);
        this.load();
      },
      error: () => {
        this.errorMessage.set('Não foi possível validar a integridade do ledger');
        this.isValidating.set(false);
      },
    });
  }

  protected short(value: string | null): string {
    return shortValue(value);
  }

  protected formatDate(value: string | null): string {
    return formatDateTime(value);
  }

  protected validationReason(reason: string | null): string {
    return validationReasonLabel(reason);
  }
}
