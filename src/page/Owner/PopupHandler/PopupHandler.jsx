import React, { useEffect, useState } from "react";
import ComModal from "../../../Components/ComModal/ComModal";
import { useModalState } from "../../../hooks/useModalState";
import { getData } from "../../../api/api";
import { useStorage } from "../../../hooks/useLocalStorage";
import { Link, useLocation } from "react-router-dom";
import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react"; // Import icon từ Lucide

export default function PopupHandler({ children }) {
  const modal = useModalState();
  const [business, setBusiness] = useState(null);
  const [user, setUser] = useStorage("user", null);
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await getData(`/businesses/${user.businessId}`);
        console.log("Dữ liệu doanh nghiệp:", response.data);
        setBusiness(response.data.data);

        // Kiểm tra thời gian hết hạn gói
        const expiredTime = new Date(response?.data?.data?.expiredTime); // Chuyển expiredTime thành đối tượng Date
        const currentTime = new Date(); // Lấy thời gian hiện tại
        const timeDifference = expiredTime - currentTime; // Tính toán sự chênh lệch giữa expiredTime và thời gian hiện tại

        // Kiểm tra nếu thời gian còn lại dưới 10 ngày (10 ngày = 10 * 24 * 60 * 60 * 1000 milliseconds)
        if (timeDifference <= 10 * 24 * 60 * 60 * 1000) {
          if (response.data?.data?.status === "ACTIVE") {
            modal.handleOpen(); // Mở modal khi còn dưới 10 ngày
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin doanh nghiệp:", error);
      }
    };

    fetchBusiness();
  }, []); // Cập nhật khi `currentPath`, `user.businessId` hoặc `modal` thay đổi

  // Render các trạng thái với biểu tượng và thông báo đẹp hơn
  const renderBusinessStatus = () => {
    switch (business?.status) {
      case "UNREGISTERED":
        return (
          <div>
            <div className="  text-yellow-600 text-center">
              <div className="flex items-center gap-2 justify-center">
                <XCircle className="w-6 h-6" />
                Bạn chưa đăng ký gói! Vui lòng đăng ký để sử dụng dịch vụ.
              </div>
              <Link className="text-teal-500" to={"/owner/package"}>
                Đăng ký gói
              </Link>
            </div>
          </div>
        );
      case "ACTIVE":
        return <div className="flex items-center gap-2 text-green-600"></div>;
      case "EXPIRED":
        return (
          <div>
            <div className="  text-yellow-600 text-center">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-6 h-6" />
                Gói dịch vụ của bạn đã hết hạn.
              </div>
              <Link className="text-teal-500" to={"/owner/package"}>
                Đăng ký gói
              </Link>
            </div>
          </div>
        );
      case "INACTIVE":
        return (
          <div className="flex items-center gap-2 text-gray-600">
        
          </div>
        );
      case "SUSPENDED":
        return (
          <div className="flex items-center gap-2 text-gray-600 justify-center">
            <XCircle className="w-6 h-6" />
            Tài khoản bạn đã bị khóa. Vui lòng liên hệ với quản trị viên.
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Render các trạng thái với thông báo */}
      {renderBusinessStatus()}

      {/* Hiển thị ComModal nếu thời gian còn lại dưới 10 ngày */}
      <ComModal
        isOpen={modal?.isModalOpen}
        onClose={modal?.handleClose}
        width={400}
        className="p-6 bg-white shadow-lg rounded-xl"
      >
        <div className="text-center text-lg font-semibold text-red-600">
          <Clock className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
          <div>
            <p className="mb-2">
              Bạn sắp hết hạn gói. Vui lòng gia hạn để tiếp tục sử dụng dịch vụ.
            </p>
            <p className="text-sm text-gray-600">
              Thời gian còn lại: dưới 10 ngày. Hãy thực hiện gia hạn ngay.
            </p>
            <Link
              onClick={modal?.handleClose}
              className="text-teal-500"
              to={"/owner/package"}
            >
              Đăng ký gói
            </Link>
          </div>
        </div>
      </ComModal>

      {/* Children Component */}
      {business?.status === "ACTIVE" && children}
      {business?.status === "INACTIVE" && children}
    </div>
  );
}
