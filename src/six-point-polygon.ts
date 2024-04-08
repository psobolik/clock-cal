/*
 * Copyright (c) 2024 Paul Sobolik
 * Created 2024-04-08
 */

import Point from "./point.ts";

export default class SixPointPolygon {
  bottomRight: Point;
  bottomLeft: Point;
  middleRight: Point;
  middleLeft: Point;
  topRight: Point;
  topLeft: Point;

  constructor(
    bottomRight: Point,
    bottomLeft: Point,
    middleRight: Point,
    middleLeft: Point,
    topRight: Point,
    topLeft: Point
  ) {
    this.bottomRight = bottomRight;
    this.bottomLeft = bottomLeft;
    this.middleRight = middleRight;
    this.middleLeft = middleLeft;
    this.topRight = topRight;
    this.topLeft = topLeft;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.bottomRight.x, this.bottomRight.y);
    ctx.lineTo(this.middleRight.x, this.middleRight.y);
    ctx.lineTo(this.topRight.x, this.topRight.y);
    ctx.lineTo(this.topLeft.x, this.topLeft.y);
    ctx.lineTo(this.middleLeft.x, this.middleLeft.y);
    ctx.lineTo(this.bottomLeft.x, this.bottomLeft.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}
