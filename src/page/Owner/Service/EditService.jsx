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
  const [image, setImages] = useState([]);
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useStorage("user", null);
  // Lưu ảnh cũ vào state 'oldImages'
  const [oldImages, setOldImages] = useState(selectedUpgrede?.assetUrls || []);
  // Lưu ảnh mới trong state 'image'
  const methods = useForm({
    resolver: yupResolver(YupSevice),
    values: selectedUpgrede,
  });

  useEffect(() => {
    setOldImages(selectedUpgrede?.assetUrls);
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
    console.log(333333333333, selectedUpgrede);

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
  const { fields, append, remove } = useFieldArray({
    control,
    name: "serviceProcesses",
  });
  const onChange = (data) => {
    const selectedImages = data;
    const newImages = selectedImages.map((file) => file.originFileObj);
    setImages(newImages);
  };
  const handleImageDelete = (index) => {
    // Xóa ảnh tại vị trí index trong `image`
    const updatedImages = oldImages.filter((_, i) => i !== index);
    setOldImages(updatedImages);
  };

  // Hàm submit form
   const onSubmit = (data) => {
     setDisabled(true);
     // Kiểm tra nếu chưa chọn hình ảnh
     if (!image.length && oldImages.length === 0) {
       notificationApi("error", "Lỗi", "Vui lòng chọn ít nhất một hình ảnh.");
       setDisabled(false);
       return;
     }

     const finalImages = [...oldImages, ...image];

     if (!image) {
       putData(`/services`, selectedUpgrede.id, {
         ...data,
         newPrice: data.newPrice === "" ? null : data.newPrice,
         assetUrls: finalImages, // Lưu ảnh cũ và ảnh mới
       })
         .then((response) => {
           notificationApi(
             "success",
             "Thành công",
             "Dịch vụ đã được cập nhật thành công."
           );
           tableRef();
           onClose();
         })
         .catch((error) => {
           notificationApi("error", "Lỗi", `${error?.data?.message}`);
         })
         .finally(() => setDisabled(false));

       return;
     } else {
       // Upload hình ảnh lên Firebase và lấy URLs
       firebaseImgs(image)
         .then((uploadedUrls) => {
           const assetUrls = uploadedUrls.map((url) => {
             return {
               url: url,
               isImage: !url.includes("mp4"),
               type: url.includes("mp4") ? "video" : "image",
             };
           });

           const serviceData = {
             ...data,
             assetUrls: [...oldImages, ...assetUrls], // Kết hợp ảnh cũ và ảnh mới
             newPrice: data.newPrice === "" ? null : data.newPrice,
           };

           putData(`/services`, selectedUpgrede.id, serviceData)
             .then((response) => {
               notificationApi(
                 "success",
                 "Thành công",
                 "Dịch vụ đã được cập nhật thành công."
               );
               tableRef();
               onClose();
             })
             .catch((error) => {
               notificationApi("error", "Lỗi", `${error?.data?.message}`);
             })
             .finally(() => setDisabled(false));
         })
         .catch((error) => {
           notificationApi("error", "Lỗi", "Không thể upload hình ảnh/video.");
           setDisabled(false);
         });
     }
   };
  // const onSubmit = (data) => {
  //   // Kiểm tra nếu chưa chọn hình ảnh
  //   setDisabled(true);
  //   console.log(data);
  //   if (!image) {
  //     putData(`/services`, selectedUpgrede.id, {
  //       ...data,
  //       newPrice: data.newPrice === "" ? null : data.newPrice,
  //     })
  //       .then((response) => {
  //         console.log("Tạo dịch vụ thành công:", response);
  //         setDisabled(false);
  //         tableRef();
  //         onClose();
  //         notificationApi(
  //           "success",
  //           "Thành công",
  //           "Dịch vụ đã được cập nhật thành công."
  //         );
  //       })
  //       .catch((error) => {
  //         setDisabled(false);
  //         console.error("Lỗi khi cập nhật dịch vụ:", error);
  //         notificationApi("error", "Lỗi", `${error?.data?.message}`);
  //       });

  //     setDisabled(false);

  //     return;
  //   } else {
  //     setDisabled(true);
  //     // Upload hình ảnh lên Firebase và lấy URLs
  //     firebaseImgs(image)
  //       .then((uploadedUrls) => {
  //         // Phân loại URL nào là ảnh, URL nào là video
  //         const assetUrls = uploadedUrls.map((url) => {
  //           const isImage = url.includes("mp4"); // Điều kiện giả định để kiểm tra xem có phải là hình ảnh
  //           return {
  //             url: url,
  //             isImage: !isImage,
  //             type: isImage ? "video" : "image",
  //           };
  //         });

  //         // Tạo dữ liệu dịch vụ mới với các URL đã được phân loại
  //         const serviceData = {
  //           ...data,
  //           assetUrls: assetUrls,
  //           newPrice: data.newPrice === "" ? null : data.newPrice,
  //         };

  //         // Gửi yêu cầu tạo dịch vụ
  //         console.log(serviceData);

  //         putData(`/services`, selectedUpgrede.id, serviceData)
  //           .then((response) => {
  //             console.log("Tạo dịch vụ thành công:", response);
  //             setDisabled(false);
  //             tableRef();

  //             notificationApi(
  //               "success",
  //               "Thành công",
  //               "Dịch vụ đã được tạo thành công."
  //             );
  //           })
  //           .catch((error) => {
  //             setDisabled(false);
  //             console.error("Lỗi khi tạo dịch vụ:", error);
  //             notificationApi("error", "Lỗi", `${error?.data?.message}`);
  //           });
  //       })
  //       .catch((error) => {
  //         setDisabled(false);
  //         console.error("Lỗi khi upload hình ảnh/video:", error);
  //         notificationApi(
  //           "error",
  //           "Lỗi",
  //           "Không thể upload hình ảnh/video. Vui lòng thử lại."
  //         );
  //       });
  //   }
  // };
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

    getData("/categories?Status=AVAILABLE&PageIndex=1&PageSize=999999")
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
        <h2 className="text-xl font-semibold text-blue-800 mb-4">
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
                  <div className="grid grid-cols-4 gap-4">
                    {oldImages && oldImages.length > 0 ? (
                      oldImages.map((img, index) => (
                        <div key={index} className="relative w-[84px]">
                          <img
                            src={img.url}
                            alt={`Selected ${index}`}
                            className="w-full h-[84px] object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => handleImageDelete(index)}
                            className="absolute top-0 right-0 text-red-500 bg-white rounded-full p-1"
                          >
                            Xóa
                          </button>
                        </div>
                      ))
                    ) : (
                      <div>Chưa có hình ảnh nào.</div>
                    )}
                  </div>
                 <div className="mt-4">
                    <ComUpImg
                      onChange={onChange}
                      numberImg={10}
                      // label={"Hình ảnh"}
                      error={image ? "" : "Vui lòng chọn hình ảnh"}
                      required
                    />
                 </div>
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
              <div className="sm:col-span-1 bg-white  rounded border-[#E0E2E7] border p-5 mt-7">
                {fields.map((description, index) => (
                  <div className="sm:col-span-2" key={index}>
                    <div className="mt-2.5">
                      <ComInput
                        id={`description-${index}`}
                        label={`Bước ${index + 1} của dịch vụ`}
                        placeholder="Vui lòng nhập chi tiết"
                        {...register(`serviceProcesses.${index}.process`)}
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className={`text-red-500 mt-1 ${
                        fields.length === 1 ? "hidden" : ""
                      }`} // Ẩn nút xóa khi chỉ có một phần tử
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>

              {errors.descriptions?.message && (
                <p className="text-red-600">{errors.descriptions?.message}</p>
              )}
              {errors.descriptions &&
                !fields.some((field) => field.value !== "") && (
                  <p>{errors.descriptions.message}</p>
                )}
              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={() => append(" ")}
                  className="mt-4  bg-blackpointer-events-auto rounded-md bg-[#0F296D] px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-[#0F296D] hover:text-white"
                >
                  Thêm bước làm dịch vụ
                </button>
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

