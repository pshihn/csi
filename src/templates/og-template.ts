import { Template, SomeCanvas } from './template';
import { PageData } from '../data';
import { computeLines, renderLines, drawImage } from './template-utils';

export class OGTemplate implements Template {
  async draw(canvas: SomeCanvas, data: PageData): Promise<void> {
    const ctx = canvas.getContext('2d')!;
    const { width, height } = canvas;
    const padding = 20;
    let maxWidth = width - (padding * 2);
    const lineHeight = 1.4;
    const sectionGap = 24;

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
      drawImage(ctx, data.image, data.halignImage, data.valignImage, 0, 0, width, height);
    }

    // Tint
    if (data.tint && data.bgColor) {
      ctx.fillStyle = data.bgColor;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;
    }

    // Compute text metrics
    const titleSize = data.fontSize;
    const subSize = titleSize / 1.6;
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

    // Render text
    ctx.fillStyle = data.textColor || '#000000';
    ctx.font = titleFont;
    renderLines(ctx, titleLines, maxWidth, titleSize, xOffset, yOffset);
    ctx.font = subFont;
    renderLines(ctx, subLines, maxWidth, subSize, xOffset, yOffset + titleHeight + sectionGap);

    ctx.restore();
  }
}