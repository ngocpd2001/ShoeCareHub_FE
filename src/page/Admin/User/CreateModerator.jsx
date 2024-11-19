import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import { useNotification } from "../../../Notification/Notification";
import ComInput from "../../../Components/ComInput/ComInput";
import ComButton from "../../../Components/ComButton/ComButton";
import ComSelect from "../../../Components/ComInput/ComSelect";
import { createModerator } from "../../../api/user";
import { YupModerator } from "../../../yup/YupModerator";

export default function CreateModerator() {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const { notificationApi } = useNotification();
  const [selectedGender, setSelectedGender] = useState("MALE");

  const methods = useForm({
    resolver: yupResolver(YupModerator),
    defaultValues: {
      fullName: "",
      dob: "",
      gender: "MALE",
      email: "",
      phone: "",
    },
  });

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = methods;

  // Xử lý submit form
  const onSubmit = async (data) => {
    try {
      setDisabled(true);

      const moderatorData = {
        fullName: data.fullName,
        dob: new Date(data.dob).toISOString().split('T')[0],
        gender: data.gender,
        email: data.email,
        phone: data.phone,
      };

      await createModerator(moderatorData);
      notificationApi("success", "Thành công", "Tạo moderator thành công");
      navigate("/admin/user");
    } catch (error) {
      console.log("Error details:", error.response?.data?.errors);
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi tạo moderator";
      notificationApi("error", "Lỗi", errorMessage);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">
        Thêm người dùng
      </h2>
      <Breadcrumb
        items={[
          { title: <Link to="/admin/user">Người dùng</Link> },
          { title: <span className="text-[#002278]">Thêm người dùng</span> },
        ]}
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="bg-white rounded border p-5">
              <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>
              <div className="space-y-6">
                <ComInput
                  label="Họ và tên"
                  placeholder="Nhập họ và tên"
                  error={errors.fullName?.message}
                  required
                  {...register("fullName")}
                />

                <ComInput
                  type="date"
                  label="Ngày sinh"
                  error={errors.dob?.message}
                  required
                  {...register("dob")}
                />

                <ComSelect
                  label="Giới tính"
                  options={[
                    { value: "MALE", label: "Nam" },
                    { value: "FEMALE", label: "Nữ" },
                  ]}
                  required
                  value={selectedGender}
                  onChange={(value) => {
                    setSelectedGender(value);
                    setValue("gender", value);
                  }}
                  onSelect={(value) => {
                    setSelectedGender(value);
                    setValue("gender", value);
                  }}
                  className="w-full min-w-[200px] max-w-full"
                />
              </div>
            </div>

            <div className="bg-white rounded border p-5">
              <h2 className="text-xl font-semibold mb-4">Thông tin liên hệ</h2>
              <div className="space-y-6">
                <ComInput
                  type="email"
                  label="Email"
                  placeholder="Nhập email"
                  error={errors.email?.message}
                  required
                  {...register("email")}
                />

                <ComInput
                  label="Số điện thoại"
                  placeholder="Nhập số điện thoại"
                  error={errors.phone?.message}
                  required
                  {...register("phone")}
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-end gap-6">
            <div>
              <ComButton
                onClick={() => navigate('/admin/moderators')}
                type="button"
                className="block w-full rounded border-[#E0E2E7] border-md bg-[#F0F1F3] text-center text-sm font-semibold shadow-sm"
              >
                <div className="text-black">Hủy bỏ</div>
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
        </form>
      </FormProvider>
    </div>
  );
}