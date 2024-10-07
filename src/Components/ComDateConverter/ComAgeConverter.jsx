import React from "react";
import moment from "moment";

function ComAgeConverter({ children, formatData = "YYYY-MM-DD" }) {
  const handleDate = () => {
    try {
      // Check if the date is in ISO 8601 format
      const date = moment(children, moment.ISO_8601, true).isValid()
        ? moment(children)
        : moment(children, formatData, true);

      if (date.isValid()) {
        const age = moment().diff(date, "years"); // Calculate the age in years
        return age;
      } else {
        return ""; // Return empty string if invalid
      }
    } catch (error) {
      return "";
    }
  };

  const age = handleDate();
  return <>{age}</>;
}

export default ComAgeConverter;
