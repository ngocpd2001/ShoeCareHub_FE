import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { getAccountById } from "../../../api/user";
import { notification, Breadcrumb, Image } from "antd";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Thêm hàm chuyển đổi role sang tiếng Việt
const getRole = (role) => {
  switch (role) {
    case "OWNER":
      return "Chủ cửa hàng";
    case "MANAGER":
      return "Quản lý";
    case "STAFF":
      return "Nhân viên";
    default:
      return role;
  }
};

// Sửa lại hàm chuyển đổi status
const getStatus = (status) => {
  switch (status) {
    case "Hoạt Động":
      return "Đang hoạt động";
    case "Ngừng Hoạt Động":
      return "Ngừng hoạt động";
    default:
      return status || "Không xác định";
  }
};

const EmployeeDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employeeDetails, setEmployeeDetails] = useState(null);

  console.log("Employee ID:", id);

  // Hook thứ nhất - fetch dữ liệu
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Chưa đăng nhập");
          navigate("/login");
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
        notification.error({
          message: "Lỗi",
          description: "Không thể tải thông tin nhân viên",
          duration: 3,
        });
      }
    };

    fetchEmployeeDetails();
  }, [id, navigate]);

  // Hook thứ hai - log dữ liệu
  useEffect(() => {
    if (employeeDetails) {
      console.log("Employee details:", employeeDetails);
      console.log("Image URL:", employeeDetails?.imageUrl);
    }
  }, [employeeDetails]);

  if (!employeeDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      {/* Header section */}
      <div className="pb-4 px-4">
        <h2 className="text-xl font-semibold text-blue-800">
          Chi tiết nhân viên
        </h2>
        <Breadcrumb
          separator=">"
          items={[
            { title: "Cửa hàng" },
            { title: <Link to="/owner/employee">Nhân viên</Link> },
            { title: <span className="text-[#002278]">Chi tiết nhân viên</span> },
          ]}
        />
      </div>

      {/* Main content - 2 columns */}
      <div className="bg-white rounded-lg border p-8">
        <div className="flex gap-8">
          {/* Left column - Information */}
          <div className="flex-1 space-y-6">
            <div className="space-y-5">
              <div className="flex flex-col">
                <span className="text-gray-600 text-lg mb-2">Họ và tên</span>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full text-lg"
                  value={employeeDetails.fullName}
                  disabled
                />
              </div>

              <div className="flex flex-col">
                <span className="text-gray-600 text-lg mb-2">Email</span>
                <input
                  type="email"
                  className="border rounded-md p-2 w-full text-lg"
                  value={employeeDetails.email}
                  disabled
                />
              </div>

              <div className="flex flex-col">
                <span className="text-gray-600 text-lg mb-2">
                  Số điện thoại
                </span>
                <input
                  type="tel"
                  className="border rounded-md p-2 w-full text-lg"
                  value={employeeDetails.phone}
                  disabled
                />
              </div>

              <div className="flex flex-col">
                <span className="text-gray-600 text-lg mb-2">Giới tính</span>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full text-lg"
                  value={employeeDetails.gender === "MALE" ? "Nam" : "Nữ"}
                  disabled
                />
              </div>

              <div className="flex flex-col">
                <span className="text-gray-600 text-lg mb-2">Ngày sinh</span>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full text-lg"
                  value={formatDate(employeeDetails.dob)}
                  disabled
                />
              </div>

              <div className="flex flex-col">
                <span className="text-gray-600 text-lg mb-2">Vai trò</span>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full text-lg"
                  value={getRole(employeeDetails.role)}
                  disabled
                />
              </div>

              <div className="flex flex-col">
                <span className="text-gray-600 text-lg mb-2">Trạng thái</span>
                <div
                  className={`inline-flex px-4 py-2 rounded-md text-lg font-medium ${
                    employeeDetails.status === "Hoạt Động"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {getStatus(employeeDetails.status)}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() => navigate("/owner/employee")}
                className="px-6 py-2 text-lg bg-blue-900 text-white rounded hover:bg-blue-800 flex items-center gap-2"
              >
                Quay lại
              </button>
              {/* <button
                onClick={() => navigate(`/edit-employee/${employeeDetails.id}`)}
                className="px-6 py-2 text-lg bg-blue-900 text-white rounded hover:bg-blue-800 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPen} />
                Chỉnh sửa
              </button> */}
            </div>
          </div>

          {/* Right column - Image */}
          <div className="w-1/3">
            <h3 className="text-xl font-semibold mb-4">Ảnh nhân viên</h3>
            <div className="w-full h-[400px] rounded-lg overflow-hidden bg-white border flex items-center justify-center">
              {employeeDetails.imageUrl ? (
                <Image
                  src={employeeDetails.imageUrl}
                  alt="Ảnh nhân viên"
                  className="!w-full !h-full object-fill"
                  fallback="data:image/png;base64,..."
                  preview={{
                    mask: "Xem ảnh",
                  }}
                  rootClassName="!w-full !h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Không có ảnh</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
