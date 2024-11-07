import * as yup from "yup";

export const YupAddresses = yup.object({
    address: yup.string().trim().required("Vui lòng nhập địa chỉ"),
    ward: yup.string().trim().required("Vui lòng nhập phường "),
    province: yup.string().trim().required("Vui lòng nhập tỉnh"),
    district: yup.string().trim().required("Vui lòng nhập thành phố"),

  
});
