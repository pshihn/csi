import { PageData } from './data';

export type SomeCanvas = OffscreenCanvas | HTMLCanvasElement;
export type SomeCanvasContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

export interface Template {
  draw(canvas: SomeCanvas, data: PageData): Promise<void>;
}

export interface TemplateInfo {
  id: string;
  name: string;
  preview: string;
}