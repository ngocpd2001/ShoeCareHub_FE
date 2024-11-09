import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Select, notification } from "antd";
import { getBranchByBusinessId } from "../../../api/branch";
import { createEmployee } from "../../../api/employee";

const CreateEmployee = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [employee, setEmployee] = useState(() => {
    const savedData = localStorage.getItem('tempEmployeeData');
    return savedData ? JSON.parse(savedData) : {
      fullName: "",
      dob: "",
      gender: "",
      branchId: "",
      email: "",
      phone: "",
    };
  });

  const showError = (message) => {
    notification.error({
      message: "Lỗi",
      description: message
    });
  };
  
  const showSuccess = (message) => {
    notification.success({
      message: "Thành công",
      description: message
    });
  };

  // Thêm useEffect để lấy danh sách chi nhánh
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        // const businessId = localStorage.getItem("businessId"); 
        const businessId = 1;
        
        if (!businessId) {
          throw new Error('BusinessId không được để trống');
        }
        
        const response = await getBranchByBusinessId(businessId);
        setBranches(response.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chi nhánh:", error);
        showError("Không thể lấy danh sách chi nhánh");
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, [showError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedEmployee = { ...employee, [name]: value };
    setEmployee(updatedEmployee);
    localStorage.setItem('tempEmployeeData', JSON.stringify(updatedEmployee));
  };

  const handleBranchChange = (value) => {
    const updatedEmployee = { ...employee, branchId: value };
    setEmployee(updatedEmployee);
    localStorage.setItem('tempEmployeeData', JSON.stringify(updatedEmployee));
  };

  const handleSubmit = async () => {
    const today = new Date();
    const birthDate = new Date(employee.dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      birthDate >= today ||
      (age === 15 && monthDiff < 0) ||
      age < 15
    ) {
      showError("Ngày sinh không hợp lệ. Nhân viên phải trên 15 tuổi.");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(employee.phone)) {
      showError("Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 số.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(employee.email)) {
      showError("Email không hợp lệ. Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }

    try {
      const response = await createEmployee({
        email: employee.email,
        fullName: employee.fullName,
        phone: employee.phone,
        gender: employee.gender,
        dob: employee.dob,
        branchId: parseInt(employee.branchId)
      });

      localStorage.removeItem('tempEmployeeData');
      showSuccess(response.message || "Tạo nhân viên thành công!");
      navigate("/owner/employee");
    } catch (error) {
      showError(error.response?.data?.message || "Có lỗi xảy ra khi tạo nhân viên");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-[#002278] mb-4">Thêm nhân viên</h2>
        <nav className="mb-4 text-base text-gray-500">
          <span className="cursor-pointer" onClick={() => navigate("/")}>Cửa hàng</span> &gt; 
          <span className="mx-1"></span>
          <span className="cursor-pointer" onClick={() => navigate("/owner/employee")}> Nhân viên</span> &gt; 
          <span className="mx-1"></span>
          <span className="text-[#002278]">Thêm nhân viên</span>
        </nav>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <label className="font-medium text-lg w-32">Họ và tên:</label>
            <input
              type="text"
              name="fullName"
              value={employee.fullName}
              onChange={handleChange}
              className="ml-2 p-2 border rounded w-full"
              placeholder="Nhập tên nhân viên..."
            />
          </div>
          <div className="flex items-center">
            <label className="font-medium text-lg w-32">Ngày sinh:</label>
            <input
              type="date"
              name="dob"
              value={employee.dob}
              onChange={handleChange}
              className="ml-2 p-2 border rounded w-full"
            />
          </div>
          <div className="flex items-center">
            <label className="font-medium text-lg w-32">Chi nhánh:</label>
            <Select
              value={employee.branchId}
              onChange={handleBranchChange}
              options={branches.map((branch) => ({
                label: branch.name,
                value: branch.id,
              }))}
              className="ml-2 w-full h-11"
            />
          </div>
          <div className="flex items-center">
            <label className="font-medium text-lg w-32">Gmail:</label>
            <input
              type="email"
              name="email"
              value={employee.email}
              onChange={handleChange}
              className="ml-2 p-2 border rounded w-full"
              placeholder="Nhập gmail..."
            />
          </div>
          <div className="flex items-center">
            <label className="font-medium text-lg w-32">Số điện thoại:</label>
            <input
              type="text"
              name="phone"
              value={employee.phone}
              onChange={handleChange}
              className="ml-2 p-2 border rounded w-full"
              placeholder="Nhập số điện thoại..."
            />
          </div>
          <div className="flex items-center">
            <label className="font-medium text-lg w-32">Giới tính:</label>
            <select
              name="gender"
              value={employee.gender}
              onChange={handleChange}
              className="ml-2 p-2 border rounded w-full"
            >
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
            </select>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployee;
