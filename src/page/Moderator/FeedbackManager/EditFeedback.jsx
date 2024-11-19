import React, { useEffect, useState } from "react";
import ComButton from "./../../../Components/ComButton/ComButton";
import { FormProvider, useForm } from "react-hook-form";
import ComInput from "./../../../Components/ComInput/ComInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { firebaseImgs } from "../../../upImgFirebase/firebaseImgs";
import ComUpImg from "./../../../Components/ComUpImg/ComUpImg";
import { useNotification } from "./../../../Notification/Notification";
import ComUpImgOne from "../../../Components/ComUpImg/ComUpImgOne";
import ComDatePicker from "../../../Components/ComDatePicker/ComDatePicker";
import { DateOfBirth } from "../../../Components/ComDateDisabled/DateOfBirth";
import dayjs from "dayjs";
import { firebaseImg } from "../../../upImgFirebase/firebaseImg";
import { postData, putData } from "../../../api/api";
import {
  addressRegex,
  cccdRegex,
  emailRegex,
  nameRegex,
  phoneNumberRegex,
} from "../../../regexPatterns";
import { handleErrors } from "../../../Components/errorUtils/errorUtils";
import ComSelect from "../../../Components/ComInput/ComSelect";
import ComTextArea from "../../../Components/ComInput/ComTextArea";
import { Image } from "antd";

export default function EditFeedback({ selectedUser, onClose, tableRef }) {
  const [image, setImages] = useState([]);
  const { notificationApi } = useNotification();
  const [disabled, setDisabled] = useState(false);
  const CreateProductMessenger = yup.object({});
  const methods = useForm({
    resolver: yupResolver(CreateProductMessenger),
    defaultValues: {
      name: "",
      phoneNumber: "",
      dateOfBirth: selectedUser.dateOfBirth ? selectedUser.dateOfBirth : null,
    },
    values: selectedUser,
  });

  const { handleSubmit, register, setFocus, watch, setValue, setError } =
    methods;
  const onSubmit = (data) => {
    setDisabled(true);
    putData(`/feedbacks`, selectedUser.id, {
      isValidContent: data.isValidContent,
      isValidAsset: data.isValidAsset,
      status: data.status,
    })
      .then((e) => {
        notificationApi("success", "Cập nhật thành công ", "Đã cập nhật");
        tableRef();
        onClose();
        setDisabled(false);
      })
      .catch((e) => {
        console.log(e);
        // set các trường hợp lỗi api
        setDisabled(false);
        notificationApi("error", "Cập nhật không thành công", "Đã cập nhật");
      });
  };
  useEffect(() => {
    setImages([]);
  }, [selectedUser]);

  const imageUrls = selectedUser?.assetUrls?.map((image) => image?.url);
  useEffect(() => {}, [watch("isValidAsset"), watch("isValidContent")]);
  return (
    <div>
      <div className="p-4 bg-white ">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Cập nhật người dùng
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
                    <ComTextArea
                      type="name"
                      label={"Nội dung"}
                      rows={5}
                      // disabled
                      readOnly
                      placeholder={"Nội dung"}
                      {...register("content")}
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="mt-2.5">
                    <div className=" h-24 flex items-center overflow-hidden">
                      <Image.PreviewGroup>
                        {imageUrls?.map((item, index) => (
                          <div className="flex h-24 gap-4">
                            <Image
                              key={index}
                              maskClassName="object-cover w-24 h-24 object-cover object-center flex items-center justify-center"
                              className=" w-24 h-24 object-center flex items-center justify-center"
                              src={item}
                              style={{
                                width: "6rem",
                                height: "6rem",
                                padding: 4,
                              }}
                              alt={`image-${index}`}
                              preview={{ mask: "Xem ảnh" }}
                            />
                          </div>
                        ))}
                      </Image.PreviewGroup>
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-1">
                  <div className="mt-2.5">
                    <ComSelect
                      size={"large"}
                      style={{
                        width: "100%",
                      }}
                      label="Trạng thái hình ảnh"
                      placeholder="hình ảnh"
                      onChangeValue={(e, value) => {
                        if (value.length === 0) {
                          setValue("isValidAsset", null, {
                            shouldValidate: true,
                          });
                        } else {
                          setValue("isValidAsset", value, {
                            shouldValidate: true,
                          });
                        }
                        if (watch("isValidContent") & watch("isValidAsset")) {
                          setValue("status", "ACTIVE");
                          console.log(456);
                        } else {
                          setValue("status", "SUSPENDED");
                          console.log("====================================");
                          console.log(123);
                          console.log("====================================");
                        }
                      }}
                      // value={selectedUser}
                      value={watch("isValidAsset")}
                      mode="default"
                      options={[
                        {
                          value: true,
                          label: `Hợp lệ `,
                        },
                        {
                          value: false,
                          label: `Không hợp lệ`,
                        },
                      ]}
                      required
                      {...register("isValidAsset")}
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
                      label="Trạng thái nội dung"
                      placeholder="Trạng thái nội dung"
                      onChangeValue={(e, value) => {
                        if (value.length === 0) {
                          setValue(e, null, {
                            shouldValidate: true,
                          });
                        } else {
                          setValue(e, value, {
                            shouldValidate: true,
                          });
                        }
                        if (watch("isValidContent") & watch("isValidAsset")) {
                          setValue("status", "ACTIVE");
                          console.log(456);
                        } else {
                          setValue("status", "SUSPENDED");
                          console.log("====================================");
                          console.log(123);
                          console.log("====================================");
                        }
                      }}
                      // value={selectedUser}
                      value={watch("isValidContent")}
                      mode="default"
                      options={[
                        {
                          value: true,
                          label: `Hợp lệ `,
                        },
                        {
                          value: false,
                          label: `Không hợp lệ`,
                        },
                      ]}
                      required
                      {...register("isValidContent")}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="mt-2.5">
                    <ComSelect
                      size={"large"}
                      style={{
                        width: "100%",
                      }}
                      label="Trạng thái"
                      placeholder="hình ảnh"
                      onChangeValue={(e, value) => {
                        setValue(e, value, {
                          shouldValidate: true,
                        });
                      }}
                      value={watch("status")}
                      mode="default"
                      options={[
                        {
                          value: "PENDING",
                          label: `Chờ duyệt`,
                        },
                        {
                          value: "ACTIVE",
                          label: `Đã duyệt`,
                        },
                        {
                          value: "SUSPENDED",
                          label: `Từ chối`,
                        },
                      ]}
                      required
                      {...register("status")}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <ComButton
                  htmlType="submit"
                  type="primary"
                  disabled={disabled}
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
