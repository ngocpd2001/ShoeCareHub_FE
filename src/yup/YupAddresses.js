import * as yup from "yup";

export const YupAddresses = yup.object({
    address: yup.string().trim().required("Vui lòng nhập địa chỉ"),
    wardCode: yup.string().trim().required("Vui lòng nhập phường "),
    provinceId: yup.number().required("Vui lòng nhập tỉnh"),
    districtId: yup.number().required("Vui lòng nhập thành phố"),

  
});
