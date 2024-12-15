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
import { YupMaterial } from "../../../yup/YupMaterial";
import { getBranchByBusinessId } from "../../../api/branch";
import { getServiceByBusinessId } from "../../../api/service";
import { Modal } from "antd";

export default function CreateMaterial() {
  const [disabled, setDisabled] = useState(false);
  const { notificationApi } = useNotification();
  const [image, setImages] = useState(null);
  const [branches, setBranches] = useState([]);
  const [user] = useStorage("user", null);
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  const methods = useForm({
    resolver: yupResolver(YupMaterial),
    defaultValues: {
      name: "",
      price: null,
      status: "",
      branchId: [],
      serviceId: "", // Khởi tạo là chuỗi rỗng thay vì null
    },
  });

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
    watch,
  } = methods;

  const serviceId = watch("serviceId");

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.businessId) return;

      try {
        const [branchResponse, serviceResponse] = await Promise.all([
          getBranchByBusinessId(user.businessId),
          getServiceByBusinessId(user.businessId),
        ]);

        if (branchResponse?.data) {
          const branchOptions = branchResponse.data
            .filter((branch) => branch.status === "ACTIVE")
            .map((branch) => ({
              value: branch.id,
              label: branch.name,
              description: `${branch.address}, ${branch.ward}, ${branch.province}`,
              className: "whitespace-normal break-words py-2",
            }));
          setBranches(branchOptions);
        }

        if (serviceResponse?.data?.items) {
          const serviceOptions = serviceResponse.data.items
            .filter(service => service.status === "Hoạt Động" && service.category.status === "Hoạt Động")
            .map(service => ({
              value: service.id,
              label: service.name,
            }));
          setServices(serviceOptions);
        }
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
        notificationApi("error", "Lỗi", "Không thể tải dữ liệu.");
      }
    };

    fetchData();
  }, [user?.businessId, notificationApi]);

  // Thêm console.log để kiểm tra branches đã được set chưa
  //   console.log("Branches state:", branches);

  const onChange = (data) => {
    if (Array.isArray(data)) {
        const newImages = data.map((file) => file.originFileObj);
        setImages(newImages);
    } else {
        console.error("Dữ liệu hình ảnh không hợp lệ:", data);
        setImages([]);
    }
  };

  useEffect(() => {
    console.log("serviceId hiện tại:", serviceId);
  }, [serviceId]);

  const onSubmit = async (data) => {
    // Kiểm tra nếu chưa chọn dịch vụ
    if (!data.serviceId) {
      notificationApi("error", "Lỗi", "Vui lòng chọn dịch vụ.");
      return;
    }

    // Kiểm tra nếu chưa chọn hình ảnh
    if (!image || image.length === 0) {
      notificationApi("error", "Hình ảnh không hợp lệ", "Vui lòng chọn hình ảnh.");
      return;
    }

    // Kiểm tra nếu chưa chọn chi nhánh
    if (!data.branchId || data.branchId.length === 0) {
      notificationApi("error", "Lỗi", "Vui lòng chọn ít nhất một chi nhánh");
      return;
    }

    // In ra dữ liệu gửi đi để kiểm tra
    console.log("Dữ liệu gửi đi:", {
      name: data.name.trim(),
      price: data.price,
      status: data.status,
      branchId: data.branchId,
      serviceId: data.serviceId,
    });

    // Tiếp tục với việc gửi dữ liệu
    const imageUrls = await firebaseImgs(image);
    if (!imageUrls || imageUrls.length === 0) {
      notificationApi("error", "Lỗi", "Không thể tải lên hình ảnh.");
      return;
    }

    // Chuyển đổi thành cấu trúc đúng cho assetUrls
    const assetUrls = imageUrls.map((url) => ({
      url: url,
      type: "image", // Hỗ trợ tất cả các loại hình ảnh
    }));

    const materialData = {
      name: data.name.trim(),
      price: data.price,
      status: data.status,
      branchId: data.branchId.map((id) => id.toString()),
      serviceId: data.serviceId, // Đảm bảo serviceId được lấy từ data
      assetUrls: assetUrls,
    };

    console.log("Dữ liệu gửi đi:", materialData); // Kiểm tra dữ liệu gửi đi

    // Gửi dữ liệu
    try {
      const response = await createMaterial(materialData);
      notificationApi(
        "success",
        "Thành công",
        "Phụ kiện đã được tạo thành công."
      );
      navigate("/owner/material");
    } catch (error) {
      console.error("Chi tiết lỗi:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi tạo phụ kiện";

      // Hiển thị modal thông báo lỗi
      // Modal.error({
      //   title: 'Lỗi',
      //   content: 'Vui lòng nâng cấp gói đăng ký để thêm mới phụ kiện.',
      // });

      notificationApi("error", "Lỗi", errorMessage);
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
                <h2 className="text-xl font-semibold mb-4">
                  Chi nhánh & Dịch vụ
                </h2>
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
                      setValue(
                        "branchId",
                        Array.isArray(value) ? value : [value]
                      );
                    }}
                    mode="multiple"
                    showSearch
                    options={branches}
                    required
                    {...register("branchId")}
                  />
                </div>
                <div className="mb-4">
                  <ComSelect
                    size={"large"}
                    style={{ width: "100%" }}
                    label="Chọn dịch vụ"
                    placeholder="Chọn dịch vụ"
                    onChangeValue={(e, value) => {
                      console.log("Dịch vụ được chọn:", value);
                      setValue("serviceId", value);
                      console.log(
                        "Giá trị serviceId sau khi setValue:",
                        watch("serviceId")
                      );
                    }}
                    options={services}
                    {...register("serviceId")}
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-end gap-6">
              <div>
                <ComButton
                  onClick={() => navigate("/owner/material")}
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
                  className={`block w-full rounded bg-[#0F296D] text-center text-sm font-semibold text-white shadow-sm ${
                    disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#0F296D]"
                  }`}
                >
                  {disabled ? "Đang xử lý..." : "Tạo mới"}
                </ComButton>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
