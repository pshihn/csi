import { SomeCanvasContext } from '../template';
import { HORIZ_ALIGNMENT, VERT_ALIGNMENT } from 'src/data';

export interface LineInfo {
  text: string;
  width: number;
}

export function computeLines(ctx: SomeCanvasContext, text: string, maxWidth: number, font: string): LineInfo[] {
  ctx.save();
  const words = text.split(' ').filter((d) => !!d);
  const lines: LineInfo[] = [];
  if (words.length) {
    ctx.font = font;
    let currentLine = words[0];
    let currentWidth = 0;

    const pushCurrentLine = () => lines.push({
      text: currentLine,
      width: currentWidth || ctx.measureText(currentLine).width
    });


    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
        currentWidth = width;
      } else {
        pushCurrentLine();
        currentLine = word;
        currentWidth = 0;
      }
    }
    pushCurrentLine();
  }
  ctx.restore();
  return lines;
}

export function drawImage(ctx: SomeCanvasContext, image: HTMLImageElement, halign: HORIZ_ALIGNMENT, valign: VERT_ALIGNMENT, x: number, y: number, width: number, height: number) {
  const imw = image.naturalWidth;
  const imh = image.naturalHeight;
  if (imh && imw) {
    let h = 0;
    let w = 0;
    if (imw >= imh) {
      h = height;
      w = (imw / imh) * h;
      if (w < width) {
        w = width;
        h = (imh / imw) * w;
      }
    } else {
      w = width;
      h = (imh / imw) * w;
      if (h < height) {
        h = height;
        w = (imw / imh) * h;
      }
    }
    if (h && w) {
      let sx = (imw / w) * ((w - width) / 2);
      let sy = (imh / h) * ((h - height) / 2);
      const dx = imw - 2 * sx;
      const dy = imh - 2 * sy;
      switch (halign) {
        case 'left':
          sx = 0;
          break;
        case 'right':
          sx = 2 * sx;
          break;
        case 'center':
          break;
      }
      switch (valign) {
        case 'top':
          sy = 0;
          break;
        case 'bottom':
          sy = 2 * sy;
          break;
        case 'middle':
          break;
      }
      ctx.drawImage(image, sx, sy, dx, dy, x, y, width, height);
    }
  }
}