import DateUtil from "./dateutil.ts";

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

class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class ClockHandPoints {
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
}

class Clock {
  canvasBorderColor = "#1122aa";

  monthDiskFill = "#eeeeff";
  monthBorderColor = "#2121ad";
  monthPipColor = "#000049";
  monthHandFill = "#2121ad88";
  monthHandStroke = "#2121ad";

  dayDiskFill = "#ffeeee";
  dayBorderColor = "#540000";
  dayPipColor = "#540000";
  dayHandFill = "#54000088";
  dayHandStroke = "#540000";

  clockDiskFill = "#ecedf1";
  clockNumeralFill = "#010a1a";
  clockLittlePipFill = "#aa4444";
  clockBigPipFill = "#ff4488";

  secondHandColor = "#ff0000";
  minuteHandFill = "#125";
  minuteHandStroke = "#7b7bda";
  hourHandFill = "#125"
  hourHandStroke = "#7b7bda"
  logoColor = "#012b69";

  circleInRadians = Math.PI * 2;

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

  secondHandDiscSize: number;
  secondHandPoints: ClockHandPoints;
  minuteHandPoints: ClockHandPoints;
  hourHandPoints: ClockHandPoints;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;
    this.canvasCenterX = this.canvas.width / 2;
    this.canvasCenterY = this.canvas.height / 2;

    this.borderSize = (this.canvasHeight * 1.5) / 100;
    this.diameter = Math.min(this.canvasWidth, this.canvasHeight);
    this.canvasRadius = this.diameter / 2;

    this.monthFaceSize = (this.canvasHeight * 10) / 100;
    this.monthRadius = this.canvasRadius - this.monthFaceSize;
    this.monthBigPipSize = (this.canvasRadius * 0.95) / 100;
    this.monthLittlePipSize = (this.canvasRadius * 0.25) / 100;

    this.dayFaceSize = (this.canvasHeight * 10) / 100;
    this.dayRadius = this.monthRadius - this.dayFaceSize;
    this.dayBigPipSize = (this.canvasRadius * 0.99) / 100;
    this.dayLittlePipSize = (this.canvasRadius * 0.5) / 100;

    this.clockRadius = this.dayRadius;
    this.numeralRadius = (this.clockRadius * 78) / 100;
    this.pipRadius = (this.clockRadius * 55) / 100;
    this.clockBigPipSize = (this.canvasRadius * .99) / 100;
    this.clockLittlePipSize = (this.canvasRadius * .55) / 100;


    const secondHandBottomHalfWidth = (this.clockRadius * 0.5) / 100;
    const secondHandMiddleHalfWidth = secondHandBottomHalfWidth;
    const secondHandMiddleLength = (this.clockRadius * 80) / 100;
    const secondHandTopLength = (this.clockRadius * 90) / 100;
    this.secondHandPoints = new ClockHandPoints(
      new Point(secondHandBottomHalfWidth, 0),
      new Point(-secondHandBottomHalfWidth, 0),
      new Point(secondHandMiddleHalfWidth, -secondHandMiddleLength),
      new Point(-secondHandMiddleHalfWidth, -secondHandMiddleLength),
      new Point(0, -secondHandTopLength),
      new Point(0, -secondHandTopLength)
    )
    this.secondHandDiscSize = (this.clockRadius * 4) / 100;

    const minuteHandBottomHalfWidth = (this.clockRadius * 2) / 100;
    const minuteHandMiddleHalfWidth = (this.clockRadius * 4) / 100;
    const minuteHandMiddleLength = (this.clockRadius * 75) / 100;
    const minuteHandTopLength = (this.clockRadius * 88) / 100;
    this.minuteHandPoints = new ClockHandPoints(
      new Point(minuteHandBottomHalfWidth, 0),
      new Point(-minuteHandBottomHalfWidth, 0),
      new Point(minuteHandMiddleHalfWidth, -minuteHandMiddleLength),
      new Point(-minuteHandMiddleHalfWidth, -minuteHandMiddleLength),
      new Point(0, -minuteHandTopLength),
      new Point(0, -minuteHandTopLength),
    )

    const hourHandBottomHalfWidth = (this.clockRadius * 2) / 100;
    const hourHandMiddleHalfWidth = (this.clockRadius * 5.5) / 100;
    const hourHandMiddleLength = (this.clockRadius * 50) / 100;
    const hourHandTopLength = (this.clockRadius * 65) / 100;
    this.hourHandPoints = new ClockHandPoints(
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

    this.renderCtx = this.canvas.getContext("2d");
    if (this.renderCtx) this.renderCtx.translate(this.canvasCenterX, this.canvasCenterY);
  }

  render() {
    if (this.renderCtx != null) {
      // this.clearCanvas(this.renderCtx);
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

  renderCalendarHand(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  renderMonthHand(dateTime: Date, ctx: CanvasRenderingContext2D) {
    const ticks = DateUtil.daysInYear(dateTime);
    const adjust = DateUtil.daysInYearToDate(new Date(dateTime.getFullYear(), 3, 1));
    const month = (DateUtil.daysInYearToDate(dateTime) - adjust) % ticks;
    const angle = (this.circleInRadians * month) / ticks;

    const bottom = this.monthRadius;
    const bl_x = bottom * Math.cos(angle + .015);
    const bl_y = bottom * Math.sin(angle + .015);
    const br_x = bottom * Math.cos(angle - .015);
    const br_y = bottom * Math.sin(angle - .015);

    const top = bottom + ((this.monthFaceSize * 3) / 4);
    const t_x = top * Math.cos(angle);
    const t_y = top * Math.sin(angle);

    ctx.save();

    ctx.fillStyle = this.monthHandFill;
    ctx.strokeStyle = this.monthHandStroke;

    this.renderCalendarHand(ctx, t_x, t_y, bl_x, bl_y, br_x, br_y);

    ctx.restore();
  }

  renderDayHand(dateTime: Date, ctx: CanvasRenderingContext2D) {
    const hoursInDay = 24;
    const ticks = DateUtil.daysInMonth(dateTime) * hoursInDay;
    const adjust = ticks / 4;

    let dateHour = ((dateTime.getDate() - 1) * hoursInDay) + dateTime.getHours();
    dateHour = ((dateHour - adjust) % ticks);
    const angle = (this.circleInRadians * dateHour) / ticks;

    const bottom = this.dayRadius;
    const bl_x = bottom * Math.cos(angle + .02);
    const bl_y = bottom * Math.sin(angle + .02);
    const br_x = bottom * Math.cos(angle - .02);
    const br_y = bottom * Math.sin(angle - .02);

    const top = bottom + ((this.dayFaceSize * 3) / 4);
    const t_x = top * Math.cos(angle);
    const t_y = top * Math.sin(angle);

    ctx.save();

    ctx.fillStyle = this.dayHandFill;
    ctx.strokeStyle = this.dayHandStroke;

    this.renderCalendarHand(ctx, t_x, t_y, bl_x, bl_y, br_x, br_y);

    ctx.restore();
  }

  renderClockHand(points: ClockHandPoints, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(points.bottomRight.x, points.bottomRight.y);
    ctx.lineTo(points.middleRight.x, points.middleRight.y);
    ctx.lineTo(points.topRight.x, points.topRight.y);
    ctx.lineTo(points.topLeft.x, points.topLeft.y);
    ctx.lineTo(points.middleLeft.x, points.middleLeft.y);
    ctx.lineTo(points.bottomLeft.x, points.bottomLeft.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  renderSecondHand(time: Date, ctx: CanvasRenderingContext2D) {
    const ticks = 60;
    const tick = time.getSeconds();
    const angle = (this.circleInRadians * tick) / ticks;

    ctx.save();

    ctx.fillStyle = this.secondHandColor;
    ctx.strokeStyle = this.secondHandColor;
    ctx.rotate(angle);

    this.renderClockHand(this.secondHandPoints, ctx);

    this.fillCircle(ctx, 0, 0, this.secondHandDiscSize);
    ctx.restore();
  }

  renderMinuteHand(time: Date, ctx: CanvasRenderingContext2D) {
    const ticks = 3600; // 60 * 60
    const tick = time.getMinutes() * 60 + time.getSeconds();
    const angle = (this.circleInRadians * tick) / ticks;

    ctx.save();

    ctx.fillStyle = this.minuteHandFill;
    ctx.strokeStyle = this.minuteHandStroke;

    ctx.rotate(angle);

    this.renderClockHand(this.minuteHandPoints, ctx);
    ctx.restore();
  }

  renderHourHand(time: Date, ctx: CanvasRenderingContext2D) {
    const ticks = 720; // 12 * 60
    const tick = time.getHours() * 60 + time.getMinutes();
    const angle = (this.circleInRadians * tick) / ticks;

    ctx.save();

    ctx.fillStyle = this.hourHandFill;
    ctx.strokeStyle = this.hourHandStroke;

    ctx.rotate(angle);

    this.renderClockHand(this.hourHandPoints, ctx);
    ctx.restore();
  }

  renderFooter(time: Date) {
    let footer = document.querySelector("footer") as HTMLElement;
    footer.innerText = time.toLocaleString();
  }

  renderFace(ctx: CanvasRenderingContext2D) {
    ctx.save();

    ctx.fillStyle = this.monthDiskFill;
    this.fillCircle(ctx, 0, 0, this.canvasRadius);

    ctx.fillStyle = this.dayDiskFill;
    this.fillCircle(ctx, 0, 0, this.monthRadius);

    ctx.fillStyle = this.clockDiskFill;
    this.fillCircle(ctx, 0, 0, this.dayRadius);

    ctx.lineWidth = this.borderSize;
    ctx.strokeStyle = this.canvasBorderColor;
    this.strokeCircle(ctx, 0, 0, this.canvasRadius - (this.borderSize / 2) + 1);

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
    const adjust = DateUtil.daysInYearToDate(new Date(dateTime.getFullYear(), 3, 1));
    const labelDistance = (this.monthRadius + (this.monthFaceSize / 1.8));
    const pipDistance = (this.monthRadius + (this.monthFaceSize / 4.5));

    ctx.save();

    ctx.lineWidth = this.borderSize;
    ctx.strokeStyle = this.monthBorderColor;
    this.strokeCircle(ctx, 0, 0, this.monthRadius);

    ctx.fillStyle = this.monthPipColor;
    ctx.font = this.monthFont;

    let dayOfYear = 0;
    for (let month = 0; month < months.length; ++month) {
      for (let day = 0; day < daysPerMonth[month]; ++day) {
        const tick = (++dayOfYear - adjust) % ticks;
        const angle = (this.circleInRadians * tick) / ticks;
        const xPip = pipDistance * Math.cos(angle);
        const yPip = pipDistance * Math.sin(angle);

        ctx.save();
        if (day == 0) {
          this.fillCircle(ctx, xPip, yPip, this.monthBigPipSize);
          const xLabel = labelDistance * Math.cos(angle);
          const yLabel = labelDistance * Math.sin(angle);
          ctx.translate(xLabel, yLabel);
          let label = months[month];
          if (month == 0) label += ` ${dateTime.getFullYear().toString()}`;
          this.renderCentered(label, 0, 0);
        } else {
          this.fillCircle(ctx, xPip, yPip, this.monthLittlePipSize);
        }
        ctx.restore();
      }
    }
    ctx.restore();
  }

  renderDayFace(dateTime: Date, ctx: CanvasRenderingContext2D) {
    const daysInCurrentMonth = DateUtil.daysInMonth(dateTime);

    const ticks = daysInCurrentMonth * 4;
    const adjust = ticks / 4;
    const pipDistance = this.dayRadius + this.dayFaceSize / 3.5;
    const labelDistance = this.dayRadius + this.dayFaceSize / 1.6;

    ctx.save();

    ctx.lineWidth = this.borderSize;
    ctx.strokeStyle = this.dayBorderColor;
    this.strokeCircle(ctx, 0, 0, this.dayRadius);

    ctx.fillStyle = this.dayPipColor;
    ctx.font = this.dayFont;

    for (let n = 0; n < ticks; ++n) {
      const tick = (n - adjust) % ticks;
      const angle = (this.circleInRadians * tick) / ticks;
      const xPip = pipDistance * Math.cos(angle);
      const yPip = pipDistance * Math.sin(angle);

      ctx.save();

      if (n % 4) {
        this.fillCircle(ctx, xPip, yPip, this.dayLittlePipSize);
      } else {
        this.fillCircle(ctx, xPip, yPip, this.dayBigPipSize);
        const xLabel = labelDistance * Math.cos(angle);
        const yLabel = labelDistance * Math.sin(angle);
        ctx.translate(xLabel, yLabel);
        const date = Math.floor(n / 4) + 1;
        this.renderCentered(date.toString(), 0, 0);
      }
      ctx.restore();
    }
    ctx.restore();
  }

  renderClockPips(ctx: CanvasRenderingContext2D) {
    ctx.save();

    ctx.fillStyle = this.clockBigPipFill;

    const ticks = 60;
    // No need to adjust
    for (let n = 0; n < ticks; ++n) {
      const angle = (this.circleInRadians * n) / ticks;
      const x = this.pipRadius * Math.cos(angle);
      const y = this.pipRadius * Math.sin(angle);

      let size;
      let pip_color;
      if (n % 5 == 0) {
        size = this.clockBigPipSize;
        pip_color = this.clockBigPipFill;
      } else {
        size = this.clockLittlePipSize;
        pip_color = this.clockLittlePipFill;
      }
      ctx.fillStyle = pip_color;
      this.fillCircle(ctx, x, y, size);
    }
    ctx.restore();
  }

  renderCentered(value: string, x: number, y: number) {
    if (this.renderCtx) {
      const textMetrics = this.renderCtx.measureText(value);
      const dx = -textMetrics.width / 2;
      const dy = (textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent) / 2;
      this.renderCtx.fillText(value, x + dx, y + dy);
    }
  }

  renderNumerals(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = this.clockNumeralFill;
    ctx.font = this.numeralFont;
    const ticks = 12;
    const adjust = (ticks / 4) - 1;
    for (let n = 0; n < ticks; ++n) {
      const tick = (n - adjust) % ticks;
      const angle = (this.circleInRadians * tick) / ticks;
      const x = this.numeralRadius * Math.cos(angle);
      const y = this.numeralRadius * Math.sin(angle);
      this.renderCentered((n + 1).toString(), x, y);
    }
    ctx.restore();
  }

  renderLogo(ctx: CanvasRenderingContext2D) {
    ctx.save();

    ctx.fillStyle = this.logoColor;
    ctx.font = this.logoFont;
    this.renderCentered("psobolik", 0, (-this.clockRadius * 30) / 100);

    ctx.restore();
  }

  strokeCircle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, this.circleInRadians);
    ctx.stroke();
  }

  fillCircle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, this.circleInRadians);
    ctx.fill();
  }
}
