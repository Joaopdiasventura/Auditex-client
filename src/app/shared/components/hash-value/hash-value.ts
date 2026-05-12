import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { shortValue } from '../../utils/format';

@Component({
  selector: 'app-hash-value',
  template: `<code [attr.title]="value() || null">{{ display() }}</code>`,
  styles: `
    code {
      display: inline-block;
      max-width: 100%;
      color: var(--accent-strong);
      overflow-wrap: anywhere;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HashValue {
  readonly value = input<string | null | undefined>(null);
  readonly head = input(10);
  readonly tail = input(8);

  protected readonly display = computed(() => shortValue(this.value(), this.head(), this.tail()));
}
