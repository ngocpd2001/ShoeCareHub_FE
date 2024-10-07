export const MonyNumber = (number, setError, setFocus) => {
  try {
    // Kiểm tra nếu là chuỗi
    if (typeof number === "string") {
      // Loại bỏ dấu phẩy và kiểm tra xem kết quả có phải là số hợp lệ hay không
      const cleanedNumber = number.replace(/,/g, "");
      const parsedNumber = parseFloat(cleanedNumber);

      // Kiểm tra nếu là số hợp lệ
      if (!isNaN(parsedNumber)) {
        // Kiểm tra nếu nằm trong khoảng hợp lý
        if (parsedNumber < 1000) {
          throw new Error("Số tiền không được nhỏ hơn 1,000 VND");
        }
        // if (parsedNumber > 100000000) {
        //   throw new Error("Số tiền không được vượt quá 100,000,000 VND");
        // }
        // Kiểm tra nếu có 3 số 0 ở cuối
        if (!cleanedNumber.endsWith("000")) {
          throw new Error("Số tiền không hợp lệ");
        }
        return parsedNumber;
      }
    }
    if (typeof number === "number") {
      const parsedNumber = parseFloat(number);

      // Kiểm tra nếu là số hợp lệ
      if (!isNaN(parsedNumber)) {
        // Kiểm tra nếu nằm trong khoảng hợp lý
        if (parsedNumber < 1000) {
          throw new Error("Số tiền không được nhỏ hơn 1,000 VND");
        }
        // if (parsedNumber > 100000000) {
        //   throw new Error("Số tiền không được vượt quá 100,000,000 VND");
        // }
        // Kiểm tra nếu có 3 số 0 ở cuối
        if (parsedNumber % 100 !== 0) {
          throw new Error("Số tiền không hợp lệ");
        }
        return parsedNumber;
      }
    }

    // Nếu không phải định dạng hợp lệ, báo lỗi
    throw new Error("Định dạng số tiền không hợp lệ");
  } catch (error) {
    setError(error.message);
    setFocus(); // Gọi hàm setFocus để chuyển focus đến trường bị lỗi
    return null;
  }
};
