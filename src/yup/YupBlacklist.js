import * as yup from "yup";

export const YupBlacklist = yup.object({
    word: yup.string().trim().required("Vui lòng nhập từ cấm"),
    note: yup.string().trim().required("Vui lòng nhập ghi chú"),

  
});
