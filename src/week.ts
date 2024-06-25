import Constants from "./constants.ts";
import Helpers from "./helpers.ts";
import CalendarDisk from "./calendar-disk.ts";

export default class Week extends CalendarDisk {
  renderHand(dateTime: Date, ctx: CanvasRenderingContext2D) {
    const ticks = Constants.hoursInWeek;
    const tick = (dateTime.getDay() * Constants.hoursInDay) + dateTime.getHours();
    const angle = (Constants.threeHundredSixtyDegrees * tick) / ticks;

    ctx.save();

    ctx.fillStyle = Constants.weekHandFill;
    ctx.strokeStyle = Constants.weekHandStroke;
    ctx.rotate(angle);

    Helpers.renderTriangle(this.innerRadius, this.handWidth, this.handLength, ctx);
    ctx.restore();
  }

  renderFace(_dateTime: Date, ctx: CanvasRenderingContext2D) {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    const ticks = days.length * Constants.hoursInDay;
    const pipDistance = (this.innerRadius + (this.extent / 4.5));
    const labelDistance = (this.innerRadius + (this.extent / 1.8));

    ctx.save();

    ctx.fillStyle = Constants.weekDiskFill;
    Helpers.fillCircle(0, 0, this.innerRadius + this.extent, ctx);

    ctx.lineWidth = this.borderSize;
    ctx.strokeStyle = Constants.weekBorderColor;
    Helpers.strokeCircle(0, 0, this.innerRadius, ctx);

    ctx.fillStyle = Constants.weekPipColor;
    ctx.font = this.font;

    for (let tick = 0; tick < ticks; ++tick) {
      const angle = (Constants.threeHundredSixtyDegrees * tick) / ticks - Constants.ninetyDegrees;
      const xPip = pipDistance * Math.cos(angle);
      const yPip = pipDistance * Math.sin(angle);

      ctx.save();

      let pipSize = tick % Constants.hoursInDay ? this.littlePipSize : this.bigPipSize;
      Helpers.fillCircle(xPip, yPip, pipSize, ctx);
      if (tick % Constants.hoursInDay == 0) {
        const xLabel = labelDistance * Math.cos(angle);
        const yLabel = labelDistance * Math.sin(angle);
        ctx.translate(xLabel, yLabel);
        const dow = days[Math.floor(tick / Constants.hoursInDay)];
        Helpers.renderStringCentered(dow, 0, 0, ctx);
      }
      ctx.restore();
    }
    ctx.restore();
  }
}
