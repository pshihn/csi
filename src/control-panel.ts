import { LitElement, customElement, TemplateResult, html, CSSResultArray, css, property } from 'lit-element';
import { flex } from 'soso/bin/styles/flex';
import { PageData } from './data';
import { fire } from 'soso/bin/utils/ui-utils';
import { ButtonItem } from './controls/icon-button-list';
import { TemplateType } from './templates/template';

import 'soso/bin/components/switch';
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
  @property() templateType: TemplateType = 'og';
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
      soso-switch {
        --soso-switch-track-color: var(--border-color);
        --soso-highlight-color: var(--highlight-green);
      }
      .hidden {
        visibility: hidden;
      }
      .noshow {
        display: none !important;
      }
      @media (max-width: 500px) {
        .optionalShow,
        .hidden {
          display: none !important;
        }
      }
      `
    ];
  }

  render(): TemplateResult {
    if (!this.data) {
      return html``;
    }

    // TODO: better way of controling visibility
    const tintHidden = this.templateType !== 'og';
    const textHAlignItems = this.templateType !== 'og' ? [HORIZ_ITEMS[0], HORIZ_ITEMS[2]] : HORIZ_ITEMS;
    const textVAlignHidden = this.templateType !== 'og';
    const authorHidden = this.templateType !== 'author';

    return html`
    <div>
      <div class="row horizontal layout center wrap">
        <label class="right-space">Background:</label>
        <color-picker .value="${this.data.bgColor}" @change="${this.bgColorChange}"></color-picker>
        <label class="right-space" style="margin-left: 16px;">Text color:</label>
        <color-picker .value="${this.data.textColor}" @change="${this.textColorChange}"></color-picker>
        <span class="flex"></span>
        <label class="right-space ${(this.data.image && !tintHidden) ? 'optionalShow' : 'hidden'}" style="margin-left: 16px;">Tint image</label>
        <soso-switch .checked="${this.data.tint}" class="${(this.data.image && !tintHidden) ? 'optionalShow' : 'hidden'}" @change="${this.tintChange}"></soso-switch>
      </div>
      <div class="row vertical layout">
        <label>Title</label>
        <input autocomplete="off" .value="${this.data.title}" @input="${this.titleChange}">
      </div>
      <div class="row vertical layout">
        <label>Subtitle</label>
        <input autocomplete="off" .value="${this.data.subtitle}" @input="${this.subtitleChange}">
      </div>
      <div class="row vertical layout ${authorHidden ? 'noshow' : ''}">
        <label>Author</label>
        <input autocomplete="off" .value="${this.data.subtitle}" @input="${this.authorChange}">
      </div>
      <div class="row-less horizontal layout center">
        <label class="right-space">Alignment</label>
        <span class="flex"></span>
        <icon-button-list .items="${textHAlignItems}" .selected="${this.data.halign}" @change="${this.halignChange}"></icon-button-list>
        <span class="flex spacer"></span>
        <icon-button-list class="${textVAlignHidden ? 'hidden' : ''}" .items="${VERT_ITEMS}" selected="${this.data.valign}" @change="${this.valignChange}"></icon-button-list>
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

  private authorChange(e: Event) {
    this.data!.author = (e.target as HTMLInputElement).value.trim();
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
    if (this.data!.image) {
      this.fireChanged();
    }
  }
  private imVAlignChange(e: CustomEvent) {
    this.data!.valignImage = e.detail.selected;
    if (this.data!.image) {
      this.fireChanged();
    }
  }

  private tintChange(e: CustomEvent) {
    this.data!.tint = e.detail.checked;
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
    this.requestUpdate();
  }

  private fireChanged() {
    if (!this.pendingChange) {
      this.pendingChange = true;
      setTimeout(() => {
        this.pendingChange = false;
        fire(this, 'update', this.data);
      }, 16);
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