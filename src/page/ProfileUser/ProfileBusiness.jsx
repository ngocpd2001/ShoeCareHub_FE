import React, { useState, useEffect } from "react";
import ComDatePicker from "../../Components/ComDatePicker/ComDatePicker";
import { useForm, FormProvider } from "react-hook-form";
import ComInput from "../../Components/ComInput/ComInput";
import ComSelect from "../../Components/ComInput/ComSelect";
import ComUpImgOne from "../../Components/ComUpImg/ComUpImgOne";
import { useNotification } from "../../Notification/Notification";
import { getData, putData } from "../../api/api";
import { firebaseImg } from "./../../upImgFirebase/firebaseImg";
import { useStorage } from "../../hooks/useLocalStorage";

const BusinessProfileForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [business, setBusiness] = useState(null);
  const [image, setImage] = useState([]);
  const { notificationApi } = useNotification();
  const [disabled, setDisabled] = useState(false);
  const [user, setUser] = useStorage("user", null);

  const methods = useForm();
  const { handleSubmit, register, setFocus, watch, setValue, reset } = methods;

  // Lấy thông tin doanh nghiệp từ API
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await getData(`/businesses/${user.businessId}`);
        console.log("Dữ liệu doanh nghiệp:", response.data);
        setBusiness(response.data.data);
        reset({
          ...response.data.data,
          status: response.data.data.status, // Đảm bảo trạng thái được reset
        });
      } catch (error) {
        console.error("Lỗi khi lấy thông tin doanh nghiệp:", error);
      }
    };

    fetchBusiness();
  }, [reset, user.businessId]);

  const handleImageChange = (data) => {
    setImage(data);
  };

  const onSubmit = async (data) => {
    setDisabled(true);
    try {
      const updatedImageUrl = image.length
        ? await firebaseImg(image) // Upload ảnh mới nếu có
        : business.imageUrl; // Giữ ảnh cũ nếu không thay đổi

      const updatedBusiness = { ...data, imageUrl: updatedImageUrl };

      await putData(`/businesses/${business.id}`, updatedBusiness);
      notificationApi(
        "success",
        "Cập nhật thành công",
        "Thông tin doanh nghiệp đã được cập nhật"
      );
      setBusiness(updatedBusiness);
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin doanh nghiệp:", error);
      notificationApi("error", "Cập nhật thất bại", "Vui lòng thử lại");
    } finally {
      setDisabled(false);
    }
  };

  if (!business) {
    return <div>Đang tải thông tin doanh nghiệp...</div>;
  }

  return (
    <div className="flex-1 px-4 py-0">
      <h1 className="text-2xl font-bold mb-6">Thông tin doanh nghiệp</h1>
      <div className="flex">
        <FormProvider {...methods}>
          <form className="flex-1 mr-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <ComInput
                type="text"
                label={"Tên doanh nghiệp"}
                placeholder={"Nhập tên doanh nghiệp"}
                readOnly={!isEditing}
                required={isEditing}
                {...register("name")}
              />
            </div>
            <div className="mb-4">
              <ComInput
                placeholder="Nhập số điện thoại"
                label="Số điện thoại"
                type="text"
                maxLength={10}
                readOnly={!isEditing}
                required={isEditing}
                {...register("phone")}
              />
            </div>
            <div className="mb-4">
              <ComInput
                placeholder="Xếp hạng"
                label="Xếp hạng"
                type="number"
                readOnly
                value={business.rank || ""}
              />
            </div>
            <div className="mb-4">
              <ComInput
                placeholder="Đánh giá"
                label="Đánh giá"
                type="number"
                readOnly
                value={
                  business.rating !== undefined
                    ? business.rating.toFixed(1)
                    : ""
                }
              />
            </div>
            <div className="mb-4">
              <ComInput
                label={"Ngày tạo"}
                placeholder={"Ngày tạo"}
                readOnly
                value={
                  business?.createdDate
                    ? new Date(business.createdDate).toLocaleDateString(
                        "vi-VN",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )
                    : ""
                }
              />
            </div>
            <div className="mb-6">
              <div className="relative">
                <ComInput
                  label={"Ngày đăng ký"}
                  placeholder={"Ngày đăng ký"}
                  readOnly={!isEditing}
                  value={
                    business.registeredTime
                      ? new Date(business.registeredTime).toLocaleDateString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )
                      : ""
                  }
                />
              </div>
            </div>
            <div className="mb-6">
              <div className="relative">
                <ComInput
                  label={"Ngày hết hạn"}
                  placeholder={"Ngày hết hạn"}
                  readOnly={!isEditing}
                  value={
                    business.expiredTime
                      ? new Date(business.expiredTime).toLocaleDateString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )
                      : ""
                  }
                />
              </div>
            </div>
            <div className="mb-6">
              <ComSelect
                size="large"
                style={{
                  width: "100%",
                  backgroundColor: "#fff", // Giữ nền bình thường
                  pointerEvents: "none", // Ngăn người dùng tương tác
                  borderColor: "#d9d9d9", // Giữ đường viền như bình thường
                }}
                label="Trạng thái"
                placeholder="Trạng thái"
                value={watch("status") || business.status || ""}
                options={[
                  { value: "ACTIVE", label: "Hoạt động" },
                  { value: "INACTIVE", label: "Không hoạt động" },
                ]}
                readOnly={!isEditing}
                required={isEditing}
                onChangeValue={(value) => setValue("status", value)}
              />
            </div>
            {isEditing && (
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={disabled}
                  className={`px-6 py-3 rounded font-semibold text-white transition-colors duration-200 ${
                    disabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {disabled ? "Đang cập nhật..." : "Cập nhật"}
                </button>
              </div>
            )}
          </form>
        </FormProvider>
        <div className="w-48 h-50 flex justify-center items-center pl-8">
          {!isEditing ? (
            <img
              className="h-40 w-40 rounded-full border border-gray-400 object-cover"
              src={business.imageUrl || ""}
              alt="Business Avatar"
            />
          ) : (
            <div className="flex flex-col justify-center gap-2 items-center">
              <ComUpImgOne
                className="rounded-2xl border border-gray-400"
                imgUrl={business.imageUrl || ""}
                onChange={handleImageChange}
              />
              <span className="text-xs text-gray-400 text-center">
                Bấm vào ảnh để thay đổi ảnh đại diện
              </span>
            </div>
          )}
        </div>
      </div>
      {!isEditing && (
        <div className="flex justify-center">
          {/* <button
            type="button"
            onClick={() => {
              setIsEditing(true);
              setFocus("name");
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Cập nhật thông tin
          </button> */}
        </div>
      )}
    </div>
  );
};

export default function BusinessProfilePage() {
  return (
    <div>
      <div className="col-span-3">
        <div className="mb-4 bg-white border border-gray-300 rounded-lg shadow-sm 2xl:col-span-1 sm:px-6 sm:py-4 mt-2">
          <BusinessProfileForm />
        </div>
      </div>
    </div>
  );
}
