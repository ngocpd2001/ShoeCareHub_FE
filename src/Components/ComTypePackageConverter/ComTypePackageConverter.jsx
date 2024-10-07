import React from "react";

function ComTypePackageConverter({ children }) {
  const convertTypePackage = (type) => {
    switch (type) {
      case "OneDay":
        return "Một ngày";
      case "MultipleDays":
        return "Theo ngày";
      case "WeeklyDays":
        return "Theo tuần";
      case "AnyDay":
        return "Mọi ngày";
      default:
        return " "; // Giá trị mặc định nếu không khớp
    }
  };

  const translatedRole = convertTypePackage(children);

  return <div>{translatedRole}</div>;
}

export default ComTypePackageConverter;
