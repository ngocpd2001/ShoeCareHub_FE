import React from "react";

function ComGenderConverter({ children }) {
  const convertGender = (gender) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "Nam";
      case "female":
        return "Nữ";
      case "other":
        return "Khác";
      default:
        return " "; // Giá trị mặc định nếu không khớp
    }
  };

  const translatedGender = convertGender(children);

  return <>{translatedGender}</>;
}

export default ComGenderConverter;
