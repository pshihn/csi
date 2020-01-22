import { Template, SomeCanvas } from './template';
import { PageData } from '../data';
import { computeLines, renderLines, drawImage } from './template-utils';

export class SwyxTemplate implements Template {
  async draw(canvas: SomeCanvas, data: PageData): Promise<void> {
    const ctx = canvas.getContext('2d')!;
    const { width, height } = canvas;
    const halfW = width / 2;
    const imageBleed = Math.tan(Math.PI / 12) * height / 2;
    const textToTheRight = data.halign === 'right';

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // draw image
    if (data.image) {
      drawImage(ctx, data.image, data.halignImage, data.valignImage, textToTheRight ? 0 : halfW - imageBleed, 0, halfW + imageBleed, height);
    }

    // Fill remaining background
    ctx.fillStyle = data.bgColor || '#ffffff';
    ctx.beginPath();
    if (textToTheRight) {
      ctx.moveTo(width, 0);
      ctx.lineTo(halfW - imageBleed, 0);
      ctx.lineTo(halfW + imageBleed, height);
      ctx.lineTo(width, height);
      ctx.lineTo(width, 0);
    } else {
      ctx.moveTo(0, 0);
      ctx.lineTo(halfW + imageBleed, 0);
      ctx.lineTo(halfW - imageBleed, height);
      ctx.lineTo(0, height);
      ctx.lineTo(0, 0);
    }
    ctx.closePath();
    ctx.fill();

    // initialize text metrics
    const titleSize = data.fontSize;
    const subSize = titleSize / 1.6;
    const padding = 20;
    const lineHeight = 1.4;
    const titleFont = `normal ${titleSize}px 'Raleway', sans-serif`;
    const subFont = `300 ${subSize}px sans-serif`;
    ctx.fillStyle = data.textColor || '#000000';
    ctx.textAlign = textToTheRight ? 'right' : 'left';

    // subtitle
    let maxWidth = halfW - imageBleed - (2 * padding);
    const subLines = computeLines(ctx, data.subtitle, maxWidth, subFont);
    const subHeight = subLines.length * subSize * lineHeight + padding;
    ctx.font = subFont;
    renderLines(ctx, subLines, maxWidth, subSize, textToTheRight ? (width - padding) : padding, height - subHeight);

    // title
    const extraW = subHeight * Math.tan(Math.PI / 12);
    console.log(subHeight, extraW);
    maxWidth += extraW;
    const titleLines = computeLines(ctx, data.title, maxWidth, titleFont);
    const heightAvailable = height - subHeight - padding;
    const titleHeight = titleLines.length * titleSize * lineHeight;
    ctx.font = titleFont;
    renderLines(ctx, titleLines, maxWidth, titleSize, textToTheRight ? (width - padding) : padding, (heightAvailable - titleHeight) / 2);

    ctx.restore();
  }
}