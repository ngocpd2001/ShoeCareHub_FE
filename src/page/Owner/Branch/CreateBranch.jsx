import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNotification } from "../../../Notification/Notification";
import ComInput from "../../../Components/ComInput/ComInput";
import ComButton from "../../../Components/ComButton/ComButton";
import ComUpImgOne from "../../../Components/ComUpImg/ComUpImgOne";
import ComTextArea from "../../../Components/ComInput/ComTextArea";
import { postData } from "../../../api/api";
import { Breadcrumb, Upload } from "antd";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import ComSelect from "./../../../Components/ComInput/ComSelect";
import ComUpImg from "./../../../Components/ComUpImg/ComUpImg";
import ComNumber from "./../../../Components/ComInput/ComNumber";
import ComDatePicker from "./../../../Components/ComDatePicker/ComDatePicker";
import { YupBranch } from "./../../../yup/YupBranch";

export default function CreateBranch() {
  const [disabled, setDisabled] = useState(false);
  const { notificationApi } = useNotification();
  const [image, setImages] = useState(null);

  const methods = useForm({
    resolver: yupResolver(YupBranch),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;
  console.log("====================================");
  console.log(image);
  console.log("====================================");

  // Hàm submit form
  const onSubmit = (data) => {
    // Kiểm tra nếu chưa chọn hình ảnh
    postData(`/branches`, { ...data, isDeliverySupport: true })
      .then((response) => {
        console.log("Tạo thành công:", response);
        setDisabled(false);
        notificationApi(
          "success",
          "Thành công",
          "Chi nhánh đã được tạo thành công."
        );
      })
      .catch((error) => {
        setDisabled(false);
        console.error("Lỗi:", error);
        notificationApi("error", "Lỗi", `${error.data.message}`);
      });
  };

  useEffect(() => {
    
    return () => {
      
    };
  }, []);



  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4 ml-4">
        Thêm chi nhánh
      </h2>

      <div className="">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto ">
            <div className="overflow-y-auto p-4">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="mt-2.5 sm:col-span-2">
                  <ComInput
                    type="text"
                    label={"Tên chi nhánh"}
                    placeholder={"Tên chi nhánh"}
                    required
                    {...register("name")}
                  />
                </div>
                <div className="mt-2.5 sm:col-span-2">
                  <ComInput
                    type="text"
                    label={"Địa chỉ"}
                    placeholder={"Địa chỉ"}
                    required
                    {...register("address")}
                  />
                </div>
                <div className="mt-2.5 sm:col-span-2">
                  <ComInput
                    type="text"
                    label={"Phường"}
                    placeholder={"Phường"}
                    required
                    {...register("ward")}
                  />
                </div>
                <div className="mt-2.5 sm:col-span-2">
                  <ComInput
                    type="text"
                    label={"Tỉnh"}
                    placeholder={"Tỉnh"}
                    required
                    {...register("province")}
                  />
                </div>
                <div className="mt-2.5 sm:col-span-2">
                  <ComInput
                    type="text"
                    label={"Thành phố"}
                    placeholder={"Thành phố"}
                    required
                    {...register("city")}
                  />
                </div>
              </div>

              <div className="mt-10 flex justify-end gap-6">
                <div>
                  <ComButton
                    className={`block w-full rounded border-[#E0E2E7] border-md bg-[#0F296D] text-center text-sm font-semibold text-white shadow-sm hover:bg-[#0F296D] ${" bg-[#F0F1F3]"}`}
                  >
                    <div className="text-black"> Hủy bỏ</div>
                  </ComButton>
                </div>
                <div>
                  <ComButton
                    htmlType="submit"
                    disabled={disabled}
                    className={`block w-full rounded border-[#E0E2E7] border-md bg-[#0F296D] text-center text-sm font-semibold text-white shadow-sm hover:bg-[#0F296D] ${
                      disabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {disabled ? "Đang tạo..." : "Tạo mới"}
                  </ComButton>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
