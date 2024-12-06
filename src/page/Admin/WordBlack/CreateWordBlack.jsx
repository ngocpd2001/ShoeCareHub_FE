import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNotification } from "../../../Notification/Notification";
import ComInput from "../../../Components/ComInput/ComInput";
import ComButton from "../../../Components/ComButton/ComButton";
import { getData, postData, putData } from "../../../api/api";

import { YupBranch } from "./../../../yup/YupBranch";
import ComSelect from "../../../Components/ComInput/ComSelect";
import ComTextArea from "../../../Components/ComInput/ComTextArea";
import { YupBlacklist } from "./../../../yup/YupBlacklist";
// Thiết lập icon cho Marker (khắc phục vấn đề với icon mặc định của Leaflet)

export default function CreateWordBlack({ onClose, tableRef }) {
  const [disabled, setDisabled] = useState(false);
  const { notificationApi } = useNotification();
  const [file, setFile] = useState(null);
  const methods = useForm({
    resolver: yupResolver(YupBlacklist),
  });
  console.log("====================================");

  console.log("====================================");

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  // Hàm submit form
  const onSubmit = (data) => {
    console.log(data);
    putData(``, "word-blacklist", {
      ...data,
    })
      .then((response) => {
        console.log("Tạo thành công:", response);
        setDisabled(false);
        notificationApi("success", "Thành công", "Thêm từ thành công.");
        setTimeout(() => {
          if (tableRef.current) {
            // Kiểm tra xem ref đã được gắn chưa
            tableRef.current.reloadData();
          }
        }, 100);
        onClose();
      })
      .catch((error) => {
        setDisabled(false);
        console.error("Lỗi:", error);
        notificationApi("error", "Lỗi", `${error?.data?.message}`);
      });
  };

  // Hàm xử lý khi người dùng chọn file
  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  // Hàm gửi tệp lên server
  const handleFileUpload = () => {
    if (!file) {
      notificationApi("error", "Lỗi", "Vui lòng chọn tệp.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    postData(`/word-blacklist/import-blacklist`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        notificationApi("success", "Thành công", "Thêm các từ thành công.");
        setTimeout(() => {
          if (tableRef.current) {
            tableRef.current.reloadData();
          }
        }, 100);
        onClose();
      })
      .catch((error) => {
        console.error("Lỗi:", error);
        notificationApi("error", "Lỗi", `${error?.data?.message}`);
      });
  };
  return (
    <div>
      <h2 className="text-xl font-semibold text-blue-800 mb-4 ml-4">
        Thêm từ cấm
      </h2>
      <label
        htmlFor="file-upload"
        className="block text-sm font-medium text-gray-700"
      >
        Thêm 1 từ cấm
      </label>
      <div className="">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto ">
            <div className="overflow-y-auto p-4">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="mt-2.5 sm:col-span-2">
                  <ComInput
                    type="text"
                    label={"Từ cấm"}
                    placeholder={"Từ cấm"}
                    required
                    {...register("word")}
                  />
                </div>
                <div className="mt-2.5 sm:col-span-2">
                  <ComInput
                    type="text"
                    label={"Ghi chú"}
                    placeholder={"Ghi chú"}
                    required
                    {...register("note")}
                  />
                </div>
              </div>

              <div className="mt-10 flex justify-end gap-6">
                <div>
                  <ComButton
                    htmlType="submit"
                    disabled={disabled}
                    className={`block w-full rounded border-[#E0E2E7] border-md bg-[#0F296D] text-center text-sm font-semibold text-white shadow-sm hover:bg-[#0F296D] ${
                      disabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {disabled ? "Đang tạo gói..." : "Tạo từ cấm mới"}
                  </ComButton>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
      <div className=" my-8 mx-4 h-[1px] bg-slate-800"></div>
      <div>
        {/* Thêm phần tử file input */}
        <div className="mt-2.5 sm:col-span-2">
          <label
            htmlFor="file-upload"
            className="block text-sm font-medium text-gray-700"
          >
            Tải lên tệp từ cấm
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={onFileChange}
            className="mt-1 block my-8 w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {file && (
            <div className="mt-2 text-sm text-gray-500">
              <span className="font-semibold">File đã chọn:</span> {file.name}
            </div>
          )}
          <div>
            <ComButton
              type="button"
              onClick={handleFileUpload}
              disabled={disabled || !file}
              className="block w-full rounded border-[#E0E2E7] border-md bg-[#0F296D] text-center text-sm font-semibold text-white shadow-sm hover:bg-[#0F296D]"
            >
              {disabled ? "Đang tải lên..." : "Tải lên tệp"}
            </ComButton>
          </div>
        </div>
      </div>
    </div>
  );
}
