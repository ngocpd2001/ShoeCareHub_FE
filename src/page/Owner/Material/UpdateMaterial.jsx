import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Breadcrumb,
  Input,
  Select,
  InputNumber,
  Upload,
  message,
  Modal,
  Image,
} from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import {
  getMaterialById,
  updateMaterial,
  updateMaterialQuantity,
} from "../../../api/material";
import { useNotification } from "../../../Notification/Notification";
import { getBranchByBusinessId } from "../../../api/branch";
import { firebaseImgs } from "../../../upImgFirebase/firebaseImgs";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ComInput from "../../../Components/ComInput/ComInput";
import ComButton from "../../../Components/ComButton/ComButton";
import ComUpImg from "../../../Components/ComUpImg/ComUpImg";
import ComSelect from "../../../Components/ComInput/ComSelect";
import ComNumber from "../../../Components/ComInput/ComNumber";
import * as yup from "yup";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

// Tách validation schema ra file riêng
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
  status: yup.string().required("Trạng thái là bắt buộc"),
  branchId: yup
    .array()
    .of(yup.string())
    .min(1, "Phải chọn ít nhất một chi nhánh")
    .required("Vui lòng chọn chi nhánh"),
});

// Tách các hằng số và options ra
const STATUS_OPTIONS = [
  {
    value: "AVAILABLE",
    label: "Hoạt Động",
    className: "w-full whitespace-normal break-words py-2 px-4",
  },
  {
    value: "UNAVAILABLE",
    label: "Ngưng Hoạt Động",
    className: "w-full whitespace-normal break-words py-2 px-4",
  },
];

const INITIAL_FORM_STATE = {
  branchId: [],
  name: "",
  price: 0,
  status: "AVAILABLE",
  assetUrls: [],
};

const UpdateMaterial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notificationApi } = useNotification();

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [branchMaterials, setBranchMaterials] = useState([]);
  const [allBranches, setAllBranches] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [branchStatuses, setBranchStatuses] = useState({});

  const methods = useForm({
    resolver: yupResolver(MaterialSchema),
    defaultValues: {
      name: "",
      price: null,
      status: "",
      branchId: [],
      assetUrls: [],
    },
  });

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = methods;


  const fetchMaterialData = async () => {
    try {
      const response = await getMaterialById(id);
      const materialData = response.data;

      // Thêm console.log để debug
      console.log("Material Data:", materialData);
      console.log("Price before parsing:", materialData.price);

      // Đảm bảo chuyển đổi giá trị price sang số một cách chính xác
      const price = materialData.price ? parseFloat(materialData.price) : 0;
      console.log("Price after parsing:", price);

      // Cập nhật giá trị form
      setValue("name", materialData.name || "");
      setValue("price", price); // Sử dụng giá trị đã parse
      setValue(
        "status",
        materialData.status === "Hoạt Động" ? "AVAILABLE" : "UNAVAILABLE"
      );
      setValue(
        "branchId",
        materialData.branchMaterials?.map((bm) => bm.branch.id) || []
      );

      // Cập nhật formData state
      setFormData((prev) => ({
        ...prev,
        name: materialData.name || "",
        price: price, // Sử dụng giá trị đã parse
        status:
          materialData.status === "Hoạt Động" ? "AVAILABLE" : "UNAVAILABLE",
        branchId: materialData.branchMaterials?.map((bm) => bm.branch.id) || [],
      }));

      // Cập nhật số lượng cho từng chi nhánh
      const currentQuantities = {};
      materialData.branchMaterials?.forEach((bm) => {
        currentQuantities[bm.branch.id] = bm.storage; // Sử dụng storage thay vì quantity
      });
      setQuantities(currentQuantities);
      setBranchMaterials(materialData.branchMaterials || []);

      // Cập nhật trạng thái cho từng chi nhánh
      const currentBranchStatuses = {};
      materialData.branchMaterials?.forEach((bm) => {
        currentBranchStatuses[bm.branch.id] = bm.status;
      });
      setBranchStatuses(currentBranchStatuses);

      // Cập nhật danh sách hình ảnh
      if (materialData.assetUrls && materialData.assetUrls.length > 0) {
        const existingFileList = materialData.assetUrls.map((asset) => ({
          uid: asset.id,
          name: `image-${asset.id}`,
          status: "done",
          url: asset.url,
          type: "image",
        }));

        // Cập nhật fileList với các hình ảnh từ API
        setFileList(existingFileList);
      } else {
        setFileList([]); // Đảm bảo danh sách ảnh trống nếu không có ảnh
      }
    } catch (error) {
      notificationApi("error", "Lỗi", "Không thể tải thông tin vật liệu");
    }
  };

  useEffect(() => {
    fetchMaterialData();
    // fetchAllBranches();
  }, [id, setValue]);


  const handleImageDelete = (index) => {
    const newFileList = fileList.filter((_, i) => i !== index);
    setFileList(newFileList);
    setFormData((prev) => ({
      ...prev,
      assetUrls: newFileList.map((file) => file.url).filter(Boolean),
    }));
  };

  const handleQuantityChange = async (branchId, quantity) => {
    try {
      if (!quantity || Number(quantity) <= 0) {
        return;
      }

      const numericQuantity = Number(quantity);
      await updateMaterialQuantity(branchId, id, numericQuantity);

      setQuantities((prev) => ({
        ...prev,
        [branchId]: numericQuantity,
      }));
    } catch (error) {
      console.error("Chi tiết lỗi cập nhật số lượng:", error);
      notificationApi(
        "error",
        "Lỗi",
        error.message || "Không thể cập nhật số lượng"
      );
    }
  };

  const onChange = async (data) => {
    const newImages = data.map((file) => file.originFileObj);
    console.log("Danh sách hình ảnh mới:", newImages);

    // Tải lên hình ảnh lên Firebase và lấy URL
    const uploadedUrls = await firebaseImgs(newImages);
    console.log("URL hình ảnh đã tải lên:", uploadedUrls);

    // Cập nhật fileList với các hình ảnh đã tải lên
    const updatedFileList = [
      ...fileList,
      ...uploadedUrls.map((url, index) => ({
        uid: newImages[index].name,
        name: newImages[index].name,
        status: "done",
        url: url,
        type: "image",
      })),
    ];

    setFileList(updatedFileList);
    setFormData((prev) => ({
      ...prev,
      assetUrls: [
        ...(prev.assetUrls || []),
        ...uploadedUrls.map((url) => ({ url, type: "image" })),
      ],
    }));
  };

  const updateBranchQuantities = async (quantities) => {
    const validQuantities = Object.entries(quantities).filter(
      ([_, quantity]) => quantity && Number(quantity) > 0
    );

    if (validQuantities.length > 0) {
      const updatePromises = validQuantities.map(([branchId, quantity]) =>
        updateMaterialQuantity(branchId, id, quantity)
      );
      await Promise.all(updatePromises);
    }
  };

  const onSubmit = async (data) => {
    if (!fileList?.length) {
      notificationApi(
        "error",
        "Hình ảnh không hợp lệ",
        "Vui lòng chọn hình ảnh."
      );
      return;
    }

    setLoading(true);
    try {
      const assetUrls = fileList.map((file) => ({
        url: file.url,
        type: "image",
      }));

      const submitData = {
        name: data.name.trim(),
        price: Number(data.price),
        status: data.status,
        branchId: data.branchId,
        assetUrls: assetUrls,
      };

      console.log("Dữ liệu gửi đi:", submitData);

      await updateMaterial(id, submitData);
      await updateBranchQuantities(quantities);

      notificationApi("success", "Thành công", "Cập nhật vật liệu thành công");
      navigate("/owner/material");
    } catch (error) {
      console.error("Chi tiết lỗi:", error);
      notificationApi(
        "error",
        "Lỗi",
        error.response?.data?.message || "Không thể cập nhật vật liệu"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-800 mb-3">
            Cập nhật phụ kiện
          </h2>
          <Breadcrumb
            separator=">"
            items={[
              { title: "Cửa hàng" },
              { title: <Link to="/owner/material">Phụ kiện</Link> },
              {
                title: (
                  <span className="text-[#002278]">Cập nhật phụ kiện</span>
                ),
              },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Thông tin chung và trạng thái */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Thông tin chung */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="space-y-4">
                  <ComInput
                    type="text"
                    label={
                      <span className="font-normal text-lg">Tên phụ kiện</span>
                    }
                    error={errors.name?.message}
                    required
                    {...register("name")}
                  />
                  <ComNumber
                    min={1000}
                    label={
                      <span className="font-normal text-lg">Giá phụ kiện</span>
                    }
                    error={errors.price?.message}
                    {...register("price")}
                    value={methods.watch("price")}
                    onChange={(value) => setValue("price", value)}
                    required
                  />
                </div>
              </div>

              {/* Trạng thái */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <ComSelect
                  size="large"
                  className="w-full min-w-[200px]"
                  dropdownMatchSelectWidth={false}
                  dropdownStyle={{ minWidth: "200px" }}
                  label={
                    <span className="font-normal text-lg">
                      Trạng thái phụ kiện
                    </span>
                  }
                  placeholder="Lựa chọn"
                  onChangeValue={(e, value) => {
                    setValue("status", value);
                  }}
                  mode="default"
                  value={methods.watch("status")}
                  options={STATUS_OPTIONS}
                  required
                  {...register("status")}
                />
              </div>
            </div>
          </div>

          {/* Số lượng theo chi nhánh và hình ảnh */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Số lượng theo chi nhánh */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-normal mb-6">
                  Số lượng theo chi nhánh
                </h2>
                <div className="space-y-4">
                  {branchMaterials.map((bm) => (
                    <div key={bm.branch.id} className="flex flex-col gap-2">
                      <label className="text-sm font-medium">
                        {bm.branch.name}
                      </label>
                      <InputNumber
                        className="w-full"
                        min={1}
                        value={quantities[bm.branch.id] || undefined}
                        onChange={(value) => {
                          setQuantities((prev) => ({
                            ...prev,
                            [bm.branch.id]: value,
                          }));
                        }}
                        onBlur={() => {
                          const value = quantities[bm.branch.id];
                          if (value !== undefined && value !== null) {
                            handleQuantityChange(bm.branch.id, value);
                          }
                        }}
                        size="large"
                        controls={true}
                        placeholder="Nhập số lượng"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Hình ảnh */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-normal mb-6">Hình ảnh</h2>
                {fileList.length > 0 ? (
                  <div className="grid grid-cols-4 gap-4">
                    {fileList.map((file, index) => (
                      <div
                        key={file.uid}
                        className="relative w-[80px] h-[80px]"
                      >
                        {file.url ? ( // Hiển thị ảnh đã tải lên
                          <Image
                            src={file.url}
                            alt={`Selected ${index}`}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        ) : (
                          // Hiển thị ảnh chưa tải lên
                          <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md">
                            <UploadOutlined className="text-gray-400" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => handleImageDelete(index)}
                          className="absolute top-0 right-0 text-red-500 rounded-full p-1 w-6 h-6 flex items-center justify-center"
                        >
                          <CloseOutlined className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>Chưa có hình ảnh nào.</div>
                )}
                <div className="mt-4">
                  <ComUpImg
                    onChange={onChange}
                    error={
                      fileList.length === 0 ? "Vui lòng chọn hình ảnh" : ""
                    }
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex justify-end gap-6">
          <div className="w-[150px]">
            <ComButton
              onClick={() => navigate("/owner/material")}
              type="button"
              className="w-full h-[45px] rounded border-[#E0E2E7] border-md bg-[#F0F1F3] text-center text-sm font-semibold shadow-sm flex items-center justify-center"
            >
              <div className="text-black">Hủy bỏ</div>
            </ComButton>
          </div>
          <div className="w-[150px]">
            <ComButton
              htmlType="submit"
              disabled={loading}
              className="w-full h-[45px] bg-[#002B5B] hover:bg-[#002B5B]/90 text-white rounded-md font-medium flex items-center justify-center"
            >
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </ComButton>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default UpdateMaterial;
