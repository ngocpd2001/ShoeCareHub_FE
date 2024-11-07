import * as yup from "yup";

export const YupPassword = yup.object({
    oldPassword: yup.string().trim().required("Vui lòng nhập mật khẩu cũ"),
    newPassword: yup
        .string()
        .trim()
        .required("Vui lòng nhập mật khẩu mới")
        .notOneOf([yup.ref('oldPassword')], "Mật khẩu mới phải khác mật khẩu cũ"), // Kiểm tra mật khẩu mới khác mật khẩu cũ
    confirmPassword: yup
        .string()
        .trim()
        .required("Vui lòng xác nhận mật khẩu")
        .oneOf([yup.ref('newPassword')], "Mật khẩu xác nhận không khớp"), // Kiểm tra xác nhận mật khẩu giống mật khẩu mới
});
