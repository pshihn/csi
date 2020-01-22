import { PageData } from '../data';

export type SomeCanvas = OffscreenCanvas | HTMLCanvasElement;
export type SomeCanvasContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

export interface Template {
  draw(canvas: SomeCanvas, data: PageData): Promise<void>;
}

export type TemplateType = 'og' | 'swyx' | 'author' | 'sketchy';

export interface TemplateInfo {
  type: TemplateType;
  name: string;
  preview: string;
}