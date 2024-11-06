import * as yup from "yup";

export const YupBranch = yup.object({
    name: yup.string().trim().required("Vui lòng nhập tên chi nhánh"),
    address: yup.string().trim().required("Vui lòng nhập địa chỉ"),
    ward: yup.string().trim().required("Vui lòng nhập phường "),
    province: yup.string().trim().required("Vui lòng nhập tỉnh"),
    city: yup.string().trim().required("Vui lòng nhập thành phố"),

  
});
