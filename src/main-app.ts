import { LitElement, customElement, TemplateResult, html, CSSResultArray, css, property, query } from 'lit-element';
import { flex } from 'soso/bin/styles/flex';
import { PageData } from './data';
import { SocialCanvas } from './canvas';
import { templateList } from './templates/template-factory';
import { TemplateInfo } from './templates/template';

import 'soso/bin/components/app-shell';
import 'soso/bin/components/app-bar';
import 'soso/bin/components/icon-button';
import './app-icons';
import './canvas';
import './control-panel';
import './template-picker';

@customElement('main-app')
export class MainApp extends LitElement {
  @property() private currentTemplate = templateList[0].type;
  @property() private data: PageData = {
    bgColor: '#fff',
    fontSize: 64,
    subtitle: '',
    author: '',
    textColor: '#000',
    title: '',
    halign: 'center',
    valign: 'middle',
    halignImage: 'center',
    valignImage: 'middle',
    tint: false
  };
  @property() downloadActive = false;
  @query('#downloadLink') private downloadLink?: HTMLAnchorElement;
  @query('social-canvas') private canvas?: SocialCanvas;

  static get styles(): CSSResultArray {
    return [
      flex,
      css`
      :host {
        display: block;
        position: relative;
        --soso-drawer-overlay-bg: var(--medium-grey);
        --soso-app-drawer-border: none;
      }
      soso-app-bar {
        background: var(--dark-grey);
      }
      main {
        padding: 8px 8px 0;
        box-sizing: border-box;
        height: calc(100vh - 52px);
      }
      #controlsSection {
        min-height: 100px;
        max-width: 640px;
        margin: 0 auto;
        width: 100%;
        box-sizing: border-box;
      }
      control-panel {
        background: var(--medium-grey);
        border-radius: 10px 10px 0 0;
      }
      #downloadButton {
        background: none;
        border: none;
        color: inherit;
        outline: none;
        text-transform: uppercase;
        padding: 0 16px;
        letter-spacing: 1.25px;
        font-size: 12px;
        cursor: pointer;
      }
      a#downloadLink {
        text-decoration: none;
        outline: none;
        border: none;
        cursor: pointer;
        color: var(--highlight-blue);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }
      a#downloadLink.active {
        opacity: 1;
        pointer-events: auto;
      }
      a#githubLink {
        font-size: 12px;
        letter-spacing: 1px;
        text-decoration: none;
        color: rgb(216, 216, 216);
        text-transform: uppercase;
        padding: 12px;
        outline: none;
        cursor: pointer;
        transition: background 0.3s ease, color 0.3s ease;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
      }
      #drawer {
        position: relative;
        box-sizing: border-box;
        min-height: 100%;
        padding-bottom: 44px;
      }

      @media(hover: hover) {
        a#githubLink:hover {
          color: white;
          background: var(--border-color);
        }
      }
      `
    ];
  }

  render(): TemplateResult {
    return html`
    <soso-app-shell>
      <soso-app-bar slot="toolbar">
        <soso-icon-button slot="nav" icon="menu"></soso-icon-button>
        <a id="downloadLink" download="my-social-image.png" slot="actions" class="${this.downloadActive ? 'active' : ''}">
          <button id="downloadButton" class="horizontal layout center" @click="${this.handleDownload}">
            <soso-icon-button icon="download"></soso-icon-button>
            <span>Download</span>
          </button>
        </a>
      </soso-app-bar>
      <div id="drawer" slot="drawer">
        <template-picker .templates="${templateList}" .selected="${this.currentTemplate}" @select="${this.onTemplateSelect}"></template-picker>
        <a id="githubLink" href="https://github.com/pshihn/csi" target="_blank" rel="noopener" class="horizontal layout center">
          <span class="flex"></span>
          <span style="margin-right: 8px;">View on GitHub </span>
          <svg version="1.1" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path fill="white" fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
          <span class="flex"></span>
        </a>
      </div>
      <main slot="main" class="vertical layout">
        <div class="flex"></div>
        <social-canvas .templateType="${this.currentTemplate}"></social-canvas>
        <div class="flex"></div>
        <div id="controlsSection">
          <control-panel .templateType="${this.currentTemplate}" .data="${this.data}" @update="${this.handleUpdate}"></control-panel>
        </div>
      </main>
    </soso-app-shell>
    `;
  }

  private handleUpdate() {
    this.downloadActive = true;
    this.canvas!.draw(this.data);
  }

  private onTemplateSelect(e: CustomEvent<TemplateInfo>) {
    this.currentTemplate = e.detail.type;
    this.updateComplete.then(() => this.handleUpdate());
  }

  private handleDownload() {
    if (this.canvas && this.downloadLink) {
      this.downloadLink.href = this.canvas.getDataUrl();
    }
  }
}
