import Helpers from "./helpers.ts";

export default class CalendarDisk {
  font: string = "";
  extent: number = 0;
  borderSize: number = 0;
  innerRadius: number = 0;
  handWidth: number = 0;
  handLength: number = 0;
  bigPipSize: number = 0;
  littlePipSize: number = 0;

  public setSize(font: string,
                 extent: number,
                 innerRadius: number,
                 bigPipSize: number,
                 littlePipSize: number,
                 borderSize: number) {
    this.font = font;
    this.extent = extent;
    this.borderSize = borderSize;
    this.innerRadius = innerRadius;
    this.bigPipSize = bigPipSize;
    this.littlePipSize = littlePipSize;
    this.handWidth = Helpers.percent(extent, 15);
    this.handLength = Helpers.percent(extent, 88);
  }

  public render(dateTime: Date, ctx: CanvasRenderingContext2D) {
    this.renderFace(dateTime, ctx);
    this.renderHand(dateTime, ctx);
  }

  public renderFace(_dateTime: Date, _ctx: CanvasRenderingContext2D) {}
  public renderHand(_dateTime: Date, _ctx: CanvasRenderingContext2D) {}
}
