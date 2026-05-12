import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <section class="empty-state">
      <h2>{{ title() }}</h2>
      @if (message()) {
        <p>{{ message() }}</p>
      }
      <ng-content />
    </section>
  `,
  styles: `
    .empty-state {
      display: grid;
      gap: 12px;
      justify-items: start;
    }

    h2 {
      margin: 0;
      color: var(--text);
      font-size: 20px;
    }

    p {
      margin: 0;
      color: var(--muted);
      line-height: 1.5;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyState {
  readonly title = input.required<string>();
  readonly message = input('');
}
