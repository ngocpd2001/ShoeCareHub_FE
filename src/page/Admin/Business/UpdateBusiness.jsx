import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { updateStatusBusiness, getBusinessById } from "../../../api/businesses";
import { notification, Breadcrumb, Modal, Image, Select } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { getBranchByBusinessId } from "../../../api/branch";

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

const UpdateBusiness = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [businessDetails, setBusinessDetails] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        if (id) {
          console.log('Đang lấy thông tin doanh nghiệp với ID:', id);
          const response = await getBusinessById(id);
          console.log('Response từ API:', response);
          if (response) {
            console.log('Dữ liệu sẽ được set:', response);
            setBusinessDetails(response);
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin:', error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải thông tin doanh nghiệp",
        });
      }
    };

    fetchBusinessDetails();
  }, [id, navigate]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        if (id) {
          const response = await getBranchByBusinessId(id);
          const branchesData = response?.data || [];
          console.log('Dữ liệu chi nhánh:', branchesData);
          setBranches(Array.isArray(branchesData) ? branchesData : []);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách chi nhánh:', error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải danh sách chi nhánh"
        });
        setBranches([]);
      }
    };

    fetchBranches();
  }, [id]);

  const showConfirm = (newStatus) => {
    if (
      (newStatus === 'ACTIVE' && businessDetails.status === 'ACTIVE') || 
      (newStatus === 'INACTIVE' && businessDetails.status === 'INACTIVE')
    ) {
      return;
    }

    confirm({
      title: 'Xác nhận thay đổi trạng thái',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn ${newStatus === 'ACTIVE' ? 'kích hoạt' : 'vô hiệu hóa'} doanh nghiệp này?`,
      onOk: () => handleStatusUpdate(newStatus),
      okText: 'Đồng ý',
      cancelText: 'Hủy',
    });
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      console.log('Bắt đầu cập nhật trạng thái:', newStatus);
      console.log('Trạng thái hiện tại:', businessDetails.status);

      if (businessDetails.status === newStatus) {
        console.log('Trạng thái không thay đổi');
        notification.warning({
          message: "Cảnh báo",
          description: "Trạng thái doanh nghiệp không thay đổi"
        });
        return;
      }

      console.log('Gọi API updateStatusBusiness với ID:', id, 'newStatus:', newStatus);
      const updateResponse = await updateStatusBusiness(id, newStatus);
      console.log('Kết quả cập nhật:', updateResponse);
      
      notification.success({
        message: "Thành công", 
        description: "Cập nhật trạng thái thành công"
      });

      console.log('Đang lấy thông tin mới...');
      const updatedBusiness = await getBusinessById(id);
      console.log('Thông tin mới:', updatedBusiness);
      setBusinessDetails(updatedBusiness);
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      notification.error({
        message: "Lỗi",
        description: error.response?.data?.message || "Không thể cập nhật trạng thái"
      });
    }
  };

  const handleBranchSelect = (branchId) => {
    if (branchId) {
      navigate(`/admin/branch/update/${branchId}`);
    }
  };

  if (!businessDetails) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="p-6">
      <div className="pb-4 px-4">
        <h2 className="text-xl text-blue-800 font-sans">
          Cập nhật trạng thái doanh nghiệp
        </h2>
        <Breadcrumb
          separator=">"
          items={[
            { title: <Link to="/admin/store">Doanh nghiệp</Link> },
            { title: <span className="text-[#002278]">Cập nhật trạng thái</span> },
          ]}
        />
      </div>

      <div className="bg-white rounded-lg border p-8">
        <div className="flex gap-8">
          {/* Thông tin doanh nghiệp */}
          <div className="flex-1">
            <h3 className="text-xl mb-6 text-gray-800 font-semibold">Thông tin doanh nghiệp</h3>
            
            <div className="bg-gray-50 rounded-xl p-6 space-y-6">
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="text-lg font-medium text-blue-800">Tên doanh nghiệp</label>
                  <p className="text-base text-gray-900">{businessDetails.name}</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-lg font-medium text-blue-800">Số điện thoại</label>
                  <p className="text-base text-gray-900">{businessDetails.phone}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-lg font-medium text-blue-800">Đánh giá</label>
                  <p className="text-base text-gray-900">{businessDetails.rating}/5</p>
                </div>

                <div className="space-y-2">
                  <label className="text-lg font-medium text-blue-800">Tổng đơn hàng</label>
                  <p className="text-base text-gray-900">{businessDetails.totalOrder}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-lg font-medium text-blue-800">Tổng số dịch vụ</label>
                  <p className="text-base text-gray-900">{businessDetails.toTalServiceNum}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-lg font-medium text-blue-800">Ngày tạo</label>
                  <p className="text-base text-gray-900">{formatDate(businessDetails.createdDate)}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-lg font-medium text-blue-800">Ngày đăng ký gói</label>
                  <p className="text-base text-gray-900">{formatDate(businessDetails.registeredTime)}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-lg font-medium text-blue-800">Ngày hết hạn gói</label>
                  <p className="text-base text-gray-900">{formatDate(businessDetails.expiredTime)}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-lg font-medium text-blue-800">Chi nhánh</label>
                  <Select
                    placeholder="Chọn chi nhánh"
                    className="w-full"
                    value={selectedBranch}
                    onChange={handleBranchSelect}
                    options={Array.isArray(branches) ? branches.map(branch => ({
                      value: branch.id,
                      label: branch.name
                    })) : []}
                  />
                </div>
              </div>

              {/* Phần trạng thái */}
              <div className="pt-4 border-t">
                <label className="text-lg font-medium text-blue-800">Trạng thái doanh nghiệp</label>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    businessDetails.status === 'INACTIVE' 
                      ? "bg-red-50 text-red-700 ring-1 ring-red-600/20" 
                      : "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                  }`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      businessDetails.status === 'INACTIVE' ? 'bg-red-600' : 'bg-green-600'
                    }`}></span>
                    {businessDetails.status === 'INACTIVE' ? 'Ngừng hoạt động' : 'Đang hoạt động'}
                  </span>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex justify-end gap-4 pt-6">
  <button
    onClick={() => showConfirm('ACTIVE')}
    disabled={businessDetails.status === 'ACTIVE'}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
      ${businessDetails.status === 'ACTIVE'
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-green-600 text-white hover:bg-green-700'
      }`}
  >
    Kích hoạt doanh nghiệp
  </button>
  
  <button
    onClick={() => showConfirm('INACTIVE')}
    disabled={businessDetails.status === 'INACTIVE'}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
      ${businessDetails.status === 'INACTIVE'
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-red-600 text-white hover:bg-red-700'
      }`}
  >
    Vô hiệu hóa doanh nghiệp
  </button>

  <button
    onClick={() => navigate("/admin/store")}
    className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
  >
    Quay lại
  </button>
</div>
            </div>
          </div>

          {/* Ảnh doanh nghiệp */}
          <div className="w-1/3">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Ảnh doanh nghiệp</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-white border flex items-center justify-center">
                {businessDetails.imageUrl ? (
                  <Image
                    src={businessDetails.imageUrl}
                    alt="Ảnh doanh nghiệp"
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

export default UpdateBusiness;