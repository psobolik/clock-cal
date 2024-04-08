/*
 * Copyright (c) 2024 Paul Sobolik
 * Created 2024-04-08
 */
export default class Constants {
  static threeHundredSixtyDegrees = Math.PI * 2;
  static ninetyDegrees = Math.PI / 2;

  static hoursInDay = 24;
  static hoursOnClock = Constants.hoursInDay / 2;
  static daysInWeek = 7;
  static hoursInWeek = Constants.hoursInDay * Constants.daysInWeek;
  static minutesInHour = 60;
  static secondsInMinute = 60;
  static secondsInHour = Constants.secondsInMinute * Constants.minutesInHour;

  static canvasBorderColor = "#1122aa";

  static weekDiskFill = "#eeffee";
  static weekBorderColor = "#068d06";
  static weekPipColor = "#004900";
  static weekHandFill = "#00490088";
  static weekHandStroke = "#004900";

  static monthDiskFill = "#eeeeff";
  static monthBorderColor = "#2121ad";
  static monthPipColor = "#000049";
  static monthHandFill = "#2121ad88";
  static monthHandStroke = "#2121ad";

  static dayDiskFill = "#ffeeee";
  static dayBorderColor = "#540000";
  static dayPipColor = "#540000";
  static dayHandFill = "#54000088";
  static dayHandStroke = "#540000";

  static clockDiskFill = "#ffffef";
  static clockNumeralFill = "#010a1a";
  static clockLittlePipFill = "#aaaa00";
  static clockBigPipFill = "#888800";

  static secondHandColor = "#ff0000";
  static minuteHandFill = "#404000";
  static minuteHandStroke = "#101000";
  static hourHandFill = "#404000"
  static hourHandStroke = "#101000"
  static logoColor = "#555501";
}
