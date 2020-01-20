import { LitElement, customElement, TemplateResult, html, CSSResultArray, css, property } from 'lit-element';
import { flex } from 'soso/bin/styles/flex';
import { PageData } from './data';
import { fire } from 'soso/bin/utils/ui-utils';

import './controls/color-picker';
import 'soso/bin/components/file-button';

@customElement('control-panel')
export class ControlPanel extends LitElement {
  @property() data?: PageData;
  private pendingChange = false;

  static get styles(): CSSResultArray {
    return [
      flex,
      css`
      :host {
        display: block;
        padding: 0px 16px 24px;
      }
      .row {
        padding: 20px 0 0;
      }
      label {
        font-size: 12px;
        letter-spacing: 1px;
        color: #d8d8d8;
        margin: 0 0 2px;
        text-transform: uppercase;
      }
      label.more-space {
        margin: 0 0 10px;
      }
      .row-header {
        margin: 0 0 2px;
        min-height: 38px;
      }
      .row-header label {
        margin: 0;
      }
      input {
        background: none;
        border: none;
        color: inherit;
        outline: none;
        border-bottom: 1px solid;
        border-color: var(--border-color);
        font-size: 15px;
        width: 100%;
        box-sizing: border-box;
        padding: 4px 0;
      }
      input:focus {
        border-color: white;
      }
      soso-file-button {
        color: var(--border-color);
      }
      `
    ];
  }

  render(): TemplateResult {
    if (!this.data) {
      return html``;
    }
    return html`
    <div id="foo">
      <div class="row vertical layout">
        <label>Title</label>
        <input id="title" autocomplete="off" .value="${this.data.title}" @input="${this.titleChange}">
      </div>
      <div class="row vertical layout">
        <label>Subtitle</label>
        <input id="subtitle" autocomplete="off" .value="${this.data.subtitle}" @input="${this.subtitleChange}">
      </div>
      <div class="row vertical layout">
        <label>Author</label>
        <input id="author" autocomplete="off" .value="${this.data.authorName}" @input="${this.authorChange}">
      </div>
      <div class="row horizontal layout">
        <div class="vertical layout">
          <label class="more-space">Background color</label>
          <color-picker id="bgColor" .value="${this.data.bgColor}" @change="${this.bgColorChange}"></color-picker>
        </div>
        <span class="flex"></span>
        <div class="vertical layout">
          <label class="more-space">Text color</label>
          <color-picker id="textColor" .value="${this.data.textColor}" @change="${this.textColorChange}"></color-picker>
        </div>
        <span class="flex"></span>
      </div>
      <div class="row horizontal layout">
        <div class="vertical layout">
          <label class="more-space">Featured Image</label>
          <soso-file-button accept="image/*" @file="${this.handleBgFile}">Upload</soso-file-button>
        </div>
        <span class="flex"></span>
        <div class="vertical layout">
          <label class="more-space">Author image</label>
          <soso-file-button accept="image/*" @file="${this.handleAuthorFile}">Upload</soso-file-button>
        </div>
        <span class="flex"></span>
      </div>
    </div>
    `;
  }

  private titleChange(e: Event) {
    this.data!.title = (e.target as HTMLInputElement).value.trim();
    this.fireChanged();
  }

  private subtitleChange(e: Event) {
    this.data!.subtitle = (e.target as HTMLInputElement).value.trim();
    this.fireChanged();
  }

  private authorChange(e: Event) {
    this.data!.authorName = (e.target as HTMLInputElement).value.trim();
    this.fireChanged();
  }

  private bgColorChange(e: CustomEvent) {
    this.data!.bgColor = e.detail.value;
    this.fireChanged();
  }

  private textColorChange(e: CustomEvent) {
    this.data!.textColor = e.detail.value;
    this.fireChanged();
  }

  private async handleBgFile(e: CustomEvent) {
    const file: File = e.detail.file;
    if (file) {
      this.data!.image = (await this.loadImage(file)) || undefined;
      this.fireChanged();
    }
  }

  private async handleAuthorFile(e: CustomEvent) {
    const file: File = e.detail.file;
    if (file) {
      this.data!.authorImage = (await this.loadImage(file)) || undefined;
      this.fireChanged();
    }
  }

  private fireChanged() {
    if (!this.pendingChange) {
      this.pendingChange = true;
      setTimeout(() => {
        this.pendingChange = false;
        fire(this, 'update', this.data);
      }, 500);
    }
  }

  private async loadImage(file: File): Promise<HTMLImageElement | null> {
    const url = window.URL.createObjectURL(file);
    const revoke = () => {
      try {
        window.URL.revokeObjectURL(url);
      } catch (err) { }
    };
    return new Promise<HTMLImageElement | null>((resolve) => {
      const img = new Image();
      const onFail = () => {
        revoke();
        resolve(null);
      };
      img.onabort = onFail;
      img.onerror = onFail;
      img.onload = () => {
        revoke();
        resolve(img);
      };
      img.src = url;
    });
  }
}