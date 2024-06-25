import Month from "./month.ts";
import Day from "./day.ts";
import Week from "./week.ts";
import Helpers from "./helpers.ts";

export default class Calendar {
  month: Month;
  day: Day;
  week: Week;
  
  constructor() {
    this.month = new Month();
    this.day = new Day();
    this.week = new Week();
  }

  public setSize(diameter: number) {
    const radius = diameter / 2;
    const borderSize = Helpers.percent(diameter, .8);

    const monthFont = `bold ${diameter / 65}pt Arial, sans-serif`;
    const extent = Helpers.percent(diameter, 9);
    const monthInnerRadius = radius - extent;
    const monthBigPipSize = Helpers.percent(radius, 0.95);
    const monthLittlePipSize = Helpers.percent(radius, 0.25);
    this.month.setSize(monthFont, extent, monthInnerRadius, monthBigPipSize, monthLittlePipSize, borderSize);

    const dayFont = `bold ${diameter / 50}pt Arial, sans-serif`;
    const dayExtent = Helpers.percent(diameter, 9);
    const dayInnerRadius = monthInnerRadius - dayExtent;
    const dayBigPipSize = Helpers.percent(radius, 0.99);
    const dayLittlePipSize = Helpers.percent(radius, 0.5);
    this.day.setSize(dayFont, dayExtent, dayInnerRadius, dayBigPipSize, dayLittlePipSize, borderSize);

    const weekFont = `bold ${diameter / 65}pt Arial, sans-serif`;
    const weekExtent = Helpers.percent(diameter, 8.5);
    const weekInnerRadius = dayInnerRadius - weekExtent;
    const weekBigPipSize = Helpers.percent(radius, 0.99);
    const weekLittlePipSize = Helpers.percent(radius, 0.5);
    this.week.setSize(weekFont, weekExtent, weekInnerRadius, weekBigPipSize, weekLittlePipSize, borderSize);
  }

  public render(dateTime: Date, ctx: CanvasRenderingContext2D) {
    this.month.render(dateTime, ctx);
    this.day.render(dateTime, ctx);
    this.week.render(dateTime, ctx);
  }
}
