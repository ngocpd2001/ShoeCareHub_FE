import React, { useEffect, useState } from "react";
import ComButton from "../../../Components/ComButton/ComButton";
import { FormProvider, useForm } from "react-hook-form";
import ComInput from "../../../Components/ComInput/ComInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { firebaseImgs } from "../../../upImgFirebase/firebaseImgs";
import ComUpImg from "../../../Components/ComUpImg/ComUpImg";
import { useNotification } from "../../../Notification/Notification";
import ComUpImgOne from "../../../Components/ComUpImg/ComUpImgOne";
import ComDatePicker from "../../../Components/ComDatePicker/ComDatePicker";
import { DateOfBirth } from "../../../Components/ComDateDisabled/DateOfBirth";
import { putData } from "../../../api/api";
import { firebaseImg } from "../../../upImgFirebase/firebaseImg";
import {
  addressRegex,
  cccdRegex,
  emailRegex,
  nameRegex,
} from "../../../regexPatterns";
import { handleErrors } from "../../../Components/errorUtils/errorUtils";

export default function EditEmployee({ selectedData, onClose, tableRef }) {
  const [image, setImages] = useState([]);
  const { notificationApi } = useNotification();
  const [disabled, setDisabled] = useState(false);
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
    // phoneNumber: yup
    //   .string()
    //   // .required("Vui lòng nhập đủ số điện thoại")
    //   .nullable()
    //   .matches(phoneNumberRegex, "Vui lòng nhập đúng số số điện thoại"),
    cccd: yup
      .string()
      .matches(cccdRegex, "Vui lòng nhập đúng số CMND/CCCD (9 hoặc 12 chữ số)")
      .required("Vui lòng nhập đủ số CMND/CCCD"),
    address: yup
      .string()
      .matches(addressRegex, "Vui lòng nhập địa chỉ hợp lệ")
      .required("Vui lòng nhập địa chỉ")
      .min(5, "Địa chỉ quá ngắn, vui lòng nhập tối thiểu 5 ký tự")
      .max(100, "Địa chỉ quá dài, vui lòng nhập tối đa 100 ký tự"),
    email: yup
      .string()
      .matches(emailRegex, "Vui lòng nhập địa chỉ email hợp lệ")
      .notRequired(),
  });
  const methods = useForm({
    resolver: yupResolver(CreateProductMessenger),
    defaultValues: {
      name: "",
      phoneNumber: "",
      dateOfBirth: selectedData?.dateOfBirth ? selectedData?.dateOfBirth : null,
    },
    values: selectedData,
  });

  const { handleSubmit, register, setFocus, watch, setValue, setError } =
    methods;
  const onSubmit = (data) => {
    setDisabled(true);
    firebaseImg(image).then((dataImg) => {
      console.log("ảnh nè : ", dataImg);
      setDisabled(true);
      if (dataImg) {
        const dataPut = { ...data, avatarUrl: dataImg };
        putData(`/users`, selectedData.id, dataPut)
          .then((data) => {
            notificationApi("success", "Cập nhật thành công", "Đã cập nhật");
            setTimeout(() => {}, 100);
            tableRef();
            setDisabled(false);
            onClose();
          })
          .catch((error) => {
            console.log(error);
            handleErrors(error, setError, setFocus);
            setDisabled(false);
            if (error.status === 409) {
              setError("phoneNumber", {
                message: "Đã có số điện thoại này",
              });
              setFocus("phoneNumber");
            }
          });
      } else {
        const dataPut = { ...data, avatarUrl: selectedData.avatarUrl };
        putData(`/users`, selectedData.id, dataPut)
          .then((data) => {
            notificationApi("success", "Cập nhật thành công", "Đã cập nhật");
            setTimeout(() => {}, 100);
            tableRef();
            onClose();
            setDisabled(false);
          })
          .catch((error) => {
            console.log(error);
            handleErrors(error, setError, setFocus);
            setDisabled(false);
          });
      }
    });
  };
  useEffect(() => {
    setImages([]);
  }, [selectedData]);
  const onChange = (data) => {
    const selectedImages = data;

    // Tạo một mảng chứa đối tượng 'originFileObj' của các tệp đã chọn
    // const newImages = selectedImages.map((file) => file.originFileObj);
    // Cập nhật trạng thái 'image' bằng danh sách tệp mới
    console.log([selectedImages]);
    setImages(selectedImages);
    // setFileList(data);
  };
  return (
    <div>
      <div className="p-4 bg-white ">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Cập nhật thông tin
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
                {/* <div className="sm:col-span-1">
                  <div className="mt-2.5">
                    <ComInput
                      type="numbers"
                      label={"Số điện thoại"}
                      placeholder={"Vui lòng nhập số điện thoại"}
                      {...register("phoneNumber")}
                      required
                    />
                  </div>
                </div> */}
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
                      // required
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
                      // required
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
            <ComUpImgOne
              imgUrl={selectedData.avatarUrl}
              onChange={onChange}
              label={"Hình ảnh"}
            />
            <div className="mt-10">
              <ComButton
                htmlType="submit"
                disabled={disabled}
                type="primary"
                className="block w-full rounded-md bg-[#0F296D]  text-center text-sm font-semibold text-white shadow-sm hover:bg-[#0F296D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Cập nhật
              </ComButton>
            </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
