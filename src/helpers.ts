/*
 * Copyright (c) 2024 Paul Sobolik
 * Created 2024-04-08
 */

import Constants from "./constants.ts";

export default class Helpers {
  // static renderStringCentered(value: string, x: number, y: number, ctx: CanvasRenderingContext2D) {
  //   if (ctx) {
  //     const textMetrics = ctx.measureText(value);
  //     const dx = -textMetrics.width / 2;
  //     const dy = (textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent) / 2;
  //     ctx.fillText(value, x + dx, y + dy);
  //   }
  // }
  static renderStringCentered(value: any, x: number, y: number, ctx: CanvasRenderingContext2D) {
    if (ctx) {
      const textMetrics = ctx.measureText(value);
      const dx = -textMetrics.width / 2;
      const dy = (textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent) / 2;
      ctx.fillText(value.toString(), x + dx, y + dy);
    }
  }

  static strokeCircle(x: number, y: number, size: number, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Constants.threeHundredSixtyDegrees);
    ctx.stroke();
  }

  static fillCircle(x: number, y: number, size: number, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Constants.threeHundredSixtyDegrees);
    ctx.fill();
  }


  static renderTriangle(bottom: number, width: number, height: number, ctx: CanvasRenderingContext2D) {
    const halfWidth = width / 2;

    ctx.save();

    ctx.beginPath();

    ctx.moveTo(0, -(bottom + height));
    ctx.lineTo(halfWidth, -bottom);
    ctx.lineTo(-halfWidth, -bottom);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  static percent(n: number, percent: number): number {
    return (n * percent) / 100;
  }

  static isAprilFirst(): boolean {
    const today = new Date();
    return today.getMonth() == 3 && today.getDate() == 1;
  }
}
