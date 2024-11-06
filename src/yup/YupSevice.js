import * as yup from "yup";

export const YupSevice = yup.object({
    branchId: yup.array()
        .of(yup.number())
        .min(1, "Vui lòng chọn ít nhất một chi nhánh")
        .required("Vui lòng chọn chi nhánh"),
    categoryId: yup.number().required("Vui lòng chọn danh mục"),
    name: yup.string().trim().required("Vui lòng nhập tên"),
    description: yup.string().trim().required("Vui lòng nhập mô tả"),
    price: yup
        .number()
        .typeError("Vui lòng nhập giá tiền")
        .required("Vui lòng nhập giá tiền"),
    status: yup.string().required("Vui lòng chọn trạng thái"),
    // newPrice: yup
    //     .number()
    //     .nullable()
    //     .typeError("Giá tiền mới phải là số"),
});
