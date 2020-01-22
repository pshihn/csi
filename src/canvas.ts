import { LitElement, customElement, TemplateResult, html, css, CSSResult, query } from 'lit-element';
import { PageData } from './data';
import { Renderer } from './render';
import { TemplateType } from './templates/template';

const WIDTH = 1280;
const HEIGHT = 669;

@customElement('social-canvas')
export class SocialCanvas extends LitElement {
  @query('canvas') private canvas?: HTMLCanvasElement;

  private renderer?: Renderer;
  private currentTemplate: TemplateType = 'og';

  set templateType(value: TemplateType) {
    this.currentTemplate = value;
    if (this.renderer) {
      this.renderer.templateType = value;
    }
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
      }
      canvas {
        display: block;
        box-sizing: border-box;
        margin: 0 auto;
        background: white;
        box-shadow: 0 11px 15px -7px rgba(0,0,0,.2), 0 24px 38px 3px rgba(0,0,0,.14), 0 9px 46px 8px rgba(0,0,0,.12);
        max-width: 800px;
        width: 100%;
      }
      `;
  }

  render(): TemplateResult {
    return html`
    <canvas width="${WIDTH}" height="${HEIGHT}"></canvas>
    `;
  }

  async draw(data: PageData): Promise<void> {
    if (this.canvas) {
      if (!this.renderer) {
        this.renderer = new Renderer(this.canvas.transferControlToOffscreen());
        this.renderer.templateType = this.currentTemplate;
      }
      await this.renderer.draw(data);
    }
  }
}