import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-card',
  template: `
    <section class="section-card" [class.accent]="tone() === 'accent'" [class.danger]="tone() === 'danger'">
      @if (label() || title()) {
        <header>
          @if (label()) {
            <span>{{ label() }}</span>
          }
          @if (title()) {
            <h2>{{ title() }}</h2>
          }
        </header>
      }
      <div class="content">
        <ng-content />
      </div>
    </section>
  `,
  styles: `
    .section-card {
      display: grid;
      gap: 14px;
      min-width: 0;
      align-content: start;
      padding: 20px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface);
      box-shadow: var(--shadow);
    }

    .accent {
      border-color: var(--accent-border);
      background: var(--accent-surface);
    }

    .danger {
      border-color: var(--danger-border);
      background: var(--danger-soft);
    }

    header,
    .content {
      display: grid;
      gap: 10px;
      min-width: 0;
    }

    span {
      color: var(--muted);
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
    }

    h2 {
      margin: 0;
      color: var(--text);
      font-size: 18px;
      line-height: 1.25;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionCard {
  readonly label = input('');
  readonly title = input('');
  readonly tone = input('');
}
