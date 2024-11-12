import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { notification, Breadcrumb } from "antd";
import { getTicketById } from "../../../api/ticket";
import { getStatusDisplay } from "./TableTicket";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getPriorityLabel = (priority) => {
  switch (priority) {
    case 1:
      return "Thấp";
    case 3:
      return "Trung bình";
    case 5:
      return "Cao";
    default:
      return "Không xác định";
  }
};

const TicketDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ticketDetails, setTicketDetails] = useState(null);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Chưa đăng nhập");
          navigate("/login");
          return;
        }

        if (id) {
          const response = await getTicketById(id);
          console.log("API Response:", response);

          if (response && response.data) {
            setTicketDetails(response.data);
          } else {
            console.error("Không có dữ liệu trong response:", response);
          }
        }
      } catch (error) {
        console.error("Error fetching ticket details:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải thông tin phiếu hỗ trợ",
          duration: 3,
        });
      }
    };

    fetchTicketDetails();
  }, [id, navigate]);

  if (!ticketDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      {/* Header with Breadcrumb */}
      <div className="flex justify-between items-center pb-4 px-4">
        <div>
          <h2 className="text-xl font-semibold text-blue-800">
            Chi tiết khiếu nại
          </h2>
          <Breadcrumb
            separator=">"
            items={[
              { title: "Cửa hàng" },
              { title: <Link to="/owner/ticket">Khiếu nại</Link> },
              { title: "Chi tiết khiếu nại" },
            ]}
          />
        </div>
      </div>

      {/* Rest of the existing content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Header Info */}
        <div className="grid grid-cols-2 gap-4 mb-6 border-b pb-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Người gửi:</span>
            <span>{ticketDetails.fullName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Ngày tạo:</span>
            <span>{formatDate(ticketDetails.createTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Dịch vụ:</span>
            <span>Hỗ trợ kỹ thuật</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Trạng thái:</span>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusDisplay(ticketDetails.status).className}`}>
              {getStatusDisplay(ticketDetails.status).text}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-6">
          <div>
            <h3 className="font-medium mb-2">Tiêu đề:</h3>
            <p className="bg-gray-50 p-3 rounded">{ticketDetails.title}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Nội dung:</h3>
            <p className="bg-gray-50 p-3 rounded whitespace-pre-wrap">
              {ticketDetails.description}
            </p>
          </div>
        </div>

        {/* Attachments */}
        <div className="mb-6">
          <h3 className="font-medium mb-4">Tệp đính kèm:</h3>
          <div className="flex gap-4">
            {ticketDetails.images && ticketDetails.images.map((image, index) => (
              <div key={index} className="w-[200px]">
                <img
                  src={image}
                  alt={`Ảnh ${index + 1}`}
                  className="w-full h-auto rounded border"
                />
                <a href={image} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-1 block">
                  Xem ảnh
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* History Section */}
        <div className="mb-6">
          <h3 className="font-medium mb-4">Lịch sử trao đổi</h3>
          <div className="bg-gray-50 p-4 rounded">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-800">A</span>
              </div>
              <div className="flex-1">
                <div className="font-medium">Admin</div>
                <p className="text-gray-600 mb-2">{ticketDetails.description}</p>
                {ticketDetails.images && ticketDetails.images.map((image, index) => (
                  <div key={index} className="mb-2">
                    <img
                      src={image}
                      alt={`Ảnh ${index + 1}`}
                      className="max-w-[200px] rounded border"
                    />
                  </div>
                ))}
                <div className="text-sm text-gray-500">
                  {formatDate(ticketDetails.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/owner/ticket")}
            className="px-6 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
