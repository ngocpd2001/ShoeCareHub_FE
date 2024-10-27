import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

const UpdateEmployee = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { employee } = location.state || {};

  const [formData, setFormData] = useState({
    name: employee.name || "",
    dob: employee.dob || "",
    position: employee.position || "",
    branch: employee.branch || "",
    email: employee.email || "",
    phone: employee.phone || "",
    avatar: employee.avatar || "/path/to/default/avatar.png",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const today = new Date();
    const birthDate = new Date(formData.dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      birthDate >= today ||
      (age === 12 && monthDiff < 0) ||
      age < 12
    ) {
      alert("Ngày sinh không hợp lệ. Nhân viên phải trên 12 tuổi.");
      return;
    }

    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam có 10 chữ số.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Email không hợp lệ. Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }

    // Logic to update employee details
    console.log("Updated Employee Data:", formData);
    navigate("/owner/employee");
  };

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold text-[#002278] mb-4">Cập nhật nhân viên</h2>
          <nav className="mb-4 text-base text-gray-500">
            <span className="cursor-pointer" onClick={() => navigate("/")}>Cửa hàng</span> &gt; 
            <span className="mx-1"></span>
            <span className="cursor-pointer" onClick={() => navigate("/owner/employee")}> Nhân viên</span> &gt; 
            <span className="mx-1"></span>
            <span className="text-[#002278]">Cập nhật nhân viên</span>
          </nav>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Left side - Image section */}
        <div className="w-72 bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-3 text-center">Ảnh nhân viên</h3>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <img
              src={formData.avatar}
              alt="Ảnh nhân viên"
              className="w-full h-64 rounded-lg"
            />
            <input
              type="file"
              id="fileInput"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <div className="flex justify-center mt-2">
            <button
              onClick={() => document.getElementById('fileInput').click()}
              className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
            >
              Thay đổi ảnh
            </button>
          </div>
        </div>

        {/* Right side - Employee details */}
        <div className="flex-1 bg-white rounded-lg p-6 shadow-sm space-y-8">
          <div className="space-y-6">
            <div className="flex items-center h-12 border-2 border-gray-300 rounded-md">
              <span className="font-medium text-lg ml-2">Họ và tên: </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="ml-2 focus:outline-none w-[80%] h-10"
              />
            </div>
            <div className="flex items-center h-12 border-2 border-gray-300 rounded-md">
              <span className="font-medium text-lg ml-2">Ngày sinh: </span>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="ml-2 focus:outline-none w-[80%] h-10"
              />
            </div>
            <div className="flex items-center h-12 border-2 border-gray-300 rounded-md">
              <span className="font-medium text-lg ml-2">Chức vụ: </span>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="ml-2 focus:outline-none w-[80%] h-10"
              />
            </div>
            <div className="flex items-center h-12 border-2 border-gray-300 rounded-md">
              <span className="font-medium text-lg ml-2">Chi nhánh: </span>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                className="ml-2 focus:outline-none w-[80%] h-10"
              />
            </div>
            <div className="flex items-center h-12 border-2 border-gray-300 rounded-md">
              <span className="font-medium text-lg ml-2">Gmail: </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="ml-2 focus:outline-none w-[80%] h-10"
              />
            </div>
            <div className="flex items-center h-12 border-2 border-gray-300 rounded-md">
              <span className="font-medium text-lg ml-2">Số điện thoại: </span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="ml-2 focus:outline-none w-[80%] h-10"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateEmployee;
