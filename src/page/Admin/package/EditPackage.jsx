import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNotification } from "../../../Notification/Notification";
import ComInput from "../../../Components/ComInput/ComInput";
import ComButton from "../../../Components/ComButton/ComButton";
import { getData, postData, putData } from "../../../api/api";

import { YupBranch } from "./../../../yup/YupBranch";
import ComSelect from "../../../Components/ComInput/ComSelect";
import ComTextArea from "../../../Components/ComInput/ComTextArea";
import { YupPackage } from "../../../yup/YupPackage";
// Thiết lập icon cho Marker (khắc phục vấn đề với icon mặc định của Leaflet)

export default function EditPackage({ onClose, tableRef, selectedData }) {
  const [disabled, setDisabled] = useState(false);
  const { notificationApi } = useNotification();
  const [provinces, setProvinces] = useState([]);
  const methods = useForm({
    resolver: yupResolver(YupPackage),
    values: selectedData,
  });
  console.log("====================================");
  console.log(4444, selectedData);
  console.log("====================================");

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  // Hàm submit form
  const onSubmit = (data) => {
    // Kiểm tra nếu chưa chọn hình ảnh
    console.log(data);
    console.log(provinces);
    putData(`/subscription-packs`, selectedData.id, {
      ...data,
    })
      .then((response) => {
        console.log("Tạo thành công:", response);
        setDisabled(false);
        notificationApi("success", "Thành công", "Cập nhật gói thành công.");
        setTimeout(() => {
          tableRef();
        }, 100);
        onClose();
      })
      .catch((error) => {
        setDisabled(false);
        console.error("Lỗi:", error);
        notificationApi("error", "Lỗi", `${error.data.message}`);
      });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-blue-800 mb-4 ml-4">
        Cập nhật gói
      </h2>

      <div className="">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto ">
            <div className="overflow-y-auto p-4">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="mt-2.5 sm:col-span-2">
                  <ComInput
                    type="text"
                    label={"Tên gói"}
                    placeholder={"Tên gói"}
                    required
                    {...register("name")}
                  />
                </div>

                <div className="mt-2.5 sm:col-span-2">
                  <ComSelect
                    type="text"
                    label={"Số tháng"}
                    size={"large"}
                    placeholder={"Số tháng"}
                    style={{
                      width: "100%",
                    }}
                    required
                    options={[
                      {
                        value: 1,
                        label: `1 tháng`,
                      },
                      {
                        value: 2,
                        label: `2 tháng`,
                      },
                      {
                        value: 3,
                        label: `3 tháng`,
                      },
                      {
                        value: 4,
                        label: `4 tháng`,
                      },
                      {
                        value: 5,
                        label: `5 tháng`,
                      },
                      {
                        value: 6,
                        label: `6 tháng`,
                      },
                      {
                        value: 7,
                        label: `7 tháng`,
                      },
                      {
                        value: 8,
                        label: `8 tháng`,
                      },
                      {
                        value: 9,
                        label: `9 tháng`,
                      },
                      {
                        value: 10,
                        label: `10 tháng`,
                      },
                      {
                        value: 11,
                        label: `11 tháng`,
                      },
                      {
                        value: 12,
                        label: `12 tháng`,
                      },
                    ]}
                    onChangeValue={(e, value) => {
                  
                        setValue("period", value, { shouldValidate: true });
                    
                    }}
                    value={watch("period")}
                    {...register("period")}
                  />
                </div>
                <div className="mt-2.5 sm:col-span-2">
                  <ComInput
                    type="number"
                    label={"Giá"}
                    placeholder={"Giá"}
                    required
                    {...register("price")}
                  />
                </div>
              </div>

              <div className="mt-10 flex justify-end gap-6">
                {/* <div>
                  <ComButton
                    className={`block w-full rounded border-[#E0E2E7] border-md bg-[#0F296D] text-center text-sm font-semibold text-white shadow-sm hover:bg-[#0F296D] ${" bg-[#F0F1F3]"}`}
                  >
                    <div className="text-black"> Hủy bỏ</div>
                  </ComButton>
                </div> */}
                <div>
                  <ComButton
                    htmlType="submit"
                    disabled={disabled}
                    className={`block w-full rounded border-[#E0E2E7] border-md bg-[#0F296D] text-center text-sm font-semibold text-white shadow-sm hover:bg-[#0F296D] ${
                      disabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {disabled ? "Đang cập nhật..." : "Cập nhật"}
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
