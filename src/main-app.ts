import { LitElement, customElement, TemplateResult, html, CSSResultArray, css, property, query } from 'lit-element';
import { flex } from 'soso/bin/styles/flex';
import { PageData } from './data';
import { SocialCanvas } from './canvas';

import 'soso/bin/components/app-shell';
import 'soso/bin/components/app-bar';
import 'soso/bin/components/icon-button';
import './app-icons';
import './canvas';
import './control-panel';

@customElement('main-app')
export class MainApp extends LitElement {
  @property() private data: PageData = {
    bgColor: '#fff',
    fontSize: 54,
    subtitle: '',
    textColor: '#000',
    title: '',
    halign: 'center',
    valign: 'middle',
    halignImage: 'center',
    valignImage: 'middle'
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
      <div slot="drawer"></div>
      <main slot="main" class="vertical layout">
        <div class="flex"></div>
        <social-canvas></social-canvas>
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
}
