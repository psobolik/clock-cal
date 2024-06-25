import Constants from "./constants.ts";
import Helpers from "./helpers.ts";
import SixPointPolygon from "./six-point-polygon.ts";
import Point from "./point.ts";

export default class Clock {
  radius: number = 0;
  numeralFont: string = "";
  numeralRadius: number = 0;
  logoFont: string = "";
  logo: string = "";
  logoOffset: number = 0;
  clockPipRadius: number = 0;
  clockBigPipSize: number = 0;
  clockLittlePipSize: number = 0;
  secondHand: SixPointPolygon | undefined;
  secondHandDiscSize: number = 0;
  hourHand: SixPointPolygon | undefined;
  minuteHand: SixPointPolygon | undefined;

  public setSize(radius: number) {
    this.radius = radius;
    this.numeralFont = `${Helpers.percent(radius, 24.5)}pt Arial, sans-serif`;

    this.logoFont = `italic ${Helpers.percent(radius, 15)}pt "Brush Script MT", cursive`;
    this.logo = Helpers.isAprilFirst() ? "April Fool!" : "psobolik";
    this.logoOffset = Helpers.percent(radius, 25);

    this.numeralRadius = Helpers.percent(radius, 78);
    this.clockPipRadius = Helpers.percent(radius, 55);
    this.clockBigPipSize = Helpers.percent(radius, 2);
    this.clockLittlePipSize = Helpers.percent(radius, 1);

    const secondHandBottomHalfWidth = Helpers.percent(radius, 0.5);
    const secondHandMiddleHalfWidth = secondHandBottomHalfWidth;
    const secondHandMiddleLength = Helpers.percent(radius, 80);
    const secondHandTopLength = Helpers.percent(radius, 90);
    this.secondHand = new SixPointPolygon(
      new Point(secondHandBottomHalfWidth, 0),
      new Point(-secondHandBottomHalfWidth, 0),
      new Point(secondHandMiddleHalfWidth, -secondHandMiddleLength),
      new Point(-secondHandMiddleHalfWidth, -secondHandMiddleLength),
      new Point(0, -secondHandTopLength),
      new Point(0, -secondHandTopLength)
    )
    this.secondHandDiscSize = Helpers.percent(radius, 4);

    const minuteHandBottomHalfWidth = Helpers.percent(radius, 2);
    const minuteHandMiddleHalfWidth = Helpers.percent(radius, 4);
    const minuteHandMiddleLength = Helpers.percent(radius, 75);
    const minuteHandTopLength = Helpers.percent(radius, 88);
    this.minuteHand = new SixPointPolygon(
      new Point(minuteHandBottomHalfWidth, 0),
      new Point(-minuteHandBottomHalfWidth, 0),
      new Point(minuteHandMiddleHalfWidth, -minuteHandMiddleLength),
      new Point(-minuteHandMiddleHalfWidth, -minuteHandMiddleLength),
      new Point(0, -minuteHandTopLength),
      new Point(0, -minuteHandTopLength),
    )

    const hourHandBottomHalfWidth = Helpers.percent(radius, 2);
    const hourHandMiddleHalfWidth = Helpers.percent(radius, 5.5);
    const hourHandMiddleLength = Helpers.percent(radius, 50);
    const hourHandTopLength = Helpers.percent(radius, 65);
    this.hourHand = new SixPointPolygon(
      new Point(hourHandBottomHalfWidth, 0),
      new Point(-hourHandBottomHalfWidth, 0),
      new Point(hourHandMiddleHalfWidth, -hourHandMiddleLength),
      new Point(-hourHandMiddleHalfWidth, -hourHandMiddleLength),
      new Point(0, -hourHandTopLength),
      new Point(0, -hourHandTopLength)
    )
  }
  render(time: Date, ctx: CanvasRenderingContext2D) {
    this.renderClockFace(ctx);
    this.renderHourHand(time, ctx);
    this.renderMinuteHand(time, ctx);
    this.renderSecondHand(time, ctx);
  }

  renderClockFace(ctx: CanvasRenderingContext2D) {
    this.renderBackground(ctx);
    this.renderLogo(ctx);
    this.renderClockPips(ctx);
    this.renderNumerals(ctx);
  }

  renderBackground(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = Constants.clockDiskFill;
    Helpers.fillCircle(0, 0, this.radius, ctx);
  }
  renderClockPips(ctx: CanvasRenderingContext2D) {
    ctx.save();

    ctx.fillStyle = Constants.clockBigPipFill;

    const ticks = Constants.minutesInHour;
    for (let n = 0; n < ticks; ++n) {
      const angle = (Constants.threeHundredSixtyDegrees * n) / ticks;
      const x = this.clockPipRadius * Math.cos(angle);
      const y = this.clockPipRadius * Math.sin(angle);

      let size;
      let pip_color;
      if (n % 5 == 0) {
        size = this.clockBigPipSize;
        pip_color = Constants.clockBigPipFill;
      } else {
        size = this.clockLittlePipSize;
        pip_color = Constants.clockLittlePipFill;
      }
      ctx.fillStyle = pip_color;
      Helpers.fillCircle(x, y, size, ctx);
    }
    ctx.restore();
  }

  renderNumerals(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = Constants.clockNumeralFill;
    ctx.font = this.numeralFont;

    const ticks = Constants.hoursOnClock;
    for (let tick = 1; tick <= ticks; ++tick) {
      const angle = ((Constants.threeHundredSixtyDegrees * tick) / ticks) - Constants.ninetyDegrees;
      const x = this.numeralRadius * Math.cos(angle);
      const y = this.numeralRadius * Math.sin(angle);
      Helpers.renderStringCentered(tick, x, y, ctx);
    }
    ctx.restore();
  }

  renderLogo(ctx: CanvasRenderingContext2D) {
    ctx.save();

    ctx.fillStyle = Constants.logoColor;
    ctx.font = this.logoFont;
    Helpers.renderStringCentered(this.logo, 0, -this.logoOffset, ctx);

    ctx.restore();
  }

  renderSecondHand(time: Date, ctx: CanvasRenderingContext2D) {
    const ticks = 60;
    const tick = time.getSeconds();
    const angle = (Constants.threeHundredSixtyDegrees * tick) / ticks;

    ctx.save();

    ctx.fillStyle = Constants.secondHandColor;
    ctx.strokeStyle = Constants.secondHandColor;
    ctx.rotate(angle);

    this.secondHand?.render(ctx);

    Helpers.fillCircle(0, 0, this.secondHandDiscSize, ctx);
    ctx.restore();
  }

  renderMinuteHand(time: Date, ctx: CanvasRenderingContext2D) {
    const ticks = Constants.secondsInHour;
    const tick = time.getMinutes() * Constants.secondsInMinute + time.getSeconds();
    const angle = (Constants.threeHundredSixtyDegrees * tick) / ticks;

    ctx.save();

    ctx.fillStyle = Constants.minuteHandFill;
    ctx.strokeStyle = Constants.minuteHandStroke;

    ctx.rotate(angle);

    this.minuteHand?.render(ctx);
    ctx.restore();
  }

  renderHourHand(time: Date, ctx: CanvasRenderingContext2D) {
    const ticks = Constants.hoursOnClock * Constants.minutesInHour;
    const tick = time.getHours() * 60 + time.getMinutes();
    const angle = (Constants.threeHundredSixtyDegrees * tick) / ticks;

    ctx.save();

    ctx.fillStyle = Constants.hourHandFill;
    ctx.strokeStyle = Constants.hourHandStroke;

    ctx.rotate(angle);

    this.hourHand?.render(ctx);
    ctx.restore();
  }
}
