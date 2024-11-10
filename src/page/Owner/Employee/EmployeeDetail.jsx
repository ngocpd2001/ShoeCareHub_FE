import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { notification } from "antd";
import { getAccountById } from "../../../api/user";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Thêm hàm chuyển đổi role sang tiếng Việt
const getRole = (role) => {
  switch(role) {
    case 'OWNER':
      return 'Chủ cửa hàng';
    case 'MANAGER':
      return 'Quản lý';
    case 'STAFF':
      return 'Nhân viên';
    default:
      return role;
  }
};

// Sửa lại hàm chuyển đổi status
const getStatus = (status) => {
  switch(status) {
    case 'Hoạt Động':
      return 'Đang hoạt động';
    case 'Ngừng Hoạt Động':
      return 'Ngừng hoạt động';
    default:
      return status || 'Không xác định';
  }
};

const EmployeeDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employeeDetails, setEmployeeDetails] = useState(null);

  console.log("Employee ID:", id);

  useEffect(() => {  
    const fetchEmployeeDetails = async () => {  
      try {  
        const token = localStorage.getItem('token');  
        if (!token) {  
          console.error("Chưa đăng nhập");  
          navigate('/login');  
          return;  
        }  
  
        if (id) {  
          const response = await getAccountById(id);  
          console.log("API Response:", response);
          
          if (response && response.data) {
            setEmployeeDetails(response.data);
          } else {
            console.error("Không có dữ liệu trong response:", response);
          }
        }  
      } catch (error) {  
        console.error("Error fetching employee details:", error);
        let errorMessage = 'Không thể tải thông tin nhân viên';  
        
        if (error.response?.status === 401) {
          errorMessage = 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại';
          localStorage.removeItem('token');
          navigate('/login');
        }

        notification.error({  
          message: 'Lỗi',  
          description: errorMessage,  
          duration: 3  
        });  
      }  
    };  
  
    fetchEmployeeDetails();  
  }, [id, navigate]);

  if (!employeeDetails) {
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
        
        {/* <button
          onClick={() => navigate(`/edit-employee/${employeeDetails.id}`)}
          className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 flex items-center gap-2 justify-center"
        >
          <FontAwesomeIcon icon={faPen} />
          Chỉnh sửa nhân viên
        </button> */}
      </div>

      <div className="flex gap-8">
        {/* Left side - Image section */}
        <div className="w-72 bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-3 text-center">Ảnh nhân viên</h3>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <img
              src={employeeDetails.imageUrl}
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
              <span className="ml-2">{employeeDetails.fullName}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-lg">Ngày sinh: </span>
              <span className="ml-2">{formatDate(employeeDetails.dob)}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-lg">Giới tính: </span>
              <span className="ml-2">
                {employeeDetails.gender === 'MALE' ? 'Nam' : 
                 employeeDetails.gender === 'FEMALE' ? 'Nữ' : 
                 employeeDetails.gender}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-lg">Vai trò: </span>
              <span className="ml-2">{getRole(employeeDetails.role)}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-lg">Trạng thái: </span>
              <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                employeeDetails.status === 'Hoạt Động' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {getStatus(employeeDetails.status)}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-lg">Gmail: </span>
              <span className="ml-2">{employeeDetails.email}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-lg">Số điện thoại: </span>
              <span className="ml-2">{employeeDetails.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
