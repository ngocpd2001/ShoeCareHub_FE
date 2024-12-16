import React, { useEffect, useState } from "react";
import ComButton from "./../../../Components/ComButton/ComButton";
import { FormProvider, useForm } from "react-hook-form";
import ComTextArea from "./../../../Components/ComInput/ComTextArea";
import { yupResolver } from "@hookform/resolvers/yup";
import { Image } from "antd";
import ComSelect from "../../../Components/ComInput/ComSelect";
import { putData } from "../../../api/api";
import { useNotification } from "./../../../Notification/Notification";

export default function EditFeedback({ selectedUser, onClose, tableRef }) {
  const [disabled, setDisabled] = useState(false);
  const { notificationApi } = useNotification();

  const methods = useForm({
    resolver: yupResolver({}),
    defaultValues: {
      ...selectedUser,
    },
  });

  const { handleSubmit, register, watch, setValue, reset } = methods;

  const onSubmit = (data) => {
    setDisabled(true);
    putData(`/feedbacks`, selectedUser.id, {
      isValidContent: data.isValidContent,
      isValidAsset: data.isValidAsset,
      status: data.status,
    })
      .then(() => {
        notificationApi("success", "Cập nhật thành công", "Đã cập nhật");
        tableRef();
        onClose();
      })
      .catch(() => {
        notificationApi("error", "Cập nhật không thành công", "Đã cập nhật");
      })
      .finally(() => {
        setDisabled(false);
      });
  };

  useEffect(() => {
    reset(selectedUser);
  }, [selectedUser, reset]);

  // Theo dõi và tự động cập nhật trạng thái đánh giá
  useEffect(() => {
    const isValidContent = watch("isValidContent");
    const isValidAsset = watch("isValidAsset");

    if (isValidContent && isValidAsset) {
      setValue("status", "ACTIVE");
    } else {
      setValue("status", "SUSPENDED");
    }
  }, [watch("isValidContent"), watch("isValidAsset"), setValue]);

  const imageUrls = selectedUser?.assetUrls?.map((image) => image?.url);

  return (
    <div>
      <div className="p-4 bg-white">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Cập nhật người dùng
        </h2>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto mt-2 max-w-xl"
          >
            <div className="overflow-y-auto p-2">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                {/* Nội dung */}
                <div className="sm:col-span-2">
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

                {/* Ảnh */}
                <div className="sm:col-span-2">
                  <div className="mt-2.5">
                    <div className="h-24 flex items-center overflow-hidden">
                      <Image.PreviewGroup>
                        {imageUrls?.map((item, index) => (
                          <div className="flex h-24 gap-4" key={index}>
                            <Image
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
                  <ComSelect
                    size="large"
                    style={{
                      width: "100%",
                    }}
                    label="Trạng thái hình ảnh"
                    placeholder="Hình ảnh"
                    onChangeValue={(e, value) =>
                      setValue("isValidAsset", value)
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

                {/* Trạng thái nội dung */}
                <div className="sm:col-span-1">
                  <ComSelect
                    size="large"
                    style={{
                      width: "100%",
                    }}
                    label="Trạng thái nội dung"
                    placeholder="Trạng thái nội dung"
                    onChangeValue={(e, value) =>
                      setValue("isValidContent", value)
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

                {/* Trạng thái đánh giá */}
                <div className="sm:col-span-2">
                  <ComSelect
                    size="large"
                    style={{
                      width: "100%",
                      pointerEvents: "none", // Ngăn người dùng tương tác
                      backgroundColor: "#f5f5f5", // Đặt màu nền xám để thể hiện không chỉnh sửa được
                    }}
                    label="Trạng thái đánh giá"
                    placeholder="Trạng thái đánh giá"
                    value={watch("status")}
                    mode="default"
                    options={[
                      { value: "PENDING", label: `Chờ duyệt` },
                      { value: "ACTIVE", label: `Đã duyệt` },
                      { value: "SUSPENDED", label: `Từ chối` },
                    ]}
                    required
                    {...register("status")}
                  />
                </div>
              </div>

              {/* Nút cập nhật */}
              <div className="mt-10">
                <ComButton
                  htmlType="submit"
                  type="primary"
                  disabled={disabled}
                  className="block w-full rounded-md bg-[#0F296D] text-center text-sm font-semibold text-white shadow-sm hover:bg-[#0F296D]"
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
