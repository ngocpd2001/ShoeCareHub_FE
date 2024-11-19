import * as yup from "yup";

export const YupModerator = yup.object().shape({
  fullName: yup
    .string()
    .required("Vui lòng nhập họ tên")
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(50, "Họ tên không được vượt quá 50 ký tự"),

  dob: yup
    .date()
    .typeError("Vui lòng chọn ngày sinh")
    .max(new Date(Date.now() - 15 * 365 * 24 * 60 * 60 * 1000), "Nhân viên phải trên 15 tuổi")
    .required("Vui lòng chọn ngày sinh"),

  gender: yup
    .string()
    .oneOf(["MALE", "FEMALE"], "Giới tính không hợp lệ")
    .required("Vui lòng chọn giới tính"),

  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email")
    .max(255, "Email không được vượt quá 255 ký tự"),

  phone: yup
    .string()
    .required("Vui lòng nhập số điện thoại")
    .matches(/^[0-9]{10}$/, {
      message: "Số điện thoại phải có 10 chữ số",
      excludeEmptyString: true
    }),
}); 