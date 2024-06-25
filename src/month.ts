import DateUtil from "./dateutil.ts";
import Constants from "./constants.ts";
import Helpers from "./helpers.ts";
import CalendarDisk from "./calendar-disk.ts";

export default class Month extends CalendarDisk {
  renderFace(dateTime: Date, ctx: CanvasRenderingContext2D) {
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
    const labelDistance = (this.innerRadius + (this.extent / 1.8));
    const pipDistance = (this.innerRadius + (this.extent / 4.5));

    ctx.save();

    ctx.fillStyle = Constants.monthDiskFill;
    Helpers.fillCircle(0, 0, this.innerRadius + this.extent, ctx);

    ctx.lineWidth = this.borderSize;
    ctx.strokeStyle = Constants.monthBorderColor;
    Helpers.strokeCircle(0, 0, this.innerRadius, ctx);

    ctx.strokeStyle = Constants.canvasBorderColor;
    Helpers.strokeCircle(0, 0, this.innerRadius + this.extent - (this.borderSize / 2), ctx);

    ctx.fillStyle = Constants.monthPipColor;
    ctx.font = this.font;

    let dayOfYear = 0;
    for (let month = 0; month < months.length; ++month) {
      for (let day = 0; day < daysPerMonth[month]; ++day) {
        const tick = dayOfYear++;
        const angle = ((Constants.threeHundredSixtyDegrees * tick) / ticks) - Constants.ninetyDegrees;
        const xPip = pipDistance * Math.cos(angle);
        const yPip = pipDistance * Math.sin(angle);

        ctx.save();
        if (day == 0) {
          Helpers.fillCircle(xPip, yPip, this.bigPipSize, ctx);
          const xLabel = labelDistance * Math.cos(angle);
          const yLabel = labelDistance * Math.sin(angle);
          ctx.translate(xLabel, yLabel);
          let label = months[month];
          if (month == 0) label += ` ${dateTime.getFullYear().toString()}`;
          Helpers.renderStringCentered(label, 0, 0, ctx);
        } else {
          Helpers.fillCircle(xPip, yPip, this.littlePipSize, ctx);
        }
        ctx.restore();
      }
    }
    ctx.restore();
  }

  renderHand(dateTime: Date, ctx: CanvasRenderingContext2D) {
    const ticks = DateUtil.daysInYear(dateTime);
    const month = (DateUtil.daysInYearToDate(dateTime) - 1);
    const angle = (Constants.threeHundredSixtyDegrees * month) / ticks;

    ctx.save();

    ctx.fillStyle = Constants.monthHandFill;
    ctx.strokeStyle = Constants.monthHandStroke;
    ctx.rotate(angle);

    Helpers.renderTriangle(this.innerRadius, this.handWidth, this.handLength, ctx);
    ctx.restore();
  }

}
