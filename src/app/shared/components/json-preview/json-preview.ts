import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { formatJson } from '../../utils/format';

@Component({
  selector: 'app-json-preview',
  template: `
    <section class="json-preview">
      <span>{{ label() }}</span>
      <pre>{{ display() }}</pre>
    </section>
  `,
  styles: `
    .json-preview {
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonPreview {
  readonly label = input('Prévia do payload');
  readonly value = input<unknown>(null);

  protected readonly display = computed(() => formatJson(this.value()));
}
