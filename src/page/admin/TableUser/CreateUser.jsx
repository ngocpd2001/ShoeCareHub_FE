import React, { useState } from "react";
import ComButton from "./../../../Components/ComButton/ComButton";
import { FormProvider, useForm } from "react-hook-form";
import ComInput from "./../../../Components/ComInput/ComInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { firebaseImgs } from "../../../upImgFirebase/firebaseImgs";
import ComUpImg from "./../../../Components/ComUpImg/ComUpImg";
import { useNotification } from "./../../../Notification/Notification";
import { postData } from "../../../api/api";
import ComUpImgOne from "./../../../Components/ComUpImg/ComUpImgOne";
import { firebaseImg } from "./../../../upImgFirebase/firebaseImg";
import ComDatePicker from "../../../Components/ComDatePicker/ComDatePicker";
import { disabledDate } from "../../../Components/ComDateDisabled";
import { DateOfBirth } from "../../../Components/ComDateDisabled/DateOfBirth";
import {
  addressRegex,
  cccdRegex,
  emailRegex,
  nameRegex,
  phoneNumberRegex,
} from "../../../regexPatterns";
import { handleErrors } from "../../../Components/errorUtils/errorUtils";
import ComSelect from "../../../Components/ComInput/ComSelect";

export default function CreateUser({ onClose, tableRef }) {
  const [image, setImages] = useState({});
  const { notificationApi } = useNotification();
  const [disabled, setDisabled] = useState(false);
  const [resetImg, setResetImg] = useState(false);
  const CreateProductMessenger = yup.object({
    fullName: yup
      .string()
      .matches(
        nameRegex,
        "Vui lòng nhập tên hợp lệ (chỉ chứa chữ cái và dấu cách)"
      )
      .required("Vui lòng nhập tên")
      .min(2, "Tên quá ngắn, vui lòng nhập tối thiểu 2 ký tự")
      .max(50, "Tên quá dài, vui lòng nhập tối đa 50 ký tự"),
    phoneNumber: yup
      .string()
      .required("Vui lòng nhập đủ số điện thoại")
      .matches(phoneNumberRegex, "Vui lòng nhập số điện thoại hợp lệ"),
    cccd: yup
      .string()
      .matches(cccdRegex, "Vui lòng nhập đúng số CMND/CCCD (9 hoặc 12 chữ số)")
      .required("Vui lòng nhập đủ số CMND/CCCD"),
    gender: yup.string().required("Vui lòng chọn chọn giới tính"),
    address: yup
      .string()
      .matches(addressRegex, "Vui lòng nhập địa chỉ hợp lệ")
      .required("Vui lòng nhập địa chỉ")
      .min(5, "Địa chỉ quá ngắn, vui lòng nhập tối thiểu 5 ký tự")
      .max(100, "Địa chỉ quá dài, vui lòng nhập tối đa 100 ký tự"),
    dateOfBirth: yup.string().required("Vui lòng nhập ngày sinh"),
    email: yup
      .string()
      .matches(emailRegex, "Vui lòng nhập địa chỉ email hợp lệ")
      .required("Vui lòng nhập đầy đủ email"),
  });

  const methods = useForm({
    resolver: yupResolver(CreateProductMessenger),
    defaultValues: {
      phoneNumber: "",
    },
  });
  const { handleSubmit, register, setFocus, watch, setValue, setError, reset } =
    methods;

  const onSubmit = (data) => {
    setDisabled(true);
    console.log(data);

    if (!image) {
      setDisabled(false);
      return notificationApi(
        "error",
        "Vui lòng chọn ảnh",
        "Vui lòng chọn hình ảnh"
      );
    }
    firebaseImg(image).then((dataImg) => {
      console.log("ảnh nè : ", dataImg);
      postData("/users/customer-register", { ...data, avatarUrl: dataImg })
        .then((e) => {
          notificationApi("success", "Thành công", "Đã tạo thành công");
          setTimeout(() => {
            if (tableRef.current) {
              // Kiểm tra xem ref đã được gắn chưa
              tableRef.current.reloadData();
            }
          }, 100);
          reset();
          setResetImg((e) => !e);
          setImages({});
          onClose();
          setDisabled(false);
        })
        .catch((error) => {
          handleErrors(error, setError, setFocus);
          setDisabled(false);
          console.log("====================================");
          console.log(error);
          if (error.status === 409) {
            setError("phoneNumber", {
              message: "Đã có số điện thoại này",
            });
          }
          console.log("====================================");
        });
    });
  };

  const onChange = (data) => {
    const selectedImages = data;
    setImages(selectedImages);
  };
  return (
    <div>
      <div className="p-4 bg-white ">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Tạo tài khoản người dùng
        </h2>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto mt-2 max-w-xl "
          >
            <div className=" overflow-y-auto p-2">
              <div
                className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2"
                // style={{ height: "65vh" }}
              >
                <div className="sm:col-span-2">
                  <div className="mt-2.5">
                    <ComInput
                      type="name"
                      label={"Họ và Tên"}
                      placeholder={"Vui lòng nhập Họ và Tên"}
                      {...register("fullName")}
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-1">
                  <div className="mt-2.5">
                    <ComInput
                      type="numbers"
                      label={"Số điện thoại"}
                      placeholder={"Vui lòng nhập số điện thoại"}
                      {...register("phoneNumber")}
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-1">
                  <div className="mt-2.5">
                    <ComInput
                      type="numbers"
                      label={"Số CMND/CCCD "}
                      placeholder={"Vui lòng nhập số CMND/CCCD "}
                      {...register("cccd")}
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-1">
                  <div className="mt-2.5">
                    <ComDatePicker
                      type="numbers"
                      disabledDate={DateOfBirth}
                      label={"Ngày tháng năm sinh"}
                      placeholder={"VD:17-12-2000"}
                      {...register("dateOfBirth")}
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-1">
                  <div className="mt-2.5">
                    <ComSelect
                      size={"large"}
                      style={{
                        width: "100%",
                      }}
                      label="Chọn giới tính"
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
                          value: "Male",
                          label: `Nam`,
                        },
                        {
                          value: "Female",
                          label: `Nữ`,
                        },
                      ]}
                      required
                      {...register("gender")}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="mt-2.5">
                    <ComInput
                      type="text"
                      label={"Gmail"}
                      placeholder={"Vui lòng nhập Gmail"}
                      {...register("email")}
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="mt-2.5">
                    <ComInput
                      type="text"
                      label={"Địa chỉ"}
                      placeholder={"Vui lòng nhập Địa chỉ"}
                      {...register("address")}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <ComUpImgOne
                  onChange={onChange}
                  reset={resetImg}
                  label={"Hình ảnh"}
                />
              </div>
              <div className="mt-10">
                <ComButton
                  htmlType="submit"
                  disabled={disabled}
                  type="primary"
                  className="block w-full rounded-md bg-[#0F296D]  text-center text-sm font-semibold text-white shadow-sm hover:bg-[#0F296D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Tạo mới
                </ComButton>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
