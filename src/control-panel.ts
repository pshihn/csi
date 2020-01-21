import { LitElement, customElement, TemplateResult, html, CSSResultArray, css, property } from 'lit-element';
import { flex } from 'soso/bin/styles/flex';
import { PageData } from './data';
import { fire } from 'soso/bin/utils/ui-utils';
import { ButtonItem } from './controls/icon-button-list';

import './controls/color-picker';
import './controls/icon-button-list';
import './controls/file-picker';

const HORIZ_ITEMS: ButtonItem[] = [
  { value: 'left', icon: 'align-left' },
  { value: 'center', icon: 'align-center' },
  { value: 'right', icon: 'align-right' }
];

const VERT_ITEMS: ButtonItem[] = [
  { value: 'top', icon: 'align-top' },
  { value: 'middle', icon: 'align-middle' },
  { value: 'bottom', icon: 'align-bottom' }
];

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
        --soso-icon-button-padding: 6px;
      }
      .row {
        padding: 20px 0 0;
      }
      .row-less {
        padding: 12px 0 0;
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
      label.right-space {
        margin: 0 6px 0 0;
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
      .spacer {
        max-width: 32px;
      }
      `
    ];
  }

  render(): TemplateResult {
    if (!this.data) {
      return html``;
    }
    return html`
    <div>
      <div class="row horizontal layout center">
        <label class="right-space">Background:</label>
        <color-picker id="bgColor" .value="${this.data.bgColor}" @change="${this.bgColorChange}"></color-picker>
        <label class="right-space" style="margin-left: 16px;">Text color:</label>
        <color-picker id="textColor" .value="${this.data.textColor}" @change="${this.textColorChange}"></color-picker>
      </div>
      <div class="row vertical layout">
        <label>Title</label>
        <input id="title" autocomplete="off" .value="${this.data.title}" @input="${this.titleChange}">
      </div>
      <div class="row vertical layout">
        <label>Subtitle</label>
        <input id="subtitle" autocomplete="off" .value="${this.data.subtitle}" @input="${this.subtitleChange}">
      </div>
      <div class="row-less horizontal layout center">
        <label class="right-space">Alignment</label>
        <span class="flex"></span>
        <icon-button-list .items="${HORIZ_ITEMS}" .selected="${this.data.halign}" @change="${this.halignChange}"></icon-button-list>
        <span class="flex spacer"></span>
        <icon-button-list .items="${VERT_ITEMS}" selected="${this.data.valign}" @change="${this.valignChange}"></icon-button-list>
      </div>
      <div class="row vertical layout">
        <label>Featured Image</label>
        <div class="horizontal layout center">
          <file-picker @file="${this.handleBgFile}"></file-picker>
          <span class="flex"></span>
          <icon-button-list .items="${HORIZ_ITEMS}" .selected="${this.data.halignImage}" @change="${this.imHAlignChange}"></icon-button-list>
          <span class="flex spacer"></span>
          <icon-button-list .items="${VERT_ITEMS}" selected="${this.data.valignImage}" @change="${this.imVAlignChange}"></icon-button-list>
        </div>
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

  private bgColorChange(e: CustomEvent) {
    this.data!.bgColor = e.detail.value;
    this.fireChanged();
  }

  private textColorChange(e: CustomEvent) {
    this.data!.textColor = e.detail.value;
    this.fireChanged();
  }

  private halignChange(e: CustomEvent) {
    this.data!.halign = e.detail.selected;
    this.fireChanged();
  }

  private valignChange(e: CustomEvent) {
    this.data!.valign = e.detail.selected;
    this.fireChanged();
  }

  private imHAlignChange(e: CustomEvent) {
    this.data!.halignImage = e.detail.selected;
    this.fireChanged();
  }
  private imVAlignChange(e: CustomEvent) {
    this.data!.valignImage = e.detail.selected;
    this.fireChanged();
  }

  private async handleBgFile(e: CustomEvent) {
    const file: File = e.detail.file;
    if (file) {
      const image = await this.loadImage(file);
      if (image) {
        this.data!.image = image;
      } else {
        this.data!.image = undefined;
      }
      this.fireChanged();
    } else {
      this.data!.image = undefined;
      this.fireChanged();
    }
  }

  private fireChanged() {
    if (!this.pendingChange) {
      this.pendingChange = true;
      setTimeout(() => {
        this.pendingChange = false;
        fire(this, 'update', this.data);
      }, 200);
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