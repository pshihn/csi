import { PageData } from './data';
import { Template, SomeCanvas, TemplateType } from './templates/template';
import { templateByType } from './templates/template-factory';

export class Renderer {
  private canvas: SomeCanvas;
  private tid?: string;
  private template: Template | null = null;

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
    if (this.template) {
      await this.template.draw(this.canvas, data);
    }
  }
}