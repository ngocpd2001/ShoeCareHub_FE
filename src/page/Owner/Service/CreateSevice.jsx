import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNotification } from "../../../Notification/Notification";
import ComInput from "../../../Components/ComInput/ComInput";
import ComButton from "../../../Components/ComButton/ComButton";
import ComUpImgOne from "../../../Components/ComUpImg/ComUpImgOne";
import ComTextArea from "../../../Components/ComInput/ComTextArea";
import { postData } from "../../../api/api";
import { Breadcrumb, Upload } from "antd";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import ComSelect from "./../../../Components/ComInput/ComSelect";
import ComUpImg from "./../../../Components/ComUpImg/ComUpImg";
import ComNumber from "./../../../Components/ComInput/ComNumber";
import ComDatePicker from './../../../Components/ComDatePicker/ComDatePicker';
import { YupSevice } from "../../../yup/YupSevice";

export default function CreateSevice() {
  const [disabled, setDisabled] = useState(false);
  const { notificationApi } = useNotification();
  const [image, setImages] = useState(null);

  const methods = useForm({
    resolver: yupResolver(YupSevice),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;
  console.log("====================================");
  console.log(image);
  console.log("====================================");
  // Hàm thay đổi hình ảnh
  const onChange = (data) => {
    const selectedImages = data;
    console.log(selectedImages);
    setImages(selectedImages);
  };

  // Hàm submit form
  const onSubmit = (data) => {
    // Kiểm tra nếu chưa chọn hình ảnh
    if (!image) {
      notificationApi(
        "error",
        "Hình ảnh không hợp lệ",
        "Vui lòng chọn hình ảnh."
      );
      return;
    }

  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Thêm dịch vụ</h2>
      <Breadcrumb
        items={[
          {
            title: "Cửa hàng",
          },
          {
            title: <Link to="/admin/service">Dịch vụ</Link>,
          },
          {
            title: "Thêm dịch vụ",
          },
        ]}
      />
      <div className="">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto ">
            <div className="overflow-y-auto p-4">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-4">
                <div className="sm:col-span-3 bg-white  rounded border-[#E0E2E7] border p-5">
                  <h2 className="text-xl font-semibold mb-4">
                    Thông tin chung
                  </h2>

                  <div className="mt-2.5">
                    <ComInput
                      type="text"
                      label={"Tên bài viết"}
                      placeholder={"Tên bài viết"}
                      error={errors.title?.message}
                      required
                      {...register("title")}
                    />
                  </div>
                  <div className="mt-2.5">
                    <ComTextArea
                      label={"Nội dung bài viết"}
                      placeholder={"Vui lòng nhập nội dung bài viết"}
                      {...register("content")}
                      rows={5}
                      error={errors.content?.message}
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-1 h-full flex flex-col justify-between ">
                  <div className=" bg-white rounded border-[#E0E2E7] border p-5 h-full ">
                    <h2 className="text-xl font-semibold mb-4">Danh mục</h2>
                    <ComSelect
                      size={"large"}
                      style={{
                        width: "100%",
                      }}
                      label="Danh mục dịch vụ"
                      placeholder="Lựa chọn"
                      onChangeValue={(e, value) => {}}
                      mode="default"
                      options={[
                        {
                          value: "Khác",
                          label: `Khác`,
                        },
                      ]}
                      required
                      {...register("aaa")}
                    />
                  </div>
                  <div className="mt-2.5 bg-white h-full p-5 rounded border-[#E0E2E7] border">
                    <h2 className="text-xl font-semibold mb-4">Trạng thái</h2>
                    <ComSelect
                      size={"large"}
                      style={{
                        width: "100%",
                      }}
                      label="Trạng thái dịch vụ"
                      placeholder="Lựa chọn"
                      onChangeValue={(e, value) => {}}
                      mode="default"
                      options={[
                        {
                          value: "Khác",
                          label: `Khác`,
                        },
                      ]}
                      required
                      {...register("sss")}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2 bg-white  rounded border-[#E0E2E7] border p-5 mt-2.5">
                  <h2 className="text-xl font-semibold mb-4">
                    Hình ảnh & Video
                  </h2>
                  <ComUpImg
                    onChange={onChange}
                    label={"Hình ảnh"}
                    error={image ? "" : "Vui lòng chọn hình ảnh"}
                    required
                  />
                  <ComUpImg
                    onChange={onChange}
                    label={"Video"}
                    error={image ? "" : "Vui lòng chọn hình ảnh"}
                    required
                  />
                </div>
                <div className="sm:col-span-2 bg-white  rounded border-[#E0E2E7] border p-5 mt-2.5">
                  <h2 className="text-xl font-semibold mb-4">Chi nhánh</h2>
                  <ComSelect
                    size={"large"}
                    style={{
                      width: "100%",
                    }}
                    label="Tên chi nhánh"
                    placeholder="Lựa chọn"
                    onChangeValue={(e, value) => {}}
                    mode="multiple"
                    showSearch
                    options={[
                      {
                        value: "1",
                        label: `Chinh nhánh aaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
                      },
                      {
                        value: "2",
                        label: `Chinh nhánh bbbbbbbbbbbbbbbbbbbbbbbbbbbbb`,
                      },
                      {
                        value: "3",
                        label: `Chinh nhánh ccccccccccccccccccccccccccccc`,
                      },
                    ]}
                    required
                    {...register("sss")}
                  />
                </div>
              </div>
              <div className="sm:col-span-1 bg-white  rounded border-[#E0E2E7] border p-5 mt-2.5">
                <h2 className="text-xl font-semibold mb-4">Giá</h2>
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-4">
                  <div className="sm:col-span-2">
                    <ComNumber
                      type={"numbers"}
                      money
                      defaultValue={10000}
                      min={10000}
                      label={"Giá dịch vụ"}
                      placeholder={"Vui lòng nhập số tiền"}
                      {...register("price")}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <ComNumber
                      type={"numbers"}
                      money
                      defaultValue={10000}
                      min={10000}
                      label={"Giá giảm (đ)"}
                      placeholder={"Vui lòng nhập số tiền"}
                      {...register("price")}
                      // required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <ComDatePicker
                      label={"Ngày hết hạn giảm giá (nếu có)"}
                      placeholder={"Vui lòng nhập số tiền"}
                      {...register("price")}
                      // required
                    />
                  </div>
                </div>
              </div>
              <div className="mt-10 flex justify-end gap-6">
                <div>
                  <ComButton
                    className={`block w-full rounded border-[#E0E2E7] border-md bg-[#0F296D] text-center text-sm font-semibold text-white shadow-sm hover:bg-[#0F296D] ${" bg-[#F0F1F3]"}`}
                  >
                  <div className="text-black">  Hủy bỏ</div>
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
            </div>
          </form>
        </FormProvider>
      </div>

      {/* <div>
        <div className="bg-gray-100 min-h-screen p-4">
          <div className="max-w-4xl mx-auto bg-white shadow-md rounded border-[#E0E2E7] border-lg overflow-hidden">
            <form className="p-6 space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Thông tin chung</h2>
                <div>
                  <label
                    htmlFor="serviceName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tên dịch vụ
                  </label>
                  <input
                    type="text"
                    id="serviceName"
                    className="mt-1 block w-full border-gray-300 rounded border-[#E0E2E7] border-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Nhập tên dịch vụ ở đây..."
                  />
                </div>
                <div>
                  <label
                    htmlFor="serviceDescription"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mô tả
                  </label>
                  <textarea
                    id="serviceDescription"
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded border-[#E0E2E7] border-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Nhập mô tả dịch vụ tại đây..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Danh mục</h2>
                <div className="relative">
                  <select
                    id="category"
                    className="block appearance-none w-full bg-white border border-gray-300 rounded border-[#E0E2E7] border-md shadow-sm pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Lựa chọn...</option>
                    <option value="category1">Danh mục 1</option>
                    <option value="category2">Danh mục 2</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Trạng thái</h2>
                <div className="relative">
                  <select
                    id="status"
                    className="block appearance-none w-full bg-white border border-gray-300 rounded border-[#E0E2E7] border-md shadow-sm pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Lựa chọn...</option>
                    <option value="active">Đã dùng</option>
                    <option value="inactive">Chưa dùng</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Hình ảnh & Video</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hình ảnh
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded border-[#E0E2E7] border-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="imageUpload"
                          className="relative cursor-pointer bg-white rounded border-[#E0E2E7] border-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Thêm hình ảnh</span>
                          <input
                            id="imageUpload"
                            name="imageUpload"
                            type="file"
                            className="sr-only"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-24 w-24 object-cover rounded border-[#E0E2E7] border-md"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Video
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded border-[#E0E2E7] border-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="videoUpload"
                          className="relative cursor-pointer bg-white rounded border-[#E0E2E7] border-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Thêm Video</span>
                          <input
                            id="videoUpload"
                            name="videoUpload"
                            type="file"
                            className="sr-only"
                            onChange={handleVideoUpload}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  {videoPreview && (
                    <div className="mt-2">
                      <video
                        src={videoPreview}
                        controls
                        className="h-24 w-full object-cover rounded border-[#E0E2E7] border-md"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Chi nhánh</h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="branch1"
                      name="branch"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded border-[#E0E2E7] border"
                    />
                    <label
                      htmlFor="branch1"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Chi nhánh 1
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="branch2"
                      name="branch"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500  rounded border-[#E0E2E7] border"
                    />
                    <label
                      htmlFor="branch2"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Chi nhánh 2
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="branch3"
                      name="branch"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded border-[#E0E2E7] border"
                    />
                    <label
                      htmlFor="branch3"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Gói 12 tháng
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Giá</h2>
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Giá dịch vụ
                  </label>
                  <input
                    type="number"
                    id="price"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Nhập giá dịch vụ ở đây..."
                  />
                </div>
                <div>
                  <label
                    htmlFor="discount"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Giá giảm (%)
                  </label>
                  <input
                    type="number"
                    id="discount"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Nhập số % giảm giá..."
                  />
                </div>
                <div>
                  <label
                    htmlFor="discountEndDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ngày hết hạn giảm giá (nếu có)
                  </label>
                  <input
                    type="date"
                    id="discountEndDate"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div> */}
    </div>
  );
}
