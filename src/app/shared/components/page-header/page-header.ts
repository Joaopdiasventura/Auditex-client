import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
    <header class="page-header">
      <div>
        <p class="eyebrow">{{ eyebrow() }}</p>
        <h1>{{ title() }}</h1>
        @if (description()) {
          <p class="description">{{ description() }}</p>
        }
      </div>
      <div class="actions">
        <ng-content />
      </div>
    </header>
  `,
  styles: `
    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 20px;
      padding: 24px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: linear-gradient(180deg, #ffffff 0%, var(--surface-raised) 100%);
      box-shadow: var(--shadow);
    }

    h1 {
      margin: 4px 0 8px;
      color: var(--text);
      font-size: clamp(26px, 3vw, 34px);
      line-height: 1.12;
    }

    .description {
      max-width: 720px;
      margin: 0;
      color: var(--muted);
      line-height: 1.55;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 12px;
    }

    @media (max-width: 760px) {
      .page-header {
        flex-direction: column;
      }

      .actions {
        width: 100%;
        justify-content: stretch;
      }

      .actions ::ng-deep .primary-action,
      .actions ::ng-deep .secondary-action {
        flex: 1;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeader {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input('');
}
