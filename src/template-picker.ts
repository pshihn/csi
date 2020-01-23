import { LitElement, customElement, TemplateResult, html, CSSResultArray, css, property } from 'lit-element';
import { flex } from 'soso/bin/styles/flex';
import { TemplateInfo } from './templates/template';
import { fire } from 'soso/bin/utils/ui-utils';

@customElement('template-picker')
export class TemplateList extends LitElement {
  @property() selected = '';
  @property() templates: TemplateInfo[] = [];

  static get styles(): CSSResultArray {
    return [
      flex,
      css`
      :host {
        display: block;
      }
      button {
        cursor: pointer;
        background: none;
        border: none;
        outline: none;
        box-sizing: border-box;
        width: 100%;
        padding: 12px;
        position: relative;
      }
      button label {
        font-size: 12px;
        letter-spacing: 1px;
        color: rgb(216, 216, 216);
        text-transform: uppercase;
        margin: 0px 0px 6px;
      }
      button img {
        width: 100%;
        box-sizing: border-box;
      }
      button.selected label {
        color: white;
      }
      button .bar {
        position: absolute;
        top: 33px;
        bottom: 12px;
        right: 0;
        width: 6px;
        background: var(--highlight-blue);
        opacity: 0;
        transition: opacity 0.28s ease;
      }
      button.selected .bar {
        opacity: 1;
      }
      h2 {
        text-align: center;
        margin: 0;
        padding: 16px 12px;
        font-weight: 300;
        font-size: 18px;
        text-transform: uppercase;
        letter-spacing: 2px;
      }
      `
    ];
  }

  render(): TemplateResult {
    return html`
    <h2>Templates</h2>
    ${this.templates.map((d) => html`
      <button class="vertical layout ${this.selected === d.type ? 'selected' : ''}" @click="${() => fire(this, 'select', d)}">
        <label>${d.name}</label>
        <img alt="${d.name}" src="${d.preview}">
        <div class="bar"></div>
      </button>
    `)
      }
    `;
  }
}