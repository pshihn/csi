import { SomeCanvasContext } from '../template';

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