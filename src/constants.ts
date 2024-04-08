/*
 * Copyright (c) 2024 Paul Sobolik
 * Created 2024-04-08
 */
export default class Constants {
  static threeHundredSixtyDegrees = Math.PI * 2;
  static ninetyDegrees = Math.PI / 2;

  static hoursInDay = 24;
  static minutesInHour = 60;
  static secondsInMinute = 60;
  static secondsInHour = Constants.secondsInMinute * Constants.minutesInHour;

  static canvasBorderColor = "#1122aa";
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

  static clockDiskFill = "#ecedf1";
  static clockNumeralFill = "#010a1a";
  static clockLittlePipFill = "#aa4444";
  static clockBigPipFill = "#ff4488";

  static secondHandColor = "#ff0000";
  static minuteHandFill = "#125";
  static minuteHandStroke = "#7b7bda";
  static hourHandFill = "#125"
  static hourHandStroke = "#7b7bda"
  static logoColor = "#012b69";
}
