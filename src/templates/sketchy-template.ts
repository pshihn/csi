import { Template, SomeCanvas } from './template';
import { PageData } from '../data';
import { computeLines, renderLines, drawImage } from './template-utils';

export class SketchyTemplate implements Template {
  async draw(canvas: SomeCanvas, data: PageData): Promise<void> {
    const ctx = canvas.getContext('2d')!;
    const { width, height } = canvas;
    const thirdW = width / 3;
    const textToTheRight = data.halign === 'right';
    const padding = 20;
    const doublePadidng = 2 * padding;
    const maxWidth = (2 * thirdW) - doublePadidng;
    const lineHeight = 1.4;
    const sectionGap = 24;

    ctx.save();

    // Fill BG
    ctx.fillStyle = data.bgColor || '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw Image
    const radius = (Math.min(height, thirdW) / 2) - doublePadidng;
    const imPAdding = (thirdW - (radius * 2)) / 2;
    const imx = textToTheRight ? imPAdding : width - imPAdding - (radius * 2);
    const imy = (height - (radius * 2)) / 2;
    if (data.image) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(imx + radius, imy + radius, radius, 0, Math.PI * 2);
      ctx.clip();
      drawImage(ctx, data.image, data.halignImage, data.valignImage, imx, imy, 2 * radius, 2 * radius);
      ctx.restore();
    }

    // Tender text
    ctx.textAlign = 'center';
    const titleSize = data.fontSize * 1.2;
    const subSize = titleSize / 1.6;
    const titleFont = `normal ${titleSize}px 'Shadows Into Light Two', cursive`;
    const subFont = `300 ${subSize}px 'Shadows Into Light Two', cursive`;
    const titleLines = computeLines(ctx, data.title, maxWidth, titleFont);
    const subLines = computeLines(ctx, data.subtitle, maxWidth, subFont);
    const titleHeight = titleLines.length * titleSize * lineHeight;
    const subHeight = subLines.length * subSize * lineHeight - (0.4 * subSize);
    const contentHeight = titleHeight + subHeight + sectionGap;
    const yOffset = (height - contentHeight) / 2;
    let xOffset = padding + (maxWidth / 2);
    if (textToTheRight) {
      xOffset += thirdW;
    }

    ctx.fillStyle = data.textColor || '#000000';
    ctx.font = titleFont;
    renderLines(ctx, titleLines, maxWidth, titleSize, xOffset, yOffset);
    ctx.font = subFont;
    renderLines(ctx, subLines, maxWidth, subSize, xOffset, yOffset + titleHeight + sectionGap);

    ctx.restore();
  }
}