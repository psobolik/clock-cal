import DateUtil from "./dateutil.ts";
import Constants from "./constants.ts";
import Helpers from "./helpers.ts";
import CalendarDisk from "./calendar-disk.ts";

export default class Day extends CalendarDisk {
  renderFace(dateTime: Date, ctx: CanvasRenderingContext2D) {
    const daysInCurrentMonth = DateUtil.daysInMonth(dateTime);

    const ticks = daysInCurrentMonth * 4;
    const pipDistance = this.innerRadius + (this.extent / 3.5);
    const labelDistance = this.innerRadius + (this.extent / 1.6);

    ctx.save();

    ctx.fillStyle = Constants.dayDiskFill;
    Helpers.fillCircle(0, 0, this.innerRadius + this.extent, ctx);

    ctx.lineWidth = this.borderSize;
    ctx.strokeStyle = Constants.dayBorderColor;
    Helpers.strokeCircle(0, 0, this.innerRadius, ctx);

    ctx.fillStyle = Constants.dayPipColor;
    ctx.font = this.font;

    for (let tick = 0; tick < ticks; ++tick) {
      const angle = (Constants.threeHundredSixtyDegrees * tick) / ticks - Constants.ninetyDegrees;
      const xPip = pipDistance * Math.cos(angle);
      const yPip = pipDistance * Math.sin(angle);

      ctx.save();

      if (tick % 4) {
        Helpers.fillCircle(xPip, yPip, this.littlePipSize, ctx);
      } else {
        Helpers.fillCircle(xPip, yPip, this.bigPipSize, ctx);
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

  renderHand(dateTime: Date, ctx: CanvasRenderingContext2D) {
    const ticks = DateUtil.daysInMonth(dateTime) * Constants.hoursInDay;
    const tick = ((dateTime.getDate() - 1) * Constants.hoursInDay) + dateTime.getHours();
    const angle = (Constants.threeHundredSixtyDegrees * tick) / ticks;

    ctx.save();

    ctx.fillStyle = Constants.dayHandFill;
    ctx.strokeStyle = Constants.dayHandStroke;
    ctx.rotate(angle);

    Helpers.renderTriangle(this.innerRadius, this.handWidth, this.handLength, ctx);

    ctx.restore();
  }
}
