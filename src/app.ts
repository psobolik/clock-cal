import Helpers from "./helpers.ts";
import Footer from "./footer.ts";
import Clock from "./clock.ts";
import Calendar from "./calendar.ts";

export default class App {
  canvas: HTMLCanvasElement;
  renderCtx: CanvasRenderingContext2D | null;

  footer: Footer;
  calendar: Calendar;
  clock: Clock;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderCtx = this.canvas.getContext("2d");

    this.footer = new Footer("footer");
    this.calendar = new Calendar();
    this.clock = new Clock();

    this.setSize(canvas.width);
  }

  public setSize(size: number) {
    this.canvas.width = this.canvas.height = size;

    this.calendar.setSize(size);
    this.clock.setSize(this.calendar.week.innerRadius);

    if (this.renderCtx) {
      const center = size / 2;
      this.renderCtx.translate(center, center);
      if (Helpers.isAprilFirst()) {
        this.renderCtx.rotate(Math.PI);
      }
    }
  }

  render() {
    if (this.renderCtx != null) {
      let now = new Date();
      this.calendar.render(now, this.renderCtx);
      this.clock.render(now, this.renderCtx);
      this.footer.render(now);
    }
  }
}
