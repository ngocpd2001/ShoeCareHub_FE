import React from "react";
import moment from "moment";

function ComPhoneConverter({ children }) {
  const formatPhoneNumber = (phoneNumber) => {
    // Kiểm tra xem phoneNumber có phải là số và có 10 chữ số không
    const phoneRegex = /^[0-9]{10}$/;
    if (phoneRegex.test(phoneNumber)) {
      // Định dạng số điện thoại thành (XXX) XXX-XXXX
      return `${phoneNumber.substring(0, 3)} ${phoneNumber.substring(
        3,
        6
      )} ${phoneNumber.substring(6)}`;
    }
    return children;
  };

  return <>{formatPhoneNumber(children)}</>;
}
export default ComPhoneConverter;
