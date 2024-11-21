import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getAccountById, updateStatusUser } from "../../../api/user";
import { notification, Breadcrumb, Modal, Image } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { confirm } = Modal;

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

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

const UpdateUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        if (id) {
          const response = await getAccountById(id);
          if (response && response.data) {
            // console.log('Response data:', response.data);
            // console.log('Status type:', typeof response.data.status);
            // console.log('Status value:', response.data.status);
            // console.log('Status comparison:', response.data.status === 'INACTIVE');

            let normalizedStatus;
            switch (response.data.status) {
              case 'Hoạt Động':
              case 'ACTIVE':
                normalizedStatus = 'Hoạt Động';
                break;
              case 'Ngưng Hoạt Động':
              case 'INACTIVE':
                normalizedStatus = 'Ngưng Hoạt Động';
                break;
              default:
                normalizedStatus = 'Không xác định';
            }
            
            setUserDetails({
              ...response.data,
              status: normalizedStatus
            });
          }
        }
      } catch (error) {
        notification.error({
          message: "Lỗi",
          description: "Không thể tải thông tin người dùng",
        });
      }
    };

    fetchUserDetails();
  }, [id, navigate]);

  const showConfirm = (newStatus) => {
    if (
      (newStatus === 'ACTIVE' && userDetails.status === 'Hoạt Động') || 
      (newStatus === 'INACTIVE' && userDetails.status === 'Ngưng Hoạt Động')
    ) {
      notification.warning({
        message: "Cảnh báo",
        description: "Tài khoản đã ở trạng thái này"
      });
      return;
    }

    confirm({
      title: 'Xác nhận thay đổi trạng thái',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn ${newStatus === 'ACTIVE' ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản này?`,
      onOk: () => handleStatusUpdate(newStatus),
      okText: 'Đồng ý',
      cancelText: 'Hủy',
    });
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateStatusUser(id, newStatus);
      
      notification.success({
        message: "Thành công", 
        description: "Cập nhật trạng thái thành công"
      });

      // Cập nhật lại status trong userDetails
      setUserDetails(prev => ({
        ...prev,
        status: newStatus === 'ACTIVE' ? 'Hoạt Động' : 'Ngưng Hoạt Động'
      }));

    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể cập nhật trạng thái"
      });
    }
  };

  if (!userDetails) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="p-6">
      <div className="pb-4 px-4">
        <h2 className="text-xl text-blue-800 font-sans">
          Cập nhật trạng thái người dùng
        </h2>
        <Breadcrumb
          separator=">"
          items={[
            { title: <Link to="/admin/user">Người dùng</Link> },
            { title: <span className="text-[#002278]">Cập nhật trạng thái</span> },
          ]}
        />
      </div>

      <div className="bg-white rounded-lg border p-8">
        <div className="flex gap-8">
          {/* Thông tin người dùng */}
          <div className="flex-1">
            <h3 className="text-xl mb-6 text-gray-800 font-semibold">Thông tin cá nhân</h3>
            
            {/* Card chứa thông tin */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-6">
              {/* Grid thông tin cá nhân */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="text-lg font-medium text-blue-800">Họ và tên</label>
                  <p className="text-base text-gray-900">{userDetails.fullName}</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-lg font-medium text-blue-800">Email</label>
                  <p className="text-base text-gray-900">{userDetails.email}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-lg font-medium text-blue-800">Số điện thoại</label>
                  <p className="text-base text-gray-900">{userDetails.phone}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-lg font-medium text-blue-800">Giới tính</label>
                  <p className="text-base text-gray-900">
                    {userDetails.gender === 'MALE' ? 'Nam' : 'Nữ'}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-lg font-medium text-blue-800">Ngày sinh</label>
                  <p className="text-base text-gray-900">{formatDate(userDetails.dob)}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-lg font-medium text-blue-800">Vai trò</label>
                  <p className="text-base text-gray-900">{getRole(userDetails.role)}</p>
                </div>
              </div>

              {/* Phần trạng thái */}
              <div className="pt-4 border-t">
                <label className="text-lg font-medium text-blue-800">Trạng thái tài khoản</label>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    userDetails.status === 'Ngưng Hoạt Động' 
                      ? "bg-red-50 text-red-700 ring-1 ring-red-600/20" 
                      : "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                  }`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      userDetails.status === 'Ngưng Hoạt Động' ? 'bg-red-600' : 'bg-green-600'
                    }`}></span>
                    {userDetails.status}
                  </span>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex justify-end gap-4 pt-6">
                <button
                  onClick={() => showConfirm('ACTIVE')}
                  disabled={userDetails.status === 'Hoạt Động'}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${userDetails.status === 'Hoạt Động'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                >
                  Kích hoạt tài khoản
                </button>
                
                <button
                  onClick={() => showConfirm('INACTIVE')}
                  disabled={userDetails.status === 'Ngưng Hoạt Động'}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${userDetails.status === 'Ngưng Hoạt Động'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                >
                  Vô hiệu hóa tài khoản
                </button>

                <button
                  onClick={() => navigate("/admin/user")}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Quay lại
                </button>
              </div>
            </div>
          </div>

          {/* Ảnh người dùng */}
          <div className="w-1/3">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Ảnh nhân viên</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-white border flex items-center justify-center">
                {userDetails.imageUrl ? (
                  <Image
                    src={userDetails.imageUrl}
                    alt="Ảnh nhân viên"
                    className="w-full h-full object-cover"
                    preview={{
                      mask: <div className="text-sm">Xem ảnh</div>,
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Không có ảnh</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;