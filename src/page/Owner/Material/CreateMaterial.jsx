import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNotification } from "../../../Notification/Notification";
import ComInput from "../../../Components/ComInput/ComInput";
import ComButton from "../../../Components/ComButton/ComButton";
import ComUpImg from "../../../Components/ComUpImg/ComUpImg";
import { Breadcrumb } from "antd";
import { Link, useNavigate } from "react-router-dom";
import ComSelect from "../../../Components/ComInput/ComSelect";
import ComNumber from "../../../Components/ComInput/ComNumber";
import { firebaseImgs } from "../../../upImgFirebase/firebaseImgs";
import { useStorage } from "../../../hooks/useLocalStorage";
import { getData } from "../../../api/api";
import { createMaterial } from "../../../api/material";
import { updateMaterialQuantity } from "../../../api/material";
import * as yup from "yup";
import { getBranchByBusinessId } from "../../../api/branch";

// Điều chỉnh schema validation
const MaterialSchema = yup.object().shape({
  name: yup
    .string()
    .required("Tên phụ kiện là bắt buộc")
    .trim()
    .min(2, "Tên phụ kiện phải có ít nhất 2 ký tự"),
  price: yup
    .number()
    .required("Giá phụ kiện là bắt buộc")
    .min(1000, "Giá tối thiểu là 1000đ"),
  status: yup
    .string()
    .required("Trạng thái là bắt buộc"),
  branchId: yup
    .array()
    .of(yup.string())
    .min(1, "Phải chọn ít nhất một chi nhánh")
    .required("Vui lòng chọn chi nhánh")
});

export default function CreateMaterial() {
  const [disabled, setDisabled] = useState(false);
  const { notificationApi } = useNotification();
  const [image, setImages] = useState(null);
  const [branches, setBranches] = useState([]);
  const [user] = useStorage("user", null);
  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(MaterialSchema),
    defaultValues: {
      name: "",
      price: null,
      status: "",
      branchId: []
    },
  });

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = methods;

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await getBranchByBusinessId(user?.businessId);
        
        if (!response?.data) return;

        const branchOptions = response.data.map((branch) => ({
          value: branch.id,
          label: branch.name,
          description: `${branch.address}, ${branch.ward}, ${branch.province}`,
          className: "whitespace-normal break-words py-2"
        }));
        
        setBranches(branchOptions);
        
      } catch (error) {
        console.error("Chi tiết lỗi:", error);
        notificationApi("error", "Lỗi", "Không thể lấy danh sách chi nhánh");
        setBranches([]);
      }
    };

    if (user?.businessId) {
      fetchBranches();
    }
  }, [user?.businessId, notificationApi]);
  
  // Thêm console.log để kiểm tra branches đã được set chưa
//   console.log("Branches state:", branches);

  const onChange = (data) => {
    const selectedImages = data;
    const newImages = selectedImages.map((file) => file.originFileObj);
    setImages(newImages);
  };

  const onSubmit = async (data) => {
    if (!image) {
      notificationApi("error", "Hình ảnh không hợp lệ", "Vui lòng chọn hình ảnh.");
      return;
    }

    if (!data.branchId || data.branchId.length === 0) {
      notificationApi("error", "Lỗi", "Vui lòng chọn ít nhất một chi nhánh");
      return;
    }

    setDisabled(true);
    try {
      const uploadedUrls = await firebaseImgs(image);
      const assetUrls = uploadedUrls.map((url) => ({
        url: url,
        type: url.includes("mp4") ? "video" : "image",
      }));

      const materialData = {
        name: data.name.trim(),
        price: data.price,
        status: data.status,
        branchId: data.branchId,
        assetUrls: assetUrls,
      };

      console.log("Dữ liệu gửi đi:", materialData);

      const response = await createMaterial(null, materialData);
      
      console.log("Response từ server:", response);

      notificationApi("success", "Thành công", "Phụ kiện đã được tạo thành công.");
      navigate("/owner/material");
    } catch (error) {
      console.error("Chi tiết lỗi:", error);
      const errorMessage = error.response?.data?.message || error.message || "Có lỗi xảy ra khi tạo phụ kiện";
      notificationApi("error", "Lỗi", errorMessage);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-blue-800 mb-4 ml-4">
        Thêm phụ kiện
      </h2>
      <Breadcrumb
        className="ml-4"
        items={[
          { title: "Cửa hàng" },
          { title: <Link to="/owner/material">Phụ kiện</Link> },
          { title: <span className="text-[#002278]">Thêm phụ kiện</span> },
        ]}
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto">
          <div className="overflow-y-auto p-4">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-4">
              <div className="sm:col-span-3 bg-white rounded border-[#E0E2E7] border p-5">
                <h2 className="text-xl font-semibold mb-4">Thông tin chung</h2>
                <div className="mt-2.5">
                  <ComInput
                    type="text"
                    label="Tên phụ kiện"
                    placeholder="Nhập tên phụ kiện"
                    error={errors.name?.message}
                    required
                    {...register("name")}
                  />
                </div>
                <div className="mt-2.5">
                  <ComNumber
                    min={1000}
                    label="Giá phụ kiện"
                    placeholder="Vui lòng nhập số tiền"
                    error={errors.price?.message}
                    {...register("price")}
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-1 h-full flex flex-col justify-between">
                <div className="bg-white rounded border-[#E0E2E7] border p-5 h-full">
                  <h2 className="text-xl font-semibold mb-4">Trạng thái</h2>
                  <ComSelect
                    size={"large"}
                    style={{
                      width: "100%",
                    }}
                    label="Trạng thái phụ kiện"
                    placeholder="Lựa chọn"
                    onChangeValue={(e, value) => {
                      setValue("status", value);
                    }}
                    mode="default"
                    options={[
                      {
                        value: "AVAILABLE",
                        label: `Hoạt Động`,
                      },
                      {
                        value: "UNAVAILABLE",
                        label: `Ngưng Hoạt Động`,
                      },
                    ]}
                    required
                    {...register("status")}
                  />
                </div>
              </div>

              <div className="sm:col-span-2 bg-white rounded border-[#E0E2E7] border p-5">
                <h2 className="text-xl font-semibold mb-4">Hình ảnh</h2>
                <ComUpImg
                  onChange={onChange}
                  error={image ? "" : "Vui lòng chọn hình ảnh"}
                  required
                />
              </div>

              <div className="sm:col-span-2 bg-white rounded border-[#E0E2E7] border p-5">
                <h2 className="text-xl font-semibold mb-4">Chi nhánh</h2>
                <div className="mb-4">
                  <ComSelect
                    size={"large"}
                    style={{
                      width: "100%",
                    }}
                    label="Chọn chi nhánh"
                    placeholder="Chọn một hoặc nhiều chi nhánh"
                    onChangeValue={(e, value) => {
                      console.log("Chi nhánh được chọn:", value);
                      setValue("branchId", Array.isArray(value) ? value : [value]);
                    }}
                    mode="multiple"
                    showSearch
                    options={branches}
                    required
                    {...register("branchId")}
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-end gap-6">
              <div>
              <ComButton
                onClick={() => navigate('/owner/material')}
                type="button"
                className="block w-full rounded border-[#E0E2E7] border-md bg-[#F0F1F3] text-center text-sm font-semibold shadow-sm"
              >
                <div className="text-black">Hủy bỏ</div>
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
  );
}