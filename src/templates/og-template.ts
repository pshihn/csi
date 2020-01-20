import { Template, SomeCanvas, SomeCanvasContext } from '../template';
import { PageData } from '../data';
import { computeLines, LineInfo } from './template-utils';

export class OGTemplate implements Template {
  async draw(canvas: SomeCanvas, data: PageData): Promise<void> {
    const ctx = canvas.getContext('2d')!;
    const { width, height } = canvas;
    const maxWidth = width - 32;
    const lineHeight = 1.4;
    const sectionGap = 10;

    ctx.save();

    // Fill background
    ctx.fillStyle = data.bgColor || '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw text
    const titleSize = data.fontSize;
    const subSize = titleSize / 1.42;
    const titleFont = `normal ${titleSize}px 'Raleway', sans-serif`;
    const subFont = `300 ${subSize}px sans-serif`;
    const titleLines = computeLines(ctx, data.title, maxWidth, titleFont);
    const subLines = computeLines(ctx, data.subtitle, maxWidth, subFont);
    const titleHeight = titleLines.length * titleSize * lineHeight;
    const subHeight = subLines.length * subSize * lineHeight - (0.4 * subSize);
    const yOffset = (height - (titleHeight + subHeight + sectionGap)) / 2;

    console.log(titleLines);

    ctx.fillStyle = data.textColor || '#000000';
    ctx.font = titleFont;
    this.renderLines(ctx, titleLines, maxWidth, titleSize, 16, yOffset);
    ctx.font = subFont;
    this.renderLines(ctx, subLines, maxWidth, subSize, 16, yOffset + titleHeight + sectionGap);

    ctx.restore();
  }

  private renderLines(ctx: SomeCanvasContext, lines: LineInfo[], maxWidth: number, fontSize: number, xOffset: number, yOffset: number) {
    for (let i = 0; i < lines.length; i++) {
      const y = (i * fontSize * 1.4) + fontSize + yOffset;
      ctx.fillText(lines[i].text, xOffset, y, maxWidth);
    }
  }
}