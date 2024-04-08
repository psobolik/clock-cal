import DateUtil from "./dateutil.ts";
import Constants from "./constants.ts";
import Helpers from "./helpers.ts";
import SixPointPolygon from "./six-point-polygon.ts";
import Point from "./point.ts";

let g_clock: Clock | null = null;

window.addEventListener("DOMContentLoaded", () => {
  init();
});

let timeout = 0;
window.addEventListener('resize', function () {
  const delay = 50;

  // Only resize some time after the last resize event
  // https://web.archive.org/web/20220714020647/https://bencentra.com/code/2015/02/27/optimizing-window-resize.html
  clearTimeout(timeout);
  timeout = setTimeout(resize, delay);
});

function init() {
  let canvas = document.querySelector("#canvas") as HTMLCanvasElement;
  g_clock = new Clock(canvas);
  run();

  function run() {
    g_clock?.render();
    requestAnimationFrame(run);
  }
}

function resize() {
  const maxDim = 400;

  if (g_clock) {
    let dim = Math.max(maxDim, Math.min(window.innerWidth, window.innerHeight));
    g_clock.canvas.width = g_clock.canvas.height = dim - 100;
  }
  init();
}

class Clock {
  monthBigPipSize: number;
  monthLittlePipSize: number;
  dayBigPipSize: number;
  dayLittlePipSize: number;
  clockBigPipSize: number;
  clockLittlePipSize: number;

  borderSize: number;
  dayFaceSize: number;
  monthFaceSize: number;

  numeralFont: string;
  logoFont: string;
  monthFont: string;
  dayFont: string;

  canvas: HTMLCanvasElement;
  renderCtx: CanvasRenderingContext2D | null;
  canvasWidth: number;
  canvasHeight: number;
  canvasCenterX: number;
  canvasCenterY: number;
  diameter: number;
  canvasRadius: number;

  monthRadius: number;
  dayRadius: number;
  clockRadius: number;
  pipRadius: number;
  numeralRadius: number;

  monthHandLength: number;
  monthHandWidth: number;
  dayHandLength: number;
  dayHandWidth: number;

  secondHandDiscSize: number;
  secondHand: SixPointPolygon;
  minuteHand: SixPointPolygon;
  hourHand: SixPointPolygon;

  logo: string;
  logoOffset: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;
    this.canvasCenterX = this.canvas.width / 2;
    this.canvasCenterY = this.canvas.height / 2;

    this.diameter = Math.min(this.canvasWidth, this.canvasHeight);
    this.canvasRadius = this.diameter / 2;
    this.borderSize = Helpers.percent(this.canvasWidth, 1.5);

    this.monthFaceSize = Helpers.percent(this.canvasHeight, 10);
    this.monthRadius = this.canvasRadius - this.monthFaceSize;
    this.monthHandLength = Helpers.percent(this.canvasRadius - this.monthRadius, 75);
    this.monthHandWidth = Helpers.percent(this.monthRadius, 3.5);
    this.monthBigPipSize = Helpers.percent(this.canvasRadius, 0.95);
    this.monthLittlePipSize = Helpers.percent(this.canvasRadius, 0.25);

    this.dayFaceSize = Helpers.percent(this.canvasHeight, 10);
    this.dayRadius = this.monthRadius - this.dayFaceSize;
    this.dayHandLength = this.monthHandLength;
    this.dayHandWidth = this.monthHandWidth;
    this.dayBigPipSize = Helpers.percent(this.canvasRadius, 0.99);
    this.dayLittlePipSize = Helpers.percent(this.canvasRadius, 0.5);

    this.clockRadius = this.dayRadius;
    this.numeralRadius = Helpers.percent(this.clockRadius, 78);
    this.pipRadius = Helpers.percent(this.clockRadius, 55);
    this.clockBigPipSize = Helpers.percent(this.canvasRadius, .99);
    this.clockLittlePipSize = Helpers.percent(this.canvasRadius, .55);

    const secondHandBottomHalfWidth = Helpers.percent(this.clockRadius, 0.5);
    const secondHandMiddleHalfWidth = secondHandBottomHalfWidth;
    const secondHandMiddleLength = Helpers.percent(this.clockRadius, 80);
    const secondHandTopLength = Helpers.percent(this.clockRadius, 90);
    this.secondHand = new SixPointPolygon(
      new Point(secondHandBottomHalfWidth, 0),
      new Point(-secondHandBottomHalfWidth, 0),
      new Point(secondHandMiddleHalfWidth, -secondHandMiddleLength),
      new Point(-secondHandMiddleHalfWidth, -secondHandMiddleLength),
      new Point(0, -secondHandTopLength),
      new Point(0, -secondHandTopLength)
    )
    this.secondHandDiscSize = Helpers.percent(this.clockRadius, 4);

    const minuteHandBottomHalfWidth = Helpers.percent(this.clockRadius, 2);
    const minuteHandMiddleHalfWidth = Helpers.percent(this.clockRadius, 4);
    const minuteHandMiddleLength = Helpers.percent(this.clockRadius, 75);
    const minuteHandTopLength = Helpers.percent(this.clockRadius, 88);
    this.minuteHand = new SixPointPolygon(
      new Point(minuteHandBottomHalfWidth, 0),
      new Point(-minuteHandBottomHalfWidth, 0),
      new Point(minuteHandMiddleHalfWidth, -minuteHandMiddleLength),
      new Point(-minuteHandMiddleHalfWidth, -minuteHandMiddleLength),
      new Point(0, -minuteHandTopLength),
      new Point(0, -minuteHandTopLength),
    )

    const hourHandBottomHalfWidth = Helpers.percent(this.clockRadius, 2);
    const hourHandMiddleHalfWidth = Helpers.percent(this.clockRadius, 5.5);
    const hourHandMiddleLength = Helpers.percent(this.clockRadius, 50);
    const hourHandTopLength = Helpers.percent(this.clockRadius, 65);
    this.hourHand = new SixPointPolygon(
      new Point(hourHandBottomHalfWidth, 0),
      new Point(-hourHandBottomHalfWidth, 0),
      new Point(hourHandMiddleHalfWidth, -hourHandMiddleLength),
      new Point(-hourHandMiddleHalfWidth, -hourHandMiddleLength),
      new Point(0, -hourHandTopLength),
      new Point(0, -hourHandTopLength)
    )

    this.numeralFont = `${this.diameter / 14}pt Arial, sans-serif`;
    this.logoFont = `italic ${this.diameter / 32}pt "Brush Script MT", cursive`;
    this.dayFont = `bold ${this.diameter / 50}pt Arial, sans-serif`;
    this.monthFont = `bold ${this.diameter / 65}pt Arial, sans-serif`;

    this.logo = "psobolik";
    this.logoOffset = Helpers.percent(this.clockRadius, 30);

    this.renderCtx = this.canvas.getContext("2d");
    if (this.renderCtx) {
      this.renderCtx.translate(this.canvasCenterX, this.canvasCenterY);
      if (Helpers.isAprilFirst()) {
        this.renderCtx.rotate(Math.PI);
        this.logo = "April Fool!";
      }
    }
  }

  render() {
    if (this.renderCtx != null) {
      this.renderFace(this.renderCtx);
      // for (let day = 1; day <= 31; ++day) {
      //   let now = new Date(2000, 0, day);
      //   this.renderClock(now, this.renderCtx);
      //   this.renderCalendar(now, this.renderCtx);
      // }
      // for (let month = 0; month <= 11; ++month) {
      //   let now = new Date(2000, month, 1);
      //   this.renderClock(now, this.renderCtx);
      //   this.renderCalendar(now, this.renderCtx);
      // }
      let now = new Date();
      this.renderClock(now, this.renderCtx);
      this.renderCalendar(now, this.renderCtx);
      this.renderFooter(now);
    }
  }

  renderClock(time: Date, ctx: CanvasRenderingContext2D) {
    this.renderClockFace(ctx);
    this.renderHourHand(time, ctx);
    this.renderMinuteHand(time, ctx);
    this.renderSecondHand(time, ctx);
  }

  renderCalendar(dateTime: Date, ctx: CanvasRenderingContext2D) {
    this.renderDayHand(dateTime, ctx);
    this.renderDayFace(dateTime, ctx);
    this.renderMonthHand(dateTime, ctx);
    this.renderMonthFace(dateTime, ctx);
  }

  renderMonthHand(dateTime: Date, ctx: CanvasRenderingContext2D) {
    const ticks = DateUtil.daysInYear(dateTime);
    const month = (DateUtil.daysInYearToDate(dateTime) - 1);
    const angle = (Constants.threeHundredSixtyDegrees * month) / ticks;

    ctx.save();

    ctx.fillStyle = Constants.monthHandFill;
    ctx.strokeStyle = Constants.monthHandStroke;
    ctx.rotate(angle);

    Helpers.renderTriangle(this.monthRadius, this.monthHandWidth, this.monthHandLength, ctx);
    ctx.restore();
  }

  renderDayHand(dateTime: Date, ctx: CanvasRenderingContext2D) {
    const ticks = DateUtil.daysInMonth(dateTime) * Constants.hoursInDay;
    const tick = ((dateTime.getDate() - 1) * Constants.hoursInDay) + dateTime.getHours();
    const angle = (Constants.threeHundredSixtyDegrees * tick) / ticks;

    ctx.save();

    ctx.fillStyle = Constants.dayHandFill;
    ctx.strokeStyle = Constants.dayHandStroke;
    ctx.rotate(angle);

    Helpers.renderTriangle(this.dayRadius, this.monthHandWidth, this.monthHandLength, ctx);

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

    this.secondHand.render(ctx);

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

    this.minuteHand.render(ctx);
    ctx.restore();
  }

  renderHourHand(time: Date, ctx: CanvasRenderingContext2D) {
    const ticks = 720; // 12 * 60
    const tick = time.getHours() * 60 + time.getMinutes();
    const angle = (Constants.threeHundredSixtyDegrees * tick) / ticks;

    ctx.save();

    ctx.fillStyle = Constants.hourHandFill;
    ctx.strokeStyle = Constants.hourHandStroke;

    ctx.rotate(angle);

    this.hourHand.render(ctx);
    ctx.restore();
  }

  renderFooter(time: Date) {
    let footer = document.querySelector("footer") as HTMLElement;
    footer.innerText = time.toLocaleString();
  }

  renderFace(ctx: CanvasRenderingContext2D) {
    ctx.save();

    ctx.fillStyle = Constants.monthDiskFill;
    Helpers.fillCircle(0, 0, this.canvasRadius, ctx);

    ctx.fillStyle = Constants.dayDiskFill;
    Helpers.fillCircle(0, 0, this.monthRadius, ctx);

    ctx.fillStyle = Constants.clockDiskFill;
    Helpers.fillCircle(0, 0, this.dayRadius, ctx);

    ctx.lineWidth = this.borderSize;
    ctx.strokeStyle = Constants.canvasBorderColor;
    Helpers.strokeCircle(0, 0, this.canvasRadius - (this.borderSize / 2) + 1, ctx);

    ctx.restore();
  }

  renderClockFace(ctx: CanvasRenderingContext2D) {
    this.renderLogo(ctx);
    this.renderClockPips(ctx);
    this.renderNumerals(ctx);
  }

  renderMonthFace(dateTime: Date, ctx: CanvasRenderingContext2D) {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const daysPerMonth = [];
    let ticks = 0;
    let dt = new Date(dateTime.getFullYear(), 0, 1);
    for (let n = 0; n < months.length; ++n) {
      dt.setMonth(n);
      const daysInMonth = DateUtil.daysInMonth(dt);
      ticks += daysInMonth;
      daysPerMonth.push(daysInMonth);
    }
    const labelDistance = (this.monthRadius + (this.monthFaceSize / 1.8));
    const pipDistance = (this.monthRadius + (this.monthFaceSize / 4.5));

    ctx.save();

    ctx.lineWidth = this.borderSize;
    ctx.strokeStyle = Constants.monthBorderColor;
    Helpers.strokeCircle(0, 0, this.monthRadius, ctx);

    ctx.fillStyle = Constants.monthPipColor;
    ctx.font = this.monthFont;

    let dayOfYear = 0;
    for (let month = 0; month < months.length; ++month) {
      for (let day = 0; day < daysPerMonth[month]; ++day) {
        const tick = dayOfYear++;
        const angle = ((Constants.threeHundredSixtyDegrees * tick) / ticks) - Constants.ninetyDegrees;
        const xPip = pipDistance * Math.cos(angle);
        const yPip = pipDistance * Math.sin(angle);

        ctx.save();
        if (day == 0) {
          Helpers.fillCircle(xPip, yPip, this.monthBigPipSize, ctx);
          const xLabel = labelDistance * Math.cos(angle);
          const yLabel = labelDistance * Math.sin(angle);
          ctx.translate(xLabel, yLabel);
          let label = months[month];
          if (month == 0) label += ` ${dateTime.getFullYear().toString()}`;
          Helpers.renderStringCentered(label, 0, 0, ctx);
        } else {
          Helpers.fillCircle(xPip, yPip, this.monthLittlePipSize, ctx);
        }
        ctx.restore();
      }
    }
    ctx.restore();
  }

  renderDayFace(dateTime: Date, ctx: CanvasRenderingContext2D) {
    const daysInCurrentMonth = DateUtil.daysInMonth(dateTime);

    const ticks = daysInCurrentMonth * 4;
    const pipDistance = this.dayRadius + this.dayFaceSize / 3.5;
    const labelDistance = this.dayRadius + this.dayFaceSize / 1.6;

    ctx.save();

    ctx.lineWidth = this.borderSize;
    ctx.strokeStyle = Constants.dayBorderColor;
    Helpers.strokeCircle(0, 0, this.dayRadius, ctx);

    ctx.fillStyle = Constants.dayPipColor;
    ctx.font = this.dayFont;

    for (let tick = 0; tick < ticks; ++tick) {
      const angle = (Constants.threeHundredSixtyDegrees * tick) / ticks - Constants.ninetyDegrees;
      const xPip = pipDistance * Math.cos(angle);
      const yPip = pipDistance * Math.sin(angle);

      ctx.save();

      if (tick % 4) {
        Helpers.fillCircle(xPip, yPip, this.dayLittlePipSize, ctx);
      } else {
        Helpers.fillCircle(xPip, yPip, this.dayBigPipSize, ctx);
        const xLabel = labelDistance * Math.cos(angle);
        const yLabel = labelDistance * Math.sin(angle);
        ctx.translate(xLabel, yLabel);
        const date = Math.floor(tick / 4) + 1;
        Helpers.renderStringCentered(date, 0, 0, ctx);
      }
      ctx.restore();
    }
    ctx.restore();
  }

  renderClockPips(ctx: CanvasRenderingContext2D) {
    ctx.save();

    ctx.fillStyle = Constants.clockBigPipFill;

    const ticks = Constants.minutesInHour;
    for (let n = 0; n < ticks; ++n) {
      const angle = (Constants.threeHundredSixtyDegrees * n) / ticks;
      const x = this.pipRadius * Math.cos(angle);
      const y = this.pipRadius * Math.sin(angle);

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

    const ticks = 12;
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
}
