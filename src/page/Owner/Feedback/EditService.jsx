import React, { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNotification } from "../../../Notification/Notification";
import { getData, putData } from "../../../api/api";
import ComInput from "../../../Components/ComInput/ComInput";
import ComUpImgOne from "../../../Components/ComUpImg/ComUpImgOne";
import ComButton from "../../../Components/ComButton/ComButton";
import ComTextArea from "../../../Components/ComInput/ComTextArea";
import ComNumber from "../../../Components/ComInput/ComNumber";
import ComSelect from "../../../Components/ComInput/ComSelect";
import ComUpImg from "../../../Components/ComUpImg/ComUpImg";
import { YupSevice } from "../../../yup/YupSevice";
import { useStorage } from "../../../hooks/useLocalStorage";
import { firebaseImgs } from "../../../upImgFirebase/firebaseImgs";

export default function EditService({ selectedUpgrede, onClose, tableRef }) {
  const [disabled, setDisabled] = useState(false);
  const { notificationApi } = useNotification();
  const [image, setImages] = useState(null);
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useStorage("user", null);
  const methods = useForm({
    resolver: yupResolver(YupSevice),
    values: selectedUpgrede,
  });

  useEffect(() => {
    setValue("branchId", selectedUpgrede.branchId);
    setValue("categoryId", selectedUpgrede.category.id);
    setValue(
      "status",
      selectedUpgrede.status === "Hoạt Động" ? "AVAILABLE" : "UNAVAILABLE"
    );
    if (selectedUpgrede?.promotion?.newPrice) {
      setValue("newPrice", selectedUpgrede?.promotion?.newPrice);
    } else {
      setValue("newPrice", null);
    }
    const getBranchIds = (branchesData) => {
      return branchesData
        .filter((item) => item.status === "Hoạt Động") // Lọc các chi nhánh có status là AVAILABLE
        .map((item) => item.branch.id); // Sau đó lấy id của các chi nhánh đã lọc
    };
    console.log(333333333333, getBranchIds(selectedUpgrede?.branchServices));
    console.log(333333333333, selectedUpgrede?.branchServices);

    setValue("branchId", getBranchIds(selectedUpgrede?.branchServices));
  }, [selectedUpgrede]);
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

  const onChange = (data) => {
    const selectedImages = data;
    const newImages = selectedImages.map((file) => file.originFileObj);
    setImages(newImages);
  };

  // Hàm submit form
  const onSubmit = (data) => {
    // Kiểm tra nếu chưa chọn hình ảnh
    setDisabled(true);
    console.log(data);
    if (!image) {
      putData(`/services`, selectedUpgrede.id, {
        ...data,
        newPrice: data.newPrice === "" ? null : data.newPrice,
      })
        .then((response) => {
          console.log("Tạo dịch vụ thành công:", response);
          setDisabled(false);
          tableRef();
          notificationApi(
            "success",
            "Thành công",
            "Dịch vụ đã được cập nhật thành công."
          );
        })
        .catch((error) => {
          setDisabled(false);
          console.error("Lỗi khi tạo dịch vụ:", error);
          notificationApi("error", "Lỗi", `${error?.data?.message}`);
        });

      setDisabled(false);

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
              isImage: !isImage,
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

          putData(`/services`, selectedUpgrede.id, serviceData)
            .then((response) => {
              console.log("Tạo dịch vụ thành công:", response);
              setDisabled(false);
              tableRef();

              notificationApi(
                "success",
                "Thành công",
                "Dịch vụ đã được tạo thành công."
              );
            })
            .catch((error) => {
              setDisabled(false);
              console.error("Lỗi khi tạo dịch vụ:", error);
              notificationApi("error", "Lỗi", `${error?.data?.message}`);
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
           ${branch.province}`,
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
  return (
    <div>
      <div className="bg-white">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Cập nhật dịch vụ
        </h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto ">
            <div className="overflow-y-auto p-4">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-4">
                <div className="sm:col-span-2 bg-white  rounded border-[#E0E2E7] border p-5">
                  <h2 className="text-xl font-semibold mb-4">
                    Thông tin chung
                  </h2>

                  <div className="mt-2.5">
                    <ComInput
                      type="text"
                      label={"Tên dịch vụ"}
                      placeholder={"Tên dịch vụ"}
                      error={errors.title?.message}
                      required
                      {...register("name")}
                    />
                  </div>
                  <div className="mt-2.5">
                    <ComTextArea
                      label={"Nội dung"}
                      placeholder={"Vui lòng nhập nội dung"}
                      {...register("description")}
                      rows={5}
                      error={errors.content?.message}
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 h-full flex flex-col justify-between ">
                  <div className=" bg-white rounded border-[#E0E2E7] border p-5 h-full ">
                    <h2 className="text-xl font-semibold mb-4">Danh mục</h2>
                    <ComSelect
                      size={"large"}
                      style={{
                        width: "100%",
                      }}
                      value={watch("categoryId")}
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
                      value={watch("status")}
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
                <div className="sm:col-span-2 bg-white  rounded border-[#E0E2E7] border p-5 ">
                  <h2 className="text-xl font-semibold mb-4">Hình ảnh</h2>
                  <ComUpImg
                    onChange={onChange}
                    // label={"Hình ảnh"}
                    error={image ? "" : "Vui lòng chọn hình ảnh"}
                    required
                  />
                </div>
                <div className="sm:col-span-2 bg-white  rounded border-[#E0E2E7] border p-5 ">
                  <h2 className="text-xl font-semibold mb-4">Chi nhánh</h2>
                  <ComSelect
                    size={"large"}
                    style={{
                      width: "100%",
                    }}
                    value={watch("branchId")}
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
              <div className="sm:col-span-1 bg-white  rounded border-[#E0E2E7] border p-5 mt-7">
                <h2 className="text-xl font-semibold mb-4">Giá</h2>
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-4">
                  <div className="sm:col-span-2">
                    <ComNumber
                      value={watch("price")}
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
                      placeholder={"Vui lòng nhập số tiền"}
                      value={watch("newPrice")}
                      onChangeValue={(e, value) => {
                        console.log(e, value);

                        if (value === "") {
                          setValue(e, null);
                        }
                      }}
                      {...register("newPrice")}
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
                    {disabled ? "Đang cập nhật..." : "Cập nhật"}
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
