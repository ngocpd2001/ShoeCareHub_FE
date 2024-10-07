import React from "react";
import moment from "moment";

function ComCccdOrCmndConverter({ children }) {
  const formatCccdOrCmnd = (number) => {
    // Kiểm tra nếu number là số CMND hoặc CCCD
    const cmndRegex = /^[0-9]{9}$/; // CMND có 9 chữ số
    const cccdRegex = /^[0-9]{12}$/; // CCCD có 12 chữ số

    if (cmndRegex.test(number)) {
      // Định dạng số CMND: XXX XXX XXX
      return `${number.substring(0, 3)} ${number.substring(
        3,
        6
      )} ${number.substring(6)}`;
    } else if (cccdRegex.test(number)) {
      // Định dạng số CCCD: XXXX XXXX XXXX
      return `${number.substring(0, 4)} ${number.substring(
        4,
        8
      )} ${number.substring(8)}`;
    }
    return children;
  };

  return <>{formatCccdOrCmnd(children)}</>;
}
export default ComCccdOrCmndConverter;
