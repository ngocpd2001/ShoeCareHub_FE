import React from "react";

function ComRoleConverter({ children }) {
  const convertRole = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "Quản trị viên";
      case "manager":
        return "Quản lý";
      case "staff":
        return "Nhân viên";
      case "nurse":
        return "Y tá";
      case "director":
        return "Giám đốc";
      case "customer":
        return "Khách hàng";
      default:
        return ""; // Giá trị mặc định nếu không khớp
    }
  };

  const translatedRole = convertRole(children);

  return <>{translatedRole}</>;
}

export default ComRoleConverter;
