// src/utils/dateUtils.js
import moment from "moment";

export const DateOfBirth = (current) => {
  const minAge = 18;
  const maxAge = 100;
  const minDate = moment().subtract(maxAge, "years");
  const maxDate = moment().subtract(minAge, "years");

  return current && (current < minDate || current > maxDate);
};
export const DateOfBirthElder = (current) => {
  const minAge = 50;
  const maxAge = 100;
  const minDate = moment().subtract(maxAge, "years");
  const maxDate = moment().subtract(minAge, "years");

  return current && (current < minDate || current > maxDate);
};
export const DateOfLastDay = (current) => {
  const maxYearsPast = 80;
  const minDate = moment().subtract(maxYearsPast, "years");
  const maxDate = moment();

  return current && (current < minDate || current > maxDate);
};

export const DateOfContract = (current) => {
  const rangeYears = 10;

  const minDate = moment().subtract(rangeYears, "years");
  const maxDate = moment().add(rangeYears, "years");

  return current && (current < minDate || current > maxDate);
};
