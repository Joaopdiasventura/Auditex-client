import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlockTransactions } from '../../../../core/models/block/block-transactions';
import { financialEventLabel } from '../../../../core/models/financial-event/financial-event-type';
import { BlockService } from '../../../../core/services/block/block.service';
import { HashValue } from '../../../../shared/components/hash-value/hash-value';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { SectionCard } from '../../../../shared/components/section-card/section-card';
import { StatusBadge } from '../../../../shared/components/status-badge/status-badge';
import { formatDateTime, shortValue } from '../../../../shared/utils/format';

@Component({
  selector: 'app-block-detail-page',
  imports: [RouterLink, PageHeader, StatusBadge, HashValue, SectionCard],
  templateUrl: './block-detail-page.html',
  styleUrl: './block-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockDetailPage implements OnInit {
  protected readonly data = signal<BlockTransactions | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  private readonly pageSize = 50;
  private readonly route = inject(ActivatedRoute);
  private readonly blockService = inject(BlockService);

  ngOnInit(): void {
    this.load(0);
  }

  protected load(page: number): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage.set('O ID do bloco é obrigatório');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.blockService.transactions(id, page, this.pageSize).subscribe({
      next: (data) => {
        this.data.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar o bloco');
        this.isLoading.set(false);
      },
    });
  }

  protected label(type: string): string {
    return financialEventLabel(type);
  }

  protected short(value: string | null): string {
    return shortValue(value, 12, 10);
  }

  protected formatDate(value: string | null): string {
    return formatDateTime(value, 'medium');
  }
}
