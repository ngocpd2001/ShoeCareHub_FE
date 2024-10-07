import React from "react";

function ComStatusService({ children }) {
  const convertStatus = (type) => {
    switch (type) {
      case "Complete":
        return <p className="text-blue-600">Đã thực hiện</p>;
      case "Processed":
        return <p className="text-blue-600">Đã xử lý</p>;
      case "Missed":
        return <p className="text-red-600">Đã quá hạn</p>;
      case "InComplete":
        return "Chưa thực hiện";

      default:
        return " "; // Giá trị mặc định nếu không khớp
    }
  };

  const translated = convertStatus(children);

  return <>{translated}</>;
}

export default ComStatusService;
