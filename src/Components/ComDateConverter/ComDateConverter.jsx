import React from "react";
import moment from "moment";

function ComDateConverter({ children, formatData = "YYYY-MM-DD", time }) {
  const handleDate = () => {
    try {
      // Check if the date is in ISO 8601 format
      const date = moment(children, moment.ISO_8601, true).isValid()
        ? moment(children)
        : moment(children, formatData, true);

      if (!date.isValid()) {
        return "Không có";
      }

      // Format date with or without time
      const formattedDate = time
        ? date.format("HH:mm / DD-MM-YYYY") // Return date with time if `time` is true
        : date.format("DD-MM-YYYY"); // Return only date if `time` is false

      return formattedDate;
    } catch (error) {
      return "";
    }
  };

  const formattedDate = handleDate();
  return <>{formattedDate}</>;
}

export default ComDateConverter;
