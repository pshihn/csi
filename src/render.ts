import { PageData } from './data';
import { Template, SomeCanvas } from './template';
import { templateById } from './templates/template-factory';

export class Renderer {
  private canvas: SomeCanvas;
  private tid?: string;
  private template: Template | null = null;

  constructor(canvas: SomeCanvas) {
    this.canvas = canvas;
  }

  set templateId(value: string) {
    if (value !== this.tid) {
      this.tid = value;
      this.template = templateById(value);
    }
  }


  async draw(data: PageData): Promise<void> {
    if (this.template) {
      await this.template.draw(this.canvas, data);
    }
  }
}