import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Block } from '../../../../core/models/block/block';
import { PageResponse } from '../../../../core/models/page/page-response';
import { BlockService } from '../../../../core/services/block/block.service';
import { HashValue } from '../../../../shared/components/hash-value/hash-value';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { formatDateTime, shortValue } from '../../../../shared/utils/format';

@Component({
  selector: 'app-block-list-page',
  imports: [RouterLink, PageHeader, HashValue],
  templateUrl: './block-list-page.html',
  styleUrl: './block-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockListPage implements OnInit {
  protected readonly pageData = signal<PageResponse<Block> | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  private readonly pageSize = 20;
  private readonly blockService = inject(BlockService);

  ngOnInit(): void {
    this.load(0);
  }

  protected load(page: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.blockService.page(page, this.pageSize).subscribe({
      next: (pageData) => {
        this.pageData.set(pageData);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar os blocos');
        this.isLoading.set(false);
      },
    });
  }

  protected short(value: string | null): string {
    return shortValue(value);
  }

  protected formatDate(value: string | null): string {
    return formatDateTime(value);
  }
}
