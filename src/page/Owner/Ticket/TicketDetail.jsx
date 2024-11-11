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
      <div className="mb-4">
        <div className="flex justify-between items-center pb-4 px-4">
          <div>
            <h2 className="text-xl font-semibold text-blue-800">
              Chi tiết đơn khiếu nại
            </h2>
            <Breadcrumb
              separator=">"
              items={[
                { title: <Link to="/owner/ticket">Khiếu nại</Link> },
                { title: `Chi tiết đơn khiếu nại` },
              ]}
            />
          </div>
        </div>
        <div className="flex gap-8">
          {/* Left side - Image section */}
          <div className="w-72 bg-white rounded-lg p-4 shadow-sm border-2 border-[#002278]">
            <h3 className="text-lg font-medium mb-3 text-center">
              Hình ảnh đính kèm
            </h3>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              {ticketDetails.images &&
                ticketDetails.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Hình ảnh ${index + 1}`}
                    className="w-full h-auto rounded-lg mb-4 border border-[#002278]"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/path/to/default/image.png";
                    }}
                  />
                ))}
            </div>
          </div>

          {/* Right side - Ticket details */}
          <div className="flex-1 bg-white rounded-lg p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex">
                <p className="font-semibold mr-2">Tiêu đề:</p>
                <p>{ticketDetails.title}</p>
              </div>

              <div className="flex items-center">
                <p className="font-semibold mr-2">Trạng thái:</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusDisplay(ticketDetails.status).className}`}
                >
                  {getStatusDisplay(ticketDetails.status).text}
                </span>
              </div>

              <div className="flex">
                <p className="font-semibold mr-2">Người tạo:</p>
                <p>{ticketDetails.fullName}</p>
              </div>

              <div className="flex">
                <p className="font-semibold mr-2">Người xử lý:</p>
                <p>{ticketDetails.moderatorName || "Chưa phân công"}</p>
              </div>

              <div className="flex">
                <p className="font-semibold mr-2">Ngày tạo:</p>
                <p>{formatDate(ticketDetails.createdAt)}</p>
              </div>

              <div className="flex">
                <p className="font-semibold mr-2">Mức độ ưu tiên:</p>
                <p>{getPriorityLabel(ticketDetails.priority)}</p>
              </div>
            </div>

            <div className="flex">
              <p className="font-semibold mr-2">Nội dung:</p>
              <p className="whitespace-pre-wrap">{ticketDetails.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
