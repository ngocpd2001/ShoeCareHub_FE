import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import { useNotification } from "../../../Notification/Notification";
import ComInput from "../../../Components/ComInput/ComInput";
import ComButton from "../../../Components/ComButton/ComButton";
import ComSelect from "../../../Components/ComInput/ComSelect";
import ComUpImg from "../../../Components/ComUpImg/ComUpImg";
import { getBranchByBusinessId } from "../../../api/branch";
import { createEmployee } from "../../../api/employee";
import { firebaseImgs } from "./../../../upImgFirebase/firebaseImgs";
import { YupEmployee } from "../../../yup/YupEmployee"; // Cần tạo schema validate cho Employee

export default function CreateEmployee() {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [image, setImages] = useState(null);
  const [branches, setBranches] = useState([]);
  const { notificationApi } = useNotification();
  const [selectedGender, setSelectedGender] = useState("Nam");
  const [selectedBranch, setSelectedBranch] = useState("");

  const methods = useForm({
    resolver: yupResolver(YupEmployee),
    defaultValues: {
      fullName: "",
      dob: "",
      gender: "MALE",
      branchId: "",
      branchName: "",
      email: "",
      phone: "",
    },
  });

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = methods;

  console.log("Validation errors:", errors);

  // Lấy danh sách chi nhánh
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        const response = await getBranchByBusinessId(userData.businessId);
        const branchList = response.data.map((branch) => ({
          value: branch.id,
          label: branch.name,
        }));
        setBranches(branchList);

        // Set giá trị mặc định cho chi nhánh đầu tiên nếu có
        if (branchList.length > 0) {
          setSelectedBranch(branchList[0].value);
          setValue("branchId", branchList[0].value);
          setValue("branchName", branchList[0].label);
        }
      } catch (error) {
        notificationApi("error", "Lỗi", "Không thể lấy danh sách chi nhánh");
      }
    };
    fetchBranches();
  }, []);

  // Xử lý upload ảnh
  const onChange = (data) => {
    const selectedImages = data;
    const newImages = selectedImages.map((file) => file.originFileObj);
    setImages(newImages);
  };

  // Tách riêng phần render của ComSelect chi nhánh
  const renderBranchSelect = () => {
    return (
      <ComSelect
        label="Chi nhánh"
        options={branches}
        required
        value={selectedBranch}
        onChange={(value) => {
          const selectedOption = branches.find((b) => b.value === value);
          if (selectedOption) {
            setSelectedBranch(value);
            setValue("branchId", value);
            setValue("branchName", selectedOption.label);
          }
        }}
        onSelect={(value, option) => {
          setSelectedBranch(value);
          setValue("branchId", value);
          setValue("branchName", option.label);
        }}
      />
    );
  };

  // Xử lý submit form
  const onSubmit = async (data) => {
    if (!image) {
      notificationApi("error", "Lỗi", "Vui lòng chọn ảnh đại diện");
      return;
    }

    try {
      setDisabled(true);
      const uploadedUrls = await firebaseImgs(image);
      const userData = JSON.parse(localStorage.getItem("user"));

      // Format lại dữ liệu trước khi gửi
      const employeeData = {
        fullName: data.fullName,
        dob: new Date(data.dob).toISOString().split('T')[0], // Format lại ngày tháng
        gender: data.gender,
        email: data.email,
        phone: data.phone,
        branchId: parseInt(data.branchId), // Chuyển sang số
        businessId: parseInt(userData.businessId), // Chuyển sang số
        avatar: uploadedUrls[0],
        status: "ACTIVE"
      };

      console.log("Data gửi lên API:", employeeData);

      const response = await createEmployee(employeeData);
      notificationApi("success", "Thành công", "Tạo nhân viên thành công");
      navigate("/owner/employee");
    } catch (error) {
      console.log("Error details:", error.response?.data?.errors); // Log chi tiết lỗi validation
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi tạo nhân viên";
      notificationApi("error", "Lỗi", errorMessage);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Thêm nhân viên
      </h2>
      <Breadcrumb
        items={[
          { title: "Cửa hàng" },
          { title: <Link to="/owner/employee">Nhân viên</Link> },
          { title: "Thêm nhân viên" },
        ]}
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="bg-white rounded border p-5">
              <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>
              <div className="space-y-6">
                <ComInput
                  label="Họ và tên"
                  placeholder="Nhập họ và tên"
                  error={errors.fullName?.message}
                  required
                  {...register("fullName")}
                />

                <ComInput
                  type="date"
                  label="Ngày sinh"
                  error={errors.dob?.message}
                  required
                  {...register("dob")}
                />

                <ComSelect
                  label="Giới tính"
                  options={[
                    { value: "MALE", label: "Nam" },
                    { value: "FEMALE", label: "Nữ" },
                  ]}
                  required
                  value={selectedGender}
                  onChange={(value) => {
                    setSelectedGender(value);
                    setValue("gender", value);
                  }}
                  onSelect={(value, option) => {
                    setSelectedGender(value);
                    setValue("gender", value);
                  }}
                  className="w-full min-w-[200px] max-w-full" 
                />
              </div>
            </div>

            <div className="bg-white rounded border p-5">
              <h2 className="text-xl font-semibold mb-4">Thông tin liên hệ</h2>
              <div className="space-y-6">
                <ComInput
                  type="email"
                  label="Email"
                  placeholder="Nhập email"
                  error={errors.email?.message}
                  required
                  {...register("email")}
                />

                <ComInput
                  label="Số điện thoại"
                  placeholder="Nhập số điện thoại"
                  error={errors.phone?.message}
                  required
                  {...register("phone")}
                />

                {renderBranchSelect()}
              </div>
            </div>

            <div className="bg-white rounded border p-5">
              <h2 className="text-xl font-semibold mb-4">Ảnh đại diện</h2>
              <div className="space-y-6">
                <ComUpImg
                  onChange={onChange}
                  error={image ? "" : "Vui lòng chọn ảnh đại diện"}
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-end gap-6">
            <div>
              <ComButton
                onClick={() => navigate('/owner/employee')}
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
        </form>
      </FormProvider>
    </div>
  );
}
