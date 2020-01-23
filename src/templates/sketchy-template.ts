import { Template, SomeCanvas, SomeCanvasContext } from './template';
import { PageData } from '../data';
import { computeLines, renderLines, drawImage } from './template-utils';
import { rectangle, ellipse } from 'roughjs/bin/renderer';
import { ResolvedOptions, OpSet } from 'roughjs/bin/core';

export class SketchyTemplate implements Template {
  private roughOptions: ResolvedOptions = {
    maxRandomnessOffset: 2,
    roughness: 3,
    bowing: 1,
    stroke: '#000',
    strokeWidth: 5,
    curveTightness: 0,
    curveFitting: 0.95,
    curveStepCount: 9,
    fillStyle: 'hachure',
    fillWeight: -1,
    hachureAngle: -41,
    hachureGap: -1,
    dashOffset: -1,
    dashGap: -1,
    zigzagOffset: -1,
    seed: 0,
    roughnessGain: 1
  };
  private rectangleOps?: OpSet;
  private circleOps?: OpSet;
  private circleRightAligned?: boolean;

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
    const textColor = data.textColor || '#000000';

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

    // Draw sketchy bit
    if (!this.rectangleOps) {
      this.rectangleOps = rectangle(padding / 2, padding / 2, width - padding, height - padding, this.roughOptions);
    }
    ctx.save();
    ctx.strokeStyle = textColor;
    ctx.lineWidth = this.roughOptions.strokeWidth;
    this.drawOpset(ctx, this.rectangleOps!);
    if (data.image) {
      if ((textToTheRight !== this.circleRightAligned) || (!this.circleOps)) {
        this.circleRightAligned = textToTheRight;
        this.circleOps = ellipse(imx + radius, imy + radius, 2 * radius, 2 * radius, this.roughOptions);
      }
      this.drawOpset(ctx, this.circleOps!);
    }
    ctx.restore();

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

    ctx.fillStyle = textColor;
    ctx.font = titleFont;
    renderLines(ctx, titleLines, maxWidth, titleSize, xOffset, yOffset);
    ctx.font = subFont;
    renderLines(ctx, subLines, maxWidth, subSize, xOffset, yOffset + titleHeight + sectionGap);

    ctx.restore();
  }

  private drawOpset(ctx: SomeCanvasContext, drawing: OpSet) {
    ctx.beginPath();
    for (const item of drawing.ops) {
      const data = item.data;
      switch (item.op) {
        case 'move':
          ctx.moveTo(data[0], data[1]);
          break;
        case 'bcurveTo':
          ctx.bezierCurveTo(data[0], data[1], data[2], data[3], data[4], data[5]);
          break;
        case 'qcurveTo':
          ctx.quadraticCurveTo(data[0], data[1], data[2], data[3]);
          break;
        case 'lineTo':
          ctx.lineTo(data[0], data[1]);
          break;
      }
    }
    ctx.stroke();
  }
}