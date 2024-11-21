import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { notification, Breadcrumb, Modal, Image } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { getBranchByBranchId, updateStatusBranch } from "../../../api/branch";

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

const UpdateBranch_Ad = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [branchDetails, setBranchDetails] = useState(null);

  useEffect(() => {
    const fetchBranchDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        if (!token) {
          console.log("Không có token, chuyển hướng đến trang login");
          navigate("/login");
          return;
        }

        if (id) {
          console.log("Đang gọi API với ID:", id);
          const response = await getBranchByBranchId(id);
          console.log("API Response:", response);

          if (response) {
            console.log("Dữ liệu nhận được:", response);
            setBranchDetails(response);
          } else {
            throw new Error("Không có dữ liệu từ API");
          }
        }
      } catch (error) {
        console.error("Chi tiết lỗi:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải thông tin chi nhánh. " + error.message,
        });
      }
    };

    console.log("useEffect được gọi với id:", id);
    fetchBranchDetails();
  }, [id, navigate]);

  console.log("Current branchDetails:", branchDetails);

  const showConfirm = (newStatus) => {
    if (
      (newStatus === "ACTIVE" && branchDetails.status === "ACTIVE") ||
      (newStatus === "INACTIVE" && branchDetails.status === "INACTIVE")
    ) {
      return;
    }

    confirm({
      title: "Xác nhận thay đổi trạng thái",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn ${
        newStatus === "ACTIVE" ? "kích hoạt" : "vô hiệu hóa"
      } chi nhánh này?`,
      onOk: () => handleStatusUpdate(newStatus),
      okText: "Đồng ý",
      cancelText: "Hủy",
    });
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      if (branchDetails.status === newStatus) {
        notification.warning({
          message: "Cảnh báo",
          description: "Trạng thái chi nhánh không thay đổi",
        });
        return;
      }

      await updateStatusBranch(id, newStatus);

      const updatedBranch = await getBranchByBranchId(id);
      if (updatedBranch) {
        setBranchDetails(updatedBranch);
        notification.success({
          message: "Thành công",
          description: "Cập nhật trạng thái thành công",
        });
      } else {
        throw new Error("Không nhận được dữ liệu cập nhật");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể cập nhật trạng thái",
      });
    }
  };

  if (!branchDetails) {
    console.log("Đang trong trạng thái loading");
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="pb-4 px-4">
        <h2 className="text-xl text-blue-800 font-sans">
          Cập nhật trạng thái chi nhánh
        </h2>
        <Breadcrumb
          separator=">"
          items={[
            { title: "Chi nhánh" },
            {
              title: (
                <span className="text-[#002278]">Cập nhật trạng thái</span>
              ),
            },
          ]}
        />
      </div>

      <div className="bg-white rounded-lg border p-8">
        <div className="flex gap-8">
          {/* Thông tin chi nhánh */}
          <div className="flex-1">
            <h3 className="text-xl mb-6 text-gray-800 font-semibold">
              Thông tin chi nhánh
            </h3>

            <div className="bg-gray-50 rounded-xl p-6 space-y-6">
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="text-lg font-medium text-blue-800">
                    Tên chi nhánh
                  </label>
                  <p className="text-base text-gray-900">
                    {branchDetails.name}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-lg font-medium text-blue-800">
                    Địa chỉ chi tiết
                  </label>
                  <p className="text-base text-gray-900">
                    {`${branchDetails.address}, ${branchDetails.ward}, ${branchDetails.district}, ${branchDetails.province}`}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-lg font-medium text-blue-800">
                    Đơn hàng đang chờ
                  </label>
                  <p className="text-base text-gray-900">
                    {branchDetails.pendingAmount}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-lg font-medium text-blue-800">
                    Đơn hàng đang xử lý
                  </label>
                  <p className="text-base text-gray-900">
                    {branchDetails.processingAmount}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-lg font-medium text-blue-800">
                    Đơn hàng hoàn thành
                  </label>
                  <p className="text-base text-gray-900">
                    {branchDetails.finishedAmount}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-lg font-medium text-blue-800">
                    Đơn hàng đã hủy
                  </label>
                  <p className="text-base text-gray-900">
                    {branchDetails.canceledAmount}
                  </p>
                </div>
              </div>

              {/* Phần trạng thái */}
              <div className="pt-4 border-t">
                <label className="text-lg font-medium text-blue-800">
                  Trạng thái chi nhánh
                </label>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                      branchDetails.status === "INACTIVE"
                        ? "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                        : "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        branchDetails.status === "INACTIVE"
                          ? "bg-red-600"
                          : "bg-green-600"
                      }`}
                    ></span>
                    {branchDetails.status === "INACTIVE"
                      ? "Ngừng hoạt động"
                      : "Đang hoạt động"}
                  </span>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex justify-center gap-4 pt-6">
                <button
                  onClick={() => showConfirm("ACTIVE")}
                  disabled={branchDetails.status === "ACTIVE"}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      branchDetails.status === "ACTIVE"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                >
                  Kích hoạt chi nhánh
                </button>

                <button
                  onClick={() => showConfirm("INACTIVE")}
                  disabled={branchDetails.status === "INACTIVE"}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      branchDetails.status === "INACTIVE"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                >
                  Vô hiệu hóa chi nhánh
                </button>

                <button
                  onClick={() =>
                    navigate(
                      `/admin/store/update/${branchDetails.businessId}`
                    )
                  }
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Quay lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateBranch_Ad;
