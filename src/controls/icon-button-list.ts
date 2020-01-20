import { LitElement, customElement, TemplateResult, html, CSSResultArray, css, property } from 'lit-element';
import { flex } from 'soso/bin/styles/flex';
import { fire } from 'soso/bin/utils/ui-utils';
import 'soso/bin/components/icon-button';

export interface ButtonItem {
  value: string;
  icon: string;
}

@customElement('icon-button-list')
export class IconButtonList extends LitElement {
  @property() items: ButtonItem[] = [];
  @property() selected = '';

  static get styles(): CSSResultArray {
    return [
      flex,
      css`
      :host {
        display: inline-block;
      }
      soso-icon-button {
        border-radius: 50%;
      }
      soso-icon-button.selected {
        background: var(--border-color);
      }
      `
    ];
  }


  render(): TemplateResult {
    return html`
    <div class="horizontal layout center">
      ${this.items.map((d) => html`
        <soso-icon-button
          role="button"
          aria-label="${d.value}"
          title="${d.value}"
          class="${this.selected === d.value ? 'selected' : ''}"
          .icon="${d.icon}"
          @click="${() => this.handleSelect(d)}">
        </soso-icon-button>
      `)}
    </div>
    `;
  }

  private handleSelect(item: ButtonItem) {
    if (this.selected !== item.value) {
      this.selected = item.value;
      fire(this, 'change', { selected: this.selected });
    }
  }
}