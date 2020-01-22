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
    fontSize: 60,
    subtitle: '',
    textColor: '#000',
    title: '',
    halign: 'center',
    valign: 'middle',
    halignImage: 'center',
    valignImage: 'middle',
    tint: false
  };
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
        background: none;
      }
      main {
        padding: 8px 8px 0;
        box-sizing: border-box;
        height: calc(100vh - 52px);
      }
      #controlsSection {
        background: var(--medium-grey);
        min-height: 100px;
        max-width: 640px;
        margin: 0 auto;
        width: 100%;
        border-radius: 10px 10px 0 0;
        box-sizing: border-box;
      }
      `
    ];
  }

  render(): TemplateResult {
    return html`
    <soso-app-shell>
      <soso-app-bar slot="toolbar">
        <soso-icon-button slot="nav" icon="menu"></soso-icon-button>
      </soso-app-bar>
      <div slot="drawer">
        <template-picker .templates="${templateList}" .selected="${this.currentTemplate}" @select="${this.onTemplateSelect}"></template-picker>
      </div>
      <main slot="main" class="vertical layout">
        <div class="flex"></div>
        <social-canvas .templateType="${this.currentTemplate}"></social-canvas>
        <div class="flex"></div>
        <div id="controlsSection">
          <control-panel .data="${this.data}" @update="${this.handleUpdate}"></control-panel>
        </div>
      </main>
    </soso-app-shell>
    `;
  }

  private handleUpdate() {
    this.canvas!.draw(this.data);
  }

  private onTemplateSelect(e: CustomEvent<TemplateInfo>) {
    this.currentTemplate = e.detail.type;
    this.handleUpdate();
  }
}
