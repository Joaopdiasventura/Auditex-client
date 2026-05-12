import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  template: `
    <span
      class="badge"
      [class.success]="tone() === 'success'"
      [class.warning]="tone() === 'warning'"
      [class.danger]="tone() === 'danger'"
      [class.gold]="tone() === 'gold'"
    >
      {{ label() }}
    </span>
  `,
  styles: `
    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 28px;
      border: 1px solid var(--line-strong);
      border-radius: 999px;
      background: var(--pending-soft);
      color: var(--pending);
      font-size: 12px;
      font-weight: 800;
      padding: 4px 10px;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .success {
      border-color: var(--success-border);
      background: var(--success-soft);
      color: var(--success);
    }

    .warning {
      border-color: var(--warning-border);
      background: var(--warning-soft);
      color: var(--warning);
    }

    .danger {
      border-color: var(--danger-border);
      background: var(--danger-soft);
      color: var(--danger);
    }

    .gold {
      border-color: var(--accent-border);
      background: var(--accent-soft);
      color: var(--accent-strong);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadge {
  readonly status = input.required<string | null | undefined>();

  protected readonly label = computed(() => this.status() ?? 'PENDING');

  protected readonly tone = computed(() => {
    const status = this.label().toUpperCase();
    if (['MINED', 'VALIDATED', 'APPROVED'].includes(status)) return 'gold';
    if (['COMPLETED', 'SUCCESS'].includes(status)) return 'success';
    if (['REJECTED', 'FAILED', 'ERROR', 'INVALID'].includes(status)) return 'danger';
    if (['WARNING', 'ATTENTION'].includes(status)) return 'warning';
    return 'pending';
  });
}
