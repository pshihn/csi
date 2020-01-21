import { LitElement, customElement, TemplateResult, html, CSSResultArray, css, property, query } from 'lit-element';
import { flex } from 'soso/bin/styles/flex';
import { fire } from 'soso/bin/utils/ui-utils';

import 'soso/bin/components/icon';
import 'soso/bin/components/icon-button';

@customElement('file-picker')
export class FilePicker extends LitElement {
  @property() private file?: File;
  @query('#fi') private fileInput?: HTMLInputElement;


  static get styles(): CSSResultArray {
    return [
      flex,
      css`
      :host {
        display: inline-block;
      }
      button {
        outline: none;
        cursor: pointer;
        border: none;
        background: none;
        font-family: inherit;
        color: inherit;
        position: relative;
        padding: 4px 8px;
        letter-spacing: 1.5px;
      }
      button.nofile {
        background: var(--border-color);
        border-radius: 3px;
      }
      button.hasfile {
        padding: 4px 0;
        overflow: hidden;
        max-width: 86px;
        letter-spacing: 0;
      }
      #fi {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        opacity: 0;
        cursor: pointer;
      }
      #buttonLabel {
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      soso-icon-button {
        color: var(--highlight-green);
      }
      `
    ];
  }

  render(): TemplateResult {
    return html`
    <div class="horizontal layout center">
      <button class="horizontal layout center ${this.file ? 'hasfile' : 'nofile'}">
        ${this.file ? html`` : html`<soso-icon icon="upload"></soso-icon>`}
        <span id="buttonLabel">${this.file ? this.file.name : 'Upload'}</span>
        <input id="fi" type="file" accept="image/*" @change="${this.fileChanged}">
      </button>
      ${this.file ? html`<soso-icon-button icon="close" @click="${this.clear}"></soso-icon-button>` : html``}
    </div>
    `;
  }

  private fileChanged() {
    this.file = (this.fileInput!.files || [])[0];
    if (this.file) {
      fire(this, 'file', { file: this.file });
    }
  }

  clear() {
    if (this.file) {
      this.file = undefined;
      if (this.fileInput) {
        this.fileInput.value = '';
        this.fileInput.files = null;
      }
      fire(this, 'file', { file: this.file });
    }
  }
}