import * as yup from "yup";

export const YupBranch = yup.object({
    name: yup.string().trim().required("Vui lòng nhập tên chi nhánh"),
    address: yup.string().trim().required("Vui lòng nhập địa chỉ"),
    wardCode: yup.string().trim().required("Vui lòng nhập phường "),
    provinceId: yup.number().required("Vui lòng nhập tỉnh"),
    districtId: yup.number().required("Vui lòng nhập thành phố"),

  
});
