import { useState } from "react";
import ComDatePicker from "./../../Components/ComDatePicker/ComDatePicker";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ComInput from "../../Components/ComInput/ComInput";
import ComSelect from "./../../Components/ComInput/ComSelect copy";
import ComUpImgOne from "./../../Components/ComUpImg/ComUpImgOne";
import { useStorage } from "../../hooks/useLocalStorage";
import { putData } from "../../api/api";
import { useNotification } from "../../Notification/Notification";
import { firebaseImg } from "./../../upImgFirebase/firebaseImg";

const ProfileForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImages] = useState([]);
  const [user, setUser] = useStorage("user", null);
  const { notificationApi } = useNotification();
  const [disabled, setDisabled] = useState(false);

  const CreateProductMessenger = yup.object({
    fullname: yup
      .string()
      .required("Vui lòng nhập tên")
      .min(2, "Tên quá ngắn, vui lòng nhập tối thiểu 2 ký tự")
      .max(50, "Tên quá dài, vui lòng nhập tối đa 50 ký tự"),
  });
  const methods = useForm({
    resolver: yupResolver(CreateProductMessenger),
    values: user,
  });
  const { handleSubmit, register, setFocus, watch, setValue, setError } =
    methods;
  // console.log(user);

  const onChange = (data) => {
    const selectedImages = data;
    console.log([selectedImages]);
    setImages(selectedImages);
  };
  // const onSubmit = (data) => {
  //   console.log(data);
  //   firebaseImg(image).then((dataImg) => { })
  //   putData(`/accounts/${user?.id}`, data)
  //     .then((data) => {
  //       notificationApi("success", "Cập nhật thành công", "Đã cập nhật");
  //     })
  //     .catch((error) => {
  //       notificationApi("error", "Cập nhật không thành công", "Đã cập nhật");
  //       console.error("1111111 Error fetching items:", error);
  //     });
  // };

  const onSubmit = (data) => {
    setDisabled(true);
    firebaseImg(image).then((dataImg) => {
      setDisabled(true);
      if (dataImg) {
        console.log("ảnh nè : ", dataImg);
        const dataPut = { ...data, imageUrl: dataImg };
        console.log(dataPut);

        putData(`/accounts`, user?.id, dataPut)
          .then((e) => {
            notificationApi("success", "Cập nhật thành công ", "Đã cập nhật");
            setUser(dataPut);
            setDisabled(false);
          })
          .catch((e) => {
            console.log(e);
            setUser(dataPut);

            setDisabled(false);
            notificationApi(
              "error",
              "Cập nhật không thành công",
              "Đã cập nhật không thành công123"
            );
          });
      } else {
        const dataPut = { ...data, imageUrl: user.imageUrl };
        putData(`/accounts`, user?.id, dataPut)
          .then((e) => {
            notificationApi("success", "Cập nhật thành công", "Đã cập nhật");
            setUser(dataPut);

            setDisabled(false);
          })
          .catch((e) => {
            console.log(e);
            setDisabled(false);
            setUser(dataPut);

            // set các trường hợp lỗi api
            notificationApi(
              "error",
              "Cập nhật không thành công",
              "Đã cập nhật"
            );
          });
      }
    });
  };
  return (
    <div className="flex-1 px-4 py-0">
      <h1 className="text-2xl font-bold mb-6">Hồ sơ của tôi</h1>
      <div className="flex">
        <FormProvider {...methods}>
          {isEditing ? (
            <form className="flex-1 mr-8" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <ComInput
                  type="text"
                  label={"Họ và Tên"}
                  placeholder={"Vui lòng nhập Họ và Tên"}
                  readOnly={!isEditing}
                  required={isEditing}
                  {...register("fullname")}
                />
              </div>
              <div className="mb-4">
                <ComInput
                  placeholder="Nhập email"
                  label="Email"
                  type="text"
                  disabled={isEditing}
                  required={isEditing}
                  {...register("email")}
                />
              </div>
              <div className="mb-4">
                <ComInput
                  placeholder="Nhập số điện thoại"
                  label="Số điện thoại"
                  type="numbers"
                  maxLength={10}
                  {...register("phone")}
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
                  value={watch("gender")}
                  mode="default"
                  options={[
                    {
                      value: "MALE",
                      label: `Nam`,
                    },
                    {
                      value: "FEMALE",
                      label: `Nữ`,
                    }
                  ]}
                  // readOnly={!isEditing}
                  // open={false}
                  required={isEditing}
                  {...register("gender")}
                />
              </div>
              {/* <div className="mb-6">
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
              </div> */}
              <div className="mb-6">
                <div className="relative">
                  <ComDatePicker
                    type="numbers"
                    // disabledDate={DateOfBirthElder}
                    label={"Ngày tháng năm sinh"}
                    placeholder={"Vui lòng nhập Ngày tháng năm sinh "}
                    {...register("dob")}
                    required={isEditing}
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          ) : (
            <form className="flex-1 mr-8" onSubmit={handleSubmit(() => {})}>
              <div className="mb-4">
                <ComInput
                  type="name"
                  label={"Họ và Tên"}
                  placeholder={"Vui lòng nhập Họ và Tên"}
                  {...register("fullname")}
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
                  {...register("phone")}
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
                  value={watch("gender")}
                  mode="default"
                  options={[
                    {
                      value: "MALE",
                      label: `Nam`,
                    },
                    {
                      value: "FEMALE",
                      label: `Nữ`,
                    },
                  ]}
                  // readOnly={!isEditing}
                  open={false}
                  required={isEditing}
                  {...register("gender")}
                />
              </div>
              {/* <div className="mb-6">
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
              </div> */}
              <div className="mb-6">
                <div className="relative">
                  <ComDatePicker
                    type="numbers"
                    // disabledDate={DateOfBirthElder}
                    label={"Ngày tháng năm sinh"}
                    placeholder={"Vui lòng nhập Ngày tháng năm sinh "}
                    {...register("dob")}
                    required={isEditing}
                    open={false}
                    inputReadOnly={!isEditing}
                  />
                </div>
              </div>
            </form>
          )}
        </FormProvider>
        <div className="w-48 h-50 flex justify-center items-center pl-8">
          {!isEditing ? (
            <img
              className="h-40 w-40 rounded-full border border-gray-400 object-cover"
              src={user.imageUrl}
              alt="Avatar"
            />
          ) : (
            <div className="flex flex-col justify-center gap-2 items-center">
              <ComUpImgOne
                className="rounded-2xl border border-gray-400"
                imgUrl={user.imageUrl}
                onChange={onChange}
              />
              <span className="text-xs text-gray-400 text-center">
                Bấm vào ảnh để thay đổi ảnh đại diện
              </span>
            </div>
          )}
        </div>
      </div>
      {!isEditing && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => {
              setIsEditing(true);
              setFocus("fullname");
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Cập nhật thông tin
          </button>
        </div>
      )}
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
