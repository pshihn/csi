import { LitElement, customElement, TemplateResult, html, CSSResultArray, css, property, query } from 'lit-element';
import { flex } from 'soso/bin/styles/flex';
import { fire } from 'soso/bin/utils/ui-utils';

@customElement('color-picker')
export class ColorPicker extends LitElement {
  @property() value = '';
  @property() private popupShowing = false;
  @query('input') private input?: HTMLInputElement;

  static get styles(): CSSResultArray {
    return [
      flex,
      css`
      :host {
        display: inline-block;
        position: relative;
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
        font-family: monospace;
        font-size: 15px;
        outline: none;
        background: none;
        border: none;
        border-bottom: 1px solid #596c7a;
        color: #596c7a;
        padding: 0 0 4px;
        width: 180px;
      }
      `
    ];
  }

  render(): TemplateResult {
    return html`
    <style>
      #popup {
        background: white;
        position: absolute;
        bottom: 100%;
        padding: 16px;
        margin-bottom: 8px;
        border-radius: 5px;
        box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 5px 8px 0 rgba(0,0,0,.14), 0 1px 14px 0 rgba(0,0,0,.12);
        transition: transform 0.3s ease, opacity 0.3s ease;
        transform: translate3d(-45%,60%,0) scale(0);
        opacity: 0;
        pointer-events: none;
      }
      #popup.showing {
        transform: translate3d(0,0,0) scale(1);
        opacity: 1;
        pointer-events: auto;
      }
    </style>
    <div id="colorBG">
      <div id="colorView" style="background-color: ${this.value};" @click="${this.openPopup}"></div>
    </div>
    <div id="popup" @click="${(e: Event) => e.stopPropagation()}" class="${this.popupShowing ? 'showing' : ''}">
      <input type="tex" .value="${this.value}" @input="${this.onInput}">
    </div>
    `;
  }

  private bodyListener = () => this.hidePopup();

  private openPopup(e: Event) {
    e.stopPropagation();
    if (this.popupShowing) {
      this.hidePopup();
    } else {
      this.popupShowing = true;
      setTimeout(() => {
        if (this.input) {
          this.input.focus();
        }
      });
      document.addEventListener('click', this.bodyListener);
    }
  }

  private hidePopup() {
    this.popupShowing = false;
    document.removeEventListener('click', this.bodyListener);
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