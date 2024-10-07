import React from "react";

function ComContractStatusConverter({ children }) {
  const convertStatus = (type) => {
    switch (type) {
      case "Valid":
        return <p className="text-blue-600">Đang được sử dụng</p>;
      case "Pending":
        return <p className="text-yellow-600">Chưa đến hẹn sử dụng</p>;
      case "Cancelled":
        return <p className="text-red-600">Đã hủy</p>;
      case "Expired":
        return <p className="text-gray-600">Hết hạn</p>;
      default:
        return <p>Không xác định</p>; // Giá trị mặc định nếu không khớp
    }
  };

  const translated = convertStatus(children);

  return <>{translated}</>;
}

export default ComContractStatusConverter;
