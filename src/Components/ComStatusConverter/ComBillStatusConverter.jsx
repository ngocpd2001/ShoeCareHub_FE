import React from "react";

function ComBillStatusConverter({ children }) {
  const convertStatus = (type) => {
    switch (type) {
      case "Paid":
        return <p className="text-blue-600">Đã thanh toán</p>;
      case "UnPaid":
        return <p className="text-neutral-950">Chưa thanh toán</p>;
      case "Faied":
        return <p className="text-red-600">Đã hủy</p>;
      case "OverDue":
        return <p className="text-orange-600">Hết hạn</p>;

      default:
        return " "; // Giá trị mặc định nếu không khớp
    }
  };

  const translated = convertStatus(children);

  return <>{translated}</>;
}

export default ComBillStatusConverter;
