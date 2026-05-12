import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-metric-card',
  template: `
    <article>
      <span>{{ label() }}</span>
      <strong
        [class.success]="tone() === 'success'"
        [class.danger]="tone() === 'danger'"
        [class.gold]="tone() === 'gold'"
      >
        {{ value() }}
      </strong>
    </article>
  `,
  styles: `
    article {
      display: grid;
      gap: 12px;
      min-width: 0;
      padding: 20px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface);
      box-shadow: var(--shadow);
    }

    span {
      color: var(--muted);
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
    }

    strong {
      color: var(--text);
      font-size: 28px;
      line-height: 1.1;
      overflow-wrap: anywhere;
    }

    .success {
      color: var(--success);
    }

    .danger {
      color: var(--danger);
    }

    .gold {
      color: var(--accent-strong);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricCard {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly tone = input('');
}
