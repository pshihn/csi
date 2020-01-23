import { Template, SomeCanvas } from './template';
import { PageData } from '../data';
import { computeLines, renderLines, drawImage } from './template-utils';

export class AuthorTemplate implements Template {
  async draw(canvas: SomeCanvas, data: PageData): Promise<void> {
    const ctx = canvas.getContext('2d')!;
    const { width, height } = canvas;
    const thirdW = width / 3;
    const textToTheRight = data.halign === 'right';
    const padding = 20;
    const maxWidth = (2 * thirdW) - (padding * 2);
    const lineHeight = 1.4;
    const sectionGap = 24;

    ctx.save();

    // extract image color
    let imageColor = 'rgba(0,0,0,0.5)';
    let authorColor = 'white';
    if (data.image) {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(data.image, 0, 0, data.image.naturalWidth, data.image.naturalHeight, 0, 0, 1, 1);
      const imageData = ctx.getImageData(0, 0, 1, 1);
      imageColor = `rgba(${imageData.data.join(',')})`;
      const luminance = Math.sqrt((0.299 * Math.pow(imageData.data[0], 2)) + (0.587 * Math.pow(imageData.data[1], 2)) + (0.114 * Math.pow(imageData.data[2], 2)));
      if (luminance > 150) {
        authorColor = '#000';
      }
    }

    // Fill BG
    ctx.fillStyle = data.bgColor || '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = imageColor;
    if (textToTheRight) {
      ctx.fillRect(0, 0, thirdW, height);
    } else {
      ctx.fillRect(thirdW * 2, 0, thirdW, height);
    }

    // Draw Image
    const imXOffset = thirdW / 4;
    const imx = textToTheRight ? imXOffset : width - (imXOffset * 3);
    const imy = height / 4;
    if (data.image) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(imx + imXOffset, imy + imXOffset, imXOffset, 0, Math.PI * 2);
      ctx.clip();
      drawImage(ctx, data.image, data.halignImage, data.valignImage, imx, imy, 2 * imXOffset, 2 * imXOffset);
      ctx.restore();
    }

    // Tender text
    ctx.textAlign = 'center';
    const titleSize = data.fontSize;
    const subSize = titleSize / 1.6;
    const titleFont = `normal ${titleSize}px 'Raleway', sans-serif`;
    const subFont = `300 ${subSize}px sans-serif`;
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

    // render Author
    if (data.author) {
      const maxWidth = thirdW - (padding * 2);
      const authorLines = computeLines(ctx, data.author, maxWidth, subFont);
      ctx.fillStyle = authorColor;
      ctx.font = subFont;
      renderLines(ctx, authorLines, maxWidth, subSize, imx + imXOffset, imy + (2 * imXOffset) + sectionGap);
    }

    ctx.restore();
  }
}