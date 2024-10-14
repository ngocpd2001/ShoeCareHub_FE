import { useState } from "react";
import ComDatePicker from "./../../Components/ComDatePicker/ComDatePicker";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ComInput from "../../Components/ComInput/ComInput";
import ComSelect from "./../../Components/ComInput/ComSelect copy";
import ComUpImgOne from "./../../Components/ComUpImg/ComUpImgOne";

const ProfileForm = () => {
  const [isEditing, setIsEditing] = useState(false);

  const CreateProductMessenger = yup.object({
    name: yup
      .string()
      .required("Vui lòng nhập tên")
      .min(2, "Tên quá ngắn, vui lòng nhập tối thiểu 2 ký tự")
      .max(50, "Tên quá dài, vui lòng nhập tối đa 50 ký tự"),
  });
  const methods = useForm({
    resolver: yupResolver(CreateProductMessenger),
  });
  const { handleSubmit, register, setFocus, watch, setValue, setError } =
    methods;

  const onChange = () => {};
  const onSubmit = (data) => {};
  return (
    <div className="flex-1 px-4 py-0">
      <h1 className="text-2xl font-bold mb-6">Hồ sơ của tôi</h1>
      <div className="flex">
        <FormProvider {...methods}>
          {isEditing ? (
            <form className="flex-1 mr-8" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <ComInput
                  type="name"
                  label={"Họ và Tên"}
                  placeholder={"Vui lòng nhập Họ và Tên"}
                  {...register("name")}
                  readOnly={!isEditing}
                  required={isEditing}
                />
              </div>
              <div className="mb-4">
                <ComInput
                  placeholder="Nhập email"
                  label="Email"
                  type="text"
                  {...register("email")}
                  readOnly={!isEditing}
                  required={isEditing}
                />
              </div>
              <div className="mb-4">
                <ComInput
                  placeholder="Nhập số điện thoại"
                  label="Số điện thoại"
                  type="numbers"
                  maxLength={10}
                  {...register("phoneNumber")}
                  disabled={isEditing}
                  readOnly={!isEditing}
                />
              </div>
              <div className="mb-4">
                <ComSelect
                  size={"large"}
                  style={{
                    width: "100%",
                  }}
                  label="Giới tính"
                  placeholder="Giới tính"
                  onChangeValue={(e, value) => {
                    if (value.length === 0) {
                      setValue("gender", null, { shouldValidate: true });
                    } else {
                      setValue("gender", value, { shouldValidate: true });
                    }
                  }}
                  // value={selectedUser}
                  mode="default"
                  options={[
                    {
                      value: "Male",
                      label: `Nam`,
                    },
                    {
                      value: "Female",
                      label: `Nữ`,
                    },
                  ]}
                  // readOnly={!isEditing}
                  // open={false}
                  required={isEditing}
                  {...register("gender")}
                />
              </div>
              <div className="mb-6">
                <div className="relative">
                  <ComInput
                    placeholder="Nhập địa chỉ"
                    label="Địa chỉ"
                    type="text"
                    {...register("address")}
                    readOnly={!isEditing}
                    required={isEditing}
                  />
                </div>
              </div>
              <div className="mb-6">
                <div className="relative">
                  <ComDatePicker
                    type="numbers"
                    // disabledDate={DateOfBirthElder}
                    label={"Ngày tháng năm sinh"}
                    placeholder={"Vui lòng nhập Ngày tháng năm sinh "}
                    {...register("dateOfBirth")}
                    required={isEditing}
                  />
                </div>
              </div>

              {isEditing ? (
                // Centering the "Cập nhật" button
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Cập nhật
                  </button>
                </div>
              ) : (
                // Centering the "Cập nhật thông tin" button
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Cập nhật thông tin
                  </button>
                </div>
              )}
            </form>
          ) : (
            <form className="flex-1 mr-8" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <ComInput
                  type="name"
                  label={"Họ và Tên"}
                  placeholder={"Vui lòng nhập Họ và Tên"}
                  {...register("name")}
                  readOnly={!isEditing}
                  required={isEditing}
                />
              </div>
              <div className="mb-4">
                <ComInput
                  placeholder="Nhập email"
                  label="Email"
                  type="text"
                  {...register("email")}
                  readOnly={!isEditing}
                  required={isEditing}
                />
              </div>
              <div className="mb-4">
                <ComInput
                  placeholder="Nhập số điện thoại"
                  label="Số điện thoại"
                  type="numbers"
                  maxLength={10}
                  {...register("phoneNumber")}
                  disabled={isEditing}
                  readOnly={!isEditing}
                />
              </div>
              <div className="mb-4">
                <ComSelect
                  size={"large"}
                  style={{
                    width: "100%",
                  }}
                  label="Giới tính"
                  placeholder="Giới tính"
                  onChangeValue={(e, value) => {
                    if (value.length === 0) {
                      setValue("gender", null, { shouldValidate: true });
                    } else {
                      setValue("gender", value, { shouldValidate: true });
                    }
                  }}
                  // value={selectedUser}
                  mode="default"
                  options={[
                    {
                      value: "Male",
                      label: `Nam`,
                    },
                    {
                      value: "Female",
                      label: `Nữ`,
                    },
                  ]}
                  // readOnly={!isEditing}
                  open={false}
                  required={isEditing}
                  {...register("gender")}
                />
              </div>
              <div className="mb-6">
                <div className="relative">
                  <ComInput
                    placeholder="Nhập địa chỉ"
                    label="Địa chỉ"
                    type="text"
                    {...register("address")}
                    readOnly={!isEditing}
                    required={isEditing}
                  />
                </div>
              </div>
              <div className="mb-6">
                <div className="relative">
                  <ComDatePicker
                    type="numbers"
                    // disabledDate={DateOfBirthElder}
                    label={"Ngày tháng năm sinh"}
                    placeholder={"Vui lòng nhập Ngày tháng năm sinh "}
                    {...register("dateOfBirth")}
                    required={isEditing}
                    open={false}
                    inputReadOnly={!isEditing}
                  />
                </div>
              </div>

              {isEditing ? (
                // Centering the "Cập nhật" button
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Cập nhật
                  </button>
                </div>
              ) : (
                // Centering the "Cập nhật thông tin" button
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Cập nhật thông tin
                  </button>
                </div>
              )}
            </form>
          )}
        </FormProvider>
        <div className="w-48 h-50 flex justify-center items-center pl-8">
          {!isEditing ? (
            <img
              className="h-40 w-40 rounded-full border border-gray-400"
              src={
                "https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/08/13/356/avatar-vo-tri-meo-3.jpg"
              }
              alt="Avatar"
            />
          ) : (
            <div className="flex flex-col justify-center gap-2 items-center">
              <ComUpImgOne
                className="rounded-2xl border border-gray-400"
                imgUrl={
                  "https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/08/13/356/avatar-vo-tri-meo-3.jpg"
                }
                onChange={onChange}
              />
              <span className="text-xs text-gray-400 text-center">
                Bấm vào ảnh để thay đổi ảnh đại diện
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div>
      <div className=" col-span-3  ">
        <div className="mb-4 bg-white border border-gray-300 rounded-lg shadow-sm 2xl:col-span-1 sm:px-6 sm:py-4  mt-2">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}
