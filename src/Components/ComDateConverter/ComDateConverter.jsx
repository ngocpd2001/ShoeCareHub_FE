import React from "react";
import moment from "moment";

function ComDateConverter({ children, formatData = "YYYY-MM-DD" }) {
  const handleDate = () => {
    try {
      // Check if the date is in ISO 8601 format
      const date = moment(children, moment.ISO_8601, true).isValid()
        ? moment(children)
        : moment(children, formatData, true);

      const formattedDate = date.isValid() ? date.format("DD-MM-YYYY") : "Không có"; // Return empty string if invalid
      return formattedDate;
    } catch (error) {
      return "";
    }
  };

  const formattedDate = handleDate();
  return <>{formattedDate}</>;
}

export default ComDateConverter;
