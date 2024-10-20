import * as yup from "yup";

export const YupSevice = yup.object({
    title: yup.string().trim().required("Vui lòng nhập tên "),
    content: yup.string().trim().required("Vui lòng nhập nội dung"),

  
});
