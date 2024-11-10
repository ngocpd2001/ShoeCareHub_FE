import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNotification } from "../../../Notification/Notification";
import ComInput from "../../../Components/ComInput/ComInput";
import ComButton from "../../../Components/ComButton/ComButton";
import ComUpImgOne from "../../../Components/ComUpImg/ComUpImgOne";
import ComTextArea from "../../../Components/ComInput/ComTextArea";
import { getData, postData } from "../../../api/api";
import { Breadcrumb, Upload } from "antd";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import ComSelect from "./../../../Components/ComInput/ComSelect";
import ComUpImg from "./../../../Components/ComUpImg/ComUpImg";
import ComNumber from "./../../../Components/ComInput/ComNumber";
import ComDatePicker from "./../../../Components/ComDatePicker/ComDatePicker";
import { YupSevice } from "../../../yup/YupSevice";
import { firebaseImgs } from "./../../../upImgFirebase/firebaseImgs";
import { useStorage } from "../../../hooks/useLocalStorage";

export default function CreateSevice() {
  const [disabled, setDisabled] = useState(false);
  const { notificationApi } = useNotification();
  const [image, setImages] = useState(null);
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useStorage("user", null);

  const methods = useForm({
    resolver: yupResolver(YupSevice),
    defaultValues: {
      title: "",
      content: "",
      newPrice:null
    },
  });
  useEffect(() => {
    getData(`branches/business/${user?.businessId}`)
      .then((response) => {
        console.log("", response?.data?.data);
        setBranches(
          response?.data?.data.map((branch) => ({
            value: branch.id,
            label: `${branch.name} 
         ${branch.address},
          ${branch.ward},
           ${branch.city}`,
          }))
        );
      })
      .catch((error) => {
        console.error("Lỗi ", error);
      });

    getData("/categories?PageIndex=1&PageSize=999999")
      .then((response) => {
        console.log("Categories:", response?.data?.data);
        setCategories(
          response?.data?.data?.items.map((category) => ({
            value: category.id,
            label: category.name, // Hoặc thêm định dạng khác nếu cần
          }))
        );
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh mục:", error);
      });
  }, [user?.id]);
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = methods;

  // Hàm thay đổi hình ảnh
  const onChange = (data) => {
    const selectedImages = data;
    const newImages = selectedImages.map((file) => file.originFileObj);
    setImages(newImages);
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
    } else {
      setDisabled(true);
      // Upload hình ảnh lên Firebase và lấy URLs
      firebaseImgs(image)
        .then((uploadedUrls) => {
          // Phân loại URL nào là ảnh, URL nào là video
          const assetUrls = uploadedUrls.map((url) => {
            const isImage = url.includes("mp4"); // Điều kiện giả định để kiểm tra xem có phải là hình ảnh
            return {
              url: url,
              isImage: isImage ? false : true,
              type: isImage ? "video" : "image",
            };
          });

          // Tạo dữ liệu dịch vụ mới với các URL đã được phân loại
          const serviceData = {
            ...data,
            assetUrls: assetUrls,
            newPrice: data.newPrice === "" ? null : data.newPrice,
          };

          // Gửi yêu cầu tạo dịch vụ
          console.log(serviceData);

          postData(`services`, serviceData)
            .then((response) => {
              console.log("Tạo dịch vụ thành công:", response);
              setDisabled(false);

              notificationApi(
                "success",
                "Thành công",
                "Dịch vụ đã được tạo thành công."
              );
            })
            .catch((error) => {
              setDisabled(false);
              console.error("Lỗi khi tạo dịch vụ:", error);
              notificationApi("error", "Lỗi", `${error.data.message}`);
            });
        })
        .catch((error) => {
          setDisabled(false);
          console.error("Lỗi khi upload hình ảnh/video:", error);
          notificationApi(
            "error",
            "Lỗi",
            "Không thể upload hình ảnh/video. Vui lòng thử lại."
          );
        });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4 ml-4">
        Thêm dịch vụ
      </h2>
      <Breadcrumb
        className="ml-4"
        items={[
          {
            title: "Cửa hàng",
          },
          {
            title: <Link to="/owner/service">Dịch vụ</Link>,
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
                      {...register("name")}
                    />
                  </div>
                  <div className="mt-2.5">
                    <ComTextArea
                      label={"Nội dung bài viết"}
                      placeholder={"Vui lòng nhập nội dung bài viết"}
                      {...register("description")}
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
                      onChangeValue={(e, value) => {
                        setValue(e, value);
                      }}
                      mode="default"
                      options={categories}
                      required
                      {...register("categoryId")}
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
                      onChangeValue={(e, value) => {
                        setValue(e, value);
                      }}
                      mode="default"
                      options={[
                        {
                          value: "AVAILABLE",
                          label: `Hoạt Động`,
                        },
                        {
                          value: "UNAVAILABLE",
                          label: `Tạm ngừng`,
                        },
                      ]}
                      required
                      {...register("status")}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2 bg-white  rounded border-[#E0E2E7] border p-5 mt-2.5">
                  <h2 className="text-xl font-semibold mb-4">
                    Hình ảnh  
                  </h2>
                  <ComUpImg
                    onChange={onChange}
                    // label={"Hình ảnh"}
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
                    onChangeValue={(e, value) => {
                      console.log(value);
                      setValue(e, value);
                    }}
                    mode="multiple"
                    showSearch
                    options={branches}
                    required
                    {...register("branchId")}
                  />
                </div>
              </div>
              <div className="sm:col-span-1 bg-white  rounded border-[#E0E2E7] border p-5 mt-2.5">
                <h2 className="text-xl font-semibold mb-4">Giá</h2>
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-4">
                  <div className="sm:col-span-2">
                    <ComNumber
                      // defaultValue={1000}
                      min={1000}
                      label={"Giá dịch vụ"}
                      placeholder={"Vui lòng nhập số tiền"}
                      {...register("price")}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <ComNumber
                      label={"Giá giảm (đ)"}
                      min={1000}
                      placeholder={"Vui lòng nhập số tiền"}
                      {...register("newPrice")}
                      onChangeValue={(e, value) => {
                        console.log(e, value);

                        if (value === "") {
                          setValue(e, null);
                        }
                      }}
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
                    <div className="text-black"> Hủy bỏ</div>
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
    </div>
  );
}
