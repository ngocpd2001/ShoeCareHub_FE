import React from "react";

function ComStatusConverter({ children }) {
  const convertStatus = (type) => {
    switch (type) {
      case "Completed":
        return <p className="text-blue-600">Đã hoàn thành</p>;
      case "Cancelled":
        return <p className="text-red-600">Đã hủy</p>;
      case "Pending":
        return "Đang chờ";

      default:
        return " "; // Giá trị mặc định nếu không khớp
    }
  };

  const translated = convertStatus(children);

  return <>{translated}</>;
}

export default ComStatusConverter;
