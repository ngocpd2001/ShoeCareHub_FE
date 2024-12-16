import React, { useEffect, useState } from "react";
import ComButton from "./../../../Components/ComButton/ComButton";
import { FormProvider, useForm } from "react-hook-form";
import ComTextArea from "./../../../Components/ComInput/ComTextArea";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNotification } from "./../../../Notification/Notification";
import { putData } from "../../../api/api";
import { Image } from "antd";
import ComSelect from "../../../Components/ComInput/ComSelect";

export default function EditFeedback({ selectedUser, onClose, tableRef }) {
  const [image, setImages] = useState([]);
  const { notificationApi } = useNotification();
  const [disabled, setDisabled] = useState(false);
  const [isAutoChecked, setIsAutoChecked] = useState(false); // Trạng thái kiểm tra tự động

  // Validation schema
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

  const { handleSubmit, register, watch, setValue, reset } = methods;

  const onSubmit = (data, isAuto = false) => {
    setDisabled(true);
    putData(`/feedbacks`, selectedUser.id, {
      isValidContent: data.isValidContent,
      isValidAsset: data.isValidAsset,
      status: data.status,
    })
      .then(() => {
        if (!isAuto) {
          notificationApi("success", "Cập nhật thành công", "Đã cập nhật");
        }
        tableRef(); // Reload lại bảng dữ liệu
        onClose();
        setDisabled(false);
      })
      .catch(() => {
        setDisabled(false);
        if (!isAuto) {
          notificationApi("error", "Cập nhật không thành công", "Đã cập nhật");
        }
      });
  };

  useEffect(() => {
    setImages([]);
    setIsAutoChecked(false); // Reset trạng thái kiểm tra tự động khi mở form
    reset(selectedUser); // Reset giá trị form theo feedback được chọn
  }, [selectedUser, reset]);

  const imageUrls = selectedUser?.assetUrls?.map((image) => image?.url);

  const handleManualUpdate = (field, value) => {
    setValue(field, value, { shouldValidate: true });

    const isContentValid =
      field === "isValidContent" ? value : watch("isValidContent");
    const isAssetValid =
      field === "isValidAsset" ? value : watch("isValidAsset");

    // Nếu cả hai trường hợp lệ, tự động đặt trạng thái là ACTIVE
    if (isContentValid && isAssetValid) {
      setValue("status", "ACTIVE", { shouldValidate: true });
    } else {
      // Nếu một trong hai không hợp lệ, tự động đặt trạng thái là SUSPENDED
      setValue("status", "SUSPENDED", { shouldValidate: true });
    }
  };

  useEffect(() => {
    if (!isAutoChecked && watch("status") === "PENDING") {
      const isContentValid = watch("isValidContent");
      const isAssetValid = watch("isValidAsset");

      if (
        isContentValid === true &&
        isAssetValid === true &&
        watch("status") !== "ACTIVE"
      ) {
        // Nếu cả hai đều hợp lệ, đặt trạng thái thành ACTIVE
        setValue("status", "ACTIVE", { shouldValidate: true });
        handleSubmit((data) => onSubmit(data, true))(); // Submit tự động
        setIsAutoChecked(true); // Đánh dấu đã kiểm tra tự động
      } else if (
        (isContentValid === false || isAssetValid === false) &&
        watch("status") !== "SUSPENDED"
      ) {
        // Nếu một trong hai hoặc cả hai không hợp lệ, đặt trạng thái thành SUSPENDED
        setValue("status", "SUSPENDED", { shouldValidate: true });
        handleSubmit((data) => onSubmit(data, true))(); // Submit tự động
        setIsAutoChecked(true); // Đánh dấu đã kiểm tra tự động
      }
    }
  }, [
    watch("isValidContent"),
    watch("isValidAsset"),
    watch("status"),
    isAutoChecked,
    handleSubmit,
    setValue,
    onSubmit,
  ]);

  return (
    <div>
      <div className="p-4 bg-white">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">
          Cập nhật đánh giá
        </h2>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit((data) => onSubmit(data, false))}
            className="mx-auto mt-2 max-w-xl"
          >
            <div className="overflow-y-auto p-2">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                {/* Nội dung */}
                <div className="sm:col-span-2">
                  <div className="mt-2.5">
                    <ComTextArea
                      type="name"
                      label={"Nội dung"}
                      rows={5}
                      readOnly
                      placeholder={"Nội dung"}
                      {...register("content")}
                      required
                    />
                  </div>
                </div>

                {/* Ảnh */}
                <div className="sm:col-span-2">
                  <div className="mt-2.5">
                    <div className="h-24 flex items-center overflow-hidden">
                      <Image.PreviewGroup>
                        {imageUrls?.map((item, index) => (
                          <div className="flex h-24 gap-4" key={index}>
                            <Image
                              maskClassName="object-cover w-24 h-24 object-cover object-center flex items-center justify-center"
                              className="w-24 h-24 object-center flex items-center justify-center"
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

                {/* Trạng thái hình ảnh */}
                <div className="sm:col-span-1">
                  <div className="mt-2.5">
                    <ComSelect
                      size={"large"}
                      style={{
                        width: "100%",
                      }}
                      label="Trạng thái hình ảnh"
                      placeholder="Hình ảnh"
                      onChangeValue={(e, value) =>
                        handleManualUpdate("isValidAsset", value)
                      }
                      value={watch("isValidAsset")}
                      mode="default"
                      options={[
                        { value: true, label: `Hợp lệ` },
                        { value: false, label: `Không hợp lệ` },
                      ]}
                      required
                      {...register("isValidAsset")}
                    />
                  </div>
                </div>

                {/* Trạng thái nội dung */}
                <div className="sm:col-span-1">
                  <div className="mt-2.5">
                    <ComSelect
                      size={"large"}
                      style={{
                        width: "100%",
                      }}
                      label="Trạng thái nội dung"
                      placeholder="Trạng thái nội dung"
                      onChangeValue={(e, value) =>
                        handleManualUpdate("isValidContent", value)
                      }
                      value={watch("isValidContent")}
                      mode="default"
                      options={[
                        { value: true, label: `Hợp lệ` },
                        { value: false, label: `Không hợp lệ` },
                      ]}
                      required
                      {...register("isValidContent")}
                    />
                  </div>
                </div>

                {/* Trạng thái */}
                <div className="sm:col-span-2">
                  <div className="mt-2.5">
                    <ComSelect
                      size={"large"}
                      style={{
                        width: "100%",
                        backgroundColor: "#fff", // Giữ nền bình thường
                        pointerEvents: "none", // Ngăn người dùng tương tác
                        borderColor: "#d9d9d9", // Giữ đường viền như bình thường
                      }}
                      label="Trạng thái"
                      placeholder="Trạng thái"
                      value={watch("status")}
                      mode="default"
                      options={[
                        { value: "ACTIVE", label: `Đã duyệt` },
                        { value: "SUSPENDED", label: `Từ chối` },
                      ]}
                      required
                      {...register("status")}
                    />
                  </div>
                </div>
              </div>

              {/* Nút cập nhật */}
              <div className="mt-10">
                <ComButton
                  htmlType="submit"
                  type="primary"
                  disabled={disabled}
                  className="block w-full rounded-md bg-[#0F296D] text-center text-sm font-semibold text-white shadow-sm hover:bg-[#0F296D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
