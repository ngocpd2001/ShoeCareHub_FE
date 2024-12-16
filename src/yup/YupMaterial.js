import * as yup from "yup";

export const YupMaterial = yup.object().shape({
  name: yup
    .string()
    .required("Tên phụ kiện là bắt buộc")
    .trim()
    .min(2, "Tên phụ kiện phải có ít nhất 2 ký tự"),
  price: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue.trim() === "" ? undefined : Number(originalValue);
    })
    .typeError("Vui lòng nhập giá tiền hợp lệ")
    .required("Giá phụ kiện là bắt buộc")
    .min(1000, "Giá tối thiểu là 1000đ"),
  status: yup.string().required("Trạng thái là bắt buộc"),
  branchId: yup
    .array()
    .of(yup.string())
    .min(1, "Phải chọn ít nhất một chi nhánh")
    .required("Vui lòng chọn chi nhánh"),
}); 