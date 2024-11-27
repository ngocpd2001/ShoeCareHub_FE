import * as yup from "yup";

export const YupPackage = yup.object({
    name: yup.string().trim().required("Vui lòng nhập tên chi nhánh"),
    period: yup.number().required("Vui lòng nhập thời gian"),
    price: yup
        .number()
        .typeError("Vui lòng nhập giá tiền")
        .required("Vui lòng nhập giá tiền"),

  
});
