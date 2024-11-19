import React, { useState } from "react";
import ComButton from "../../Components/ComButton/ComButton";
import ComInput from "../../Components/ComInput/ComInput";
import { FormProvider, useForm } from "react-hook-form";
import { useNotification } from "../../Notification/Notification";
import { putData } from "../../api/api";
import { yupResolver } from "@hookform/resolvers/yup";
import { YupPassword } from "../../yup/YupPassword";
import { useStorage } from "../../hooks/useLocalStorage";

export default function ChangePassword() {
  const { notificationApi } = useNotification();
  const [disabled, setDisabled] = useState(false);
  const [user, setUser] = useStorage("user", null);

  const methods = useForm({
    resolver: yupResolver(YupPassword),
  });

  const {
    handleSubmit,
    register,
    reset,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const onSubmit = (data) => {
    console.log(data);
    setDisabled(true);
    putData(`/accounts`, `${user.id}/password`, data)
      .then((response) => {
        console.log("Tạo thành công:", response);
        setDisabled(false);
        notificationApi("success", "Thành công", "Đổi mật khẩu thành công.");
        reset();
      })
      .catch((error) => {
        setDisabled(false);
        console.error("Lỗi:", error);
        setError("oldPassword", {
          message: "Mật khẩu cũ không đúng",
        });

        // notificationApi("error", "Lỗi", `${error?.data?.message}`);
      });
  };

  return (
    <div className="pb-4 mb-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-1   sm:pt-1 sm:pb-6 sm:px-6 ">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 ml-4">
        Đổi mật khẩu
      </h2>

      <div className="">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto ">
            <div className="overflow-y-auto p-4">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="mt-2.5 sm:col-span-2">
                  <ComInput
                    type="password"
                    label={"Mật khẩu cũ"}
                    placeholder={"Mật khẩu cũ"}
                    required
                    {...register("oldPassword")}
                  />
                </div>

                <div className="mt-2.5 sm:col-span-2">
                  <ComInput
                    type="password"
                    label={"Mật khẩu mới"}
                    placeholder={"Mật khẩu mới"}
                    required
                    {...register("newPassword")}
                  />
                </div>
                <div className="mt-2.5 sm:col-span-2">
                  <ComInput
                    type="password"
                    label={"Xác nhận mật khẩu mới"}
                    placeholder={"Xác nhận mật khẩu mới"}
                    required
                    {...register("confirmPassword")}
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
                    {disabled ? "Xin chờ..." : "Đổi mật khẩu"}
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
