import React, { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNotification } from "../../../Notification/Notification";
import { putData } from './../../../api/api';
import ComInput from "../../../Components/ComInput/ComInput";
import ComUpImgOne from "../../../Components/ComUpImg/ComUpImgOne";
import ComButton from "../../../Components/ComButton/ComButton";
import ComTextArea from './../../../Components/ComInput/ComTextArea';


export default function EditBlog({ selectedUpgrede, onClose, tableRef }) {
  const [disabled, setDisabled] = useState(false);
  const { notificationApi } = useNotification();
  const [image, setImages] = useState(null);
  const methods = useForm({
    resolver: yupResolver(),
    values: selectedUpgrede,
  });
  const {
    handleSubmit,
    register,
    setFocus,
    watch,
    setValue,
    setError,
    trigger,
    formState: { errors },
    control,
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "descriptions",
  });

  const onChange = (data) => {
    const selectedImages = data;
    console.log(selectedImages);
    setImages(selectedImages);
  };

  const onSubmit = (data) => {
    console.log("====================================");
    console.log(data);
    console.log("====================================");
    setDisabled(true);
    if (!image) {
     
      return;
    } else {
      const formData = new FormData();
      formData.append("thumbnailFile", image);
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("status", data.status);
      putData("/blog", selectedUpgrede.id, formData)
        .then((e) => {
          notificationApi("success", "Thành công", "Đã cập nhật");
          setDisabled(false);
          setTimeout(() => {
            tableRef();
          }, 100);
          onClose();
        })
        .catch((error) => {
          console.log(error);
          setDisabled(false);

          notificationApi("error", "Không thành công", "Vui lòng thử lại");
        });
    }
  };
  return (
    <div>
      <div className="bg-white">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Cập nhật blog
        </h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-xl">
            <div className="overflow-y-auto p-4">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <div className="mt-2.5">
                    <ComInput
                      type="text"
                      label={"Tên bài viết"}
                      placeholder={"Tên bài viết"}
                      {...register("title")}
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="mt-2.5">
                    <ComTextArea
                      label={"Nội dung bài viết "}
                      placeholder={"Vui lòng nhập Nội dung bài viết "}
                      {...register("content")}
                      rows={5}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-2">
                <ComUpImgOne
                  onChange={onChange}
                  label={"Hình ảnh Blog"}
                  error={image ? "" : "Vui lòng chọn hình ảnh"}
                  required
                  imgUrl={selectedUpgrede?.thumbnail}
                />
              </div>
              <div className="mt-10">
                <ComButton
                  htmlType="submit"
                  disabled={disabled}
                  className="block w-full rounded-md bg-[#0F296D] text-center text-sm font-semibold text-white shadow-sm hover:bg-[#0F296D] "
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
