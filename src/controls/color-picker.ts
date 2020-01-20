import { LitElement, customElement, TemplateResult, html, CSSResultArray, css, property } from 'lit-element';
import { flex } from 'soso/bin/styles/flex';
import { fire } from 'soso/bin/utils/ui-utils';

@customElement('color-picker')
export class ColorPicker extends LitElement {
  @property() value = '';

  static get styles(): CSSResultArray {
    return [
      flex,
      css`
      :host {
        display: inline-block;
      }
      #colorView {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
      #colorBG {
        width: 28px;
        height: 28px;
        box-sizing: border-box;
        border-radius: 5px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==) 0;
        background-color: white;
        min-width: 28px;
        margin-right: 8px;
        position: relative;
        overflow: hidden;
      }
      input {
        background: none;
        border: none;
        color: inherit;
        outline: none;
        font-size: 15px;
        box-sizing: border-box;
        width: 100px;
        padding: 0 4px;
        border: none;
        border-bottom: 1px solid;
        border-color: var(--border-color);
      }
      input:focus {
        border-color: white;
      }
      `
    ];
  }

  render(): TemplateResult {
    return html`
    <div class="horizontal layout">
      <div id="colorBG">
        <div id="colorView" style="background-color: ${this.value};"></div>
      </div>
      <input .value="${this.value}" type="text" @input="${this.onInput}"></div>
    </div>
    `;
  }

  private onInput(e: Event) {
    e.stopPropagation();
    const value = (e.target! as HTMLInputElement).value.trim();
    if (value !== this.value) {
      this.value = value;
      fire(this, 'change', { value });
    }
  }
}