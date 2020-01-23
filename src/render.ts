import { PageData } from './data';
import { Template, SomeCanvas, TemplateType } from './templates/template';
import { templateByType } from './templates/template-factory';

export class Renderer {
  private canvas: SomeCanvas;
  private tid?: string;
  private template: Template | null = null;
  private pendingData?: PageData;
  private pending = false;

  constructor(canvas: SomeCanvas) {
    this.canvas = canvas;
  }

  set templateType(value: TemplateType) {
    if (value !== this.tid) {
      this.tid = value;
      this.template = templateByType(value);
    }
  }

  async draw(data: PageData): Promise<void> {
    if (this.pending) {
      this.pendingData = data;
    } else {
      this.pending = true;
      if (this.template) {
        try {
          await this.template.draw(this.canvas, data);
        } catch (err) { console.error(err); }
      }
      this.pending = false;
      if (this.pendingData) {
        if (!!self.requestAnimationFrame) {
          self.requestAnimationFrame(() => this.draw(this.pendingData!));
        } else {
          self.setTimeout(() => this.draw(this.pendingData!));
        }
      }
    }
  }
}