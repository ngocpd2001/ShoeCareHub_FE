import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateEmployee = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    name: "",
    dob: "",
    position: "",
    branch: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSubmit = () => {
    const today = new Date();
    const birthDate = new Date(employee.dob);
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
    if (!phoneRegex.test(employee.phone)) {
      alert("Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam có 10 chữ số.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(employee.email)) {
      alert("Email không hợp lệ. Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }

    // Logic để lưu nhân viên mới
    console.log("Employee data:", employee);
    navigate("/owner/employee");
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
              name="name"
              value={employee.name}
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
            <label className="font-medium text-lg w-32">Chức vụ:</label>
            <input
              type="text"
              name="position"
              value={employee.position}
              onChange={handleChange}
              className="ml-2 p-2 border rounded w-full"
              placeholder="Nhập chức vụ..."
            />
          </div>
          <div className="flex items-center">
            <label className="font-medium text-lg w-32">Chi nhánh:</label>
            <input
              type="text"
              name="branch"
              value={employee.branch}
              onChange={handleChange}
              className="ml-2 p-2 border rounded w-full"
              placeholder="Nhập chi nhánh..."
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
