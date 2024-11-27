import * as yup from "yup";

export const YupServiceCategory = yup.object({
    name: yup.string().trim().required("Vui lòng nhập tên chi nhánh"),
    status: yup.string().trim().required("Vui lòng chọn trạng thái"),


  
});
