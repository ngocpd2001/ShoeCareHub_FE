import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

const EmployeeDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { employee } = location.state || {};

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold text-[#002278] mb-4">Chi tiết nhân viên</h2>
          <nav className="mb-4 text-base text-gray-500">
          <span className="cursor-pointer" onClick={() => navigate("/")}>Cửa hàng</span> &gt; 
            <span className="mx-1"></span>
            <span className="cursor-pointer" onClick={() => navigate("/owner/employee")}> Nhân viên</span> &gt; 
            <span className="mx-1"></span>
            <span>Chi tiết nhân viên</span>
          </nav>
        </div>
        
        <button
          onClick={() => navigate(`/edit-employee/${employee.id}`)}
          className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 flex items-center gap-2 justify-center"
        >
          <FontAwesomeIcon icon={faPen} />
          Chỉnh sửa nhân viên
        </button>
      </div>

      <div className="flex gap-8">
        {/* Left side - Image section */}
        <div className="w-72 bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-3 text-center">Ảnh nhân viên</h3>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <img
              src={employee.avatar}
              alt="Ảnh nhân viên"
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/path/to/default/avatar.png";
              }}
            />
          </div>
        </div>

        {/* Right side - Employee details */}
        <div className="flex-1 bg-white rounded-lg p-6 shadow-sm space-y-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="font-medium text-lg">Họ và tên: </span>
              <span className="ml-2">{employee.name}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-lg">Ngày sinh: </span>
              <span className="ml-2">{employee.dob || "N/A"}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-lg">Chức vụ: </span>
              <span className="ml-2">{employee.position}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-lg">Chi nhánh: </span>
              <span className="ml-2">{employee.branch}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-lg">Gmail: </span>
              <span className="ml-2">{employee.email}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-lg">Số điện thoại: </span>
              <span className="ml-2">{employee.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
