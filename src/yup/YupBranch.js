import * as yup from "yup";

export const YupBranch = yup.object({
    name: yup.string().trim().required("Vui lòng nhập tên chi nhánh"),

  
});
