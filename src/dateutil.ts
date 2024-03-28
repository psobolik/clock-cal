/*
 * Copyright (c) 2024 Paul Sobolik
 * Created 2024-03-27
 */

export default class DateUtil {
  static daysInMonth(dateTime: Date): number {
    // 0th day of next month is last day of this month
    return new Date(dateTime.getFullYear(), dateTime.getMonth() + 1, 0).getDate();
  }

  static daysInYear(dateTime: Date): number {
    return this.daysInYearToDate(new Date(dateTime.getFullYear(), 11, 31));
  }

  static daysInYearToDate(dateTime: Date): number {
    let days = 0;
    for (let m = 0; m < dateTime.getMonth(); ++m) {
      const testDate = new Date(dateTime.getFullYear(), m, 1);
      days += this.daysInMonth(testDate);
    }
    return days + dateTime.getDate();
  }
}
