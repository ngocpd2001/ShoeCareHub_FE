// src/utils/dateUtils.js
import moment from "moment";

export const disabledDate = (current) => {
  const yearsAgo120 = moment().subtract(120, "years");
  const yearsLater120 = moment().add(120, "years");

  return current && (current < yearsAgo120 || current > yearsLater120);
};
