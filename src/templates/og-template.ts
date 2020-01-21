import { Template, SomeCanvas, SomeCanvasContext } from '../template';
import { PageData } from '../data';
import { computeLines, LineInfo, drawImage } from './template-utils';

export class OGTemplate implements Template {
  async draw(canvas: SomeCanvas, data: PageData): Promise<void> {
    const ctx = canvas.getContext('2d')!;
    const { width, height } = canvas;
    const padding = 16;
    let maxWidth = width - (padding * 2);
    const lineHeight = 1.4;
    const sectionGap = 10;

    ctx.save();

    // compute x-offset
    let xOffset = padding;
    switch (data.halign) {
      case 'left':
        maxWidth = maxWidth / 2;
        ctx.textAlign = 'left';
        break;
      case 'right':
        ctx.textAlign = 'right';
        xOffset += maxWidth;
        maxWidth = maxWidth / 2;
        break;
      default:
        ctx.textAlign = 'center';
        xOffset += maxWidth / 2;
        break;
    }

    // Fill background
    ctx.fillStyle = data.bgColor || '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // draw background image
    if (data.image) {
      drawImage(ctx, data.image, 0, 0, width, height);
    }

    // Draw text
    const titleSize = data.fontSize;
    const subSize = titleSize / 1.42;
    const titleFont = `normal ${titleSize}px 'Raleway', sans-serif`;
    const subFont = `300 ${subSize}px sans-serif`;
    const titleLines = computeLines(ctx, data.title, maxWidth, titleFont);
    const subLines = computeLines(ctx, data.subtitle, maxWidth, subFont);
    const titleHeight = titleLines.length * titleSize * lineHeight;
    const subHeight = subLines.length * subSize * lineHeight - (0.4 * subSize);
    const contentHeight = titleHeight + subHeight + sectionGap;

    // compute y-offset for text
    let yOffset = 0;
    switch (data.valign) {
      case 'top':
        yOffset = 1.5 * padding;
        break;
      case 'bottom':
        yOffset = (height - contentHeight - (padding * 2));
        break;
      default:
        yOffset = (height - contentHeight) / 2;
        break;
    }



    ctx.fillStyle = data.textColor || '#000000';
    ctx.font = titleFont;
    this.renderLines(ctx, titleLines, maxWidth, titleSize, xOffset, yOffset);
    ctx.font = subFont;
    this.renderLines(ctx, subLines, maxWidth, subSize, xOffset, yOffset + titleHeight + sectionGap);

    ctx.restore();
  }

  private renderLines(ctx: SomeCanvasContext, lines: LineInfo[], maxWidth: number, fontSize: number, xOffset: number, yOffset: number) {
    for (let i = 0; i < lines.length; i++) {
      const y = (i * fontSize * 1.4) + fontSize + yOffset;
      ctx.fillText(lines[i].text, xOffset, y, maxWidth);
    }
  }
}