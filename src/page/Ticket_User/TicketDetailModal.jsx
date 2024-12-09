import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faDownload,
  faUser,
  faTag,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { getTicketById, updateTicketStatus } from "../../api/ticket";
import ReplyTicketModal from "./ReplyTicketModal";
import { Image } from "antd";

const TicketDetailModal = ({ ticketId, onClose }) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showMainModal, setShowMainModal] = useState(true);

  const fetchTicketData = async () => {
    try {
      const response = await getTicketById(ticketId);
      setTicket(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchTicketData();
    }
  }, [ticketId]);

  // Thêm useEffect để xử lý việc cuộn trang
  useEffect(() => {
    // Khi modal mở, thêm các styles để ngăn cuộn và cố định body
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    // Cleanup function khi component unmount
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-3">
          <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-700 font-medium">
            Đang tải thông tin...
          </span>
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  const getStatusStyle = (status) => {
    switch (status) {
      case "OPENING":
        return "bg-blue-100 text-blue-600";
      case "PROCESSING":
        return "bg-orange-100 text-orange-600";
      case "CLOSED":
        return "bg-green-100 text-green-600";
      case "CANCELED":
        return "bg-red-100 text-red-600";
      case "RESOLVING":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "OPENING":
        return "Đang chờ";
      case "PROCESSING":
        return "Đang xử lý";
      case "CLOSED":
        return "Đã đóng";
      case "CANCELED":
        return "Đã hủy";
      case "RESOLVING":
        return "Xử lý lại dịch vụ";
      default:
        return status;
    }
  };

  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  const handleReplyClick = () => {
    console.log("Current ticketId:", ticketId);
    setShowMainModal(false);
    setShowReplyModal(true);
  };

  const handleReplyClose = () => {
    setShowReplyModal(false);
    setShowMainModal(true);
  };

  const handleReplySuccess = () => {
    fetchTicketData();
    setShowReplyModal(false);
    setShowMainModal(true);
  };

  return (
    <>
      {showMainModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] relative flex flex-col">
            {/* Header - Thêm sticky */}
            <div className="bg-[#002278] text-white px-6 py-4 rounded-t-lg flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xl font-semibold">Chi tiết khiếu nại</h2>
              <button onClick={onClose} className="hover:opacity-80">
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>

            {/* Content - Thêm overflow-y-auto */}
            <div className="p-6 overflow-y-auto">
              {/* Thông tin cơ bản */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FontAwesomeIcon icon={faUser} className="text-[#002278]" />
                    <span className="text-gray-600">Người gửi:</span>
                    <span className="font-medium">{ticket.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <FontAwesomeIcon icon={faTag} className="text-[#002278]" />
                    <span className="text-gray-600">Dịch vụ:</span>
                    <span className="font-medium">{ticket.categoryName}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="text-[#002278]"
                    />
                    <span className="text-gray-600">Ngày tạo:</span>
                    <span className="font-medium">
                      {new Date(ticket.createTime).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
                        ticket.status
                      )}`}
                    >
                      {getStatusText(ticket.status)}
                    </span>
                    {ticket.status === "RESOLVING" && (
                      <button
                        onClick={async () => {
                          try {
                            await updateTicketStatus(ticketId, "CLOSED");
                            fetchTicketData(); // Cập nhật lại dữ liệu ticket
                          } catch (error) {
                            console.error("Lỗi khi cập nhật trạng thái:", error);
                          }
                        }}
                        className="ml-2 px-2 py-1 bg-green-600 text-white rounded hover:bg-opacity-90"
                      >
                        Đóng đơn
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Nội dung khi��u nại ban đầu */}
              <div className="mb-6">
                <div className="font-medium mb-2">Tiêu đề:</div>
                <p className="text-gray-600 mb-2">{ticket.title}</p>
                <div className="font-medium mb-2">Nội dung:</div>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {ticket.content}
                </p>
              </div>

              {/* Hiển thị assets của ticket chính */}
              {ticket.assets && ticket.assets.length > 0 && (
                <div className="border rounded-lg mb-6">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h4 className="font-medium">Tệp đính kèm</h4>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      {ticket.assets.map((asset, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 border rounded"
                        >
                          {asset.type === "IMAGE" ? (
                            <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
                              <Image.PreviewGroup items={[asset.url]}>
                                <Image
                                  src={asset.url}
                                  alt="Ảnh đính kèm"
                                  className="object-cover w-full h-full"
                                  preview={{ mask: "Xem ảnh" }}
                                />
                              </Image.PreviewGroup>
                            </div>
                          ) : (
                            <>
                              <FontAwesomeIcon
                                icon={faDownload}
                                className="text-[#002278]"
                              />
                              <a
                                href={asset.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#002278] hover:underline truncate"
                                title="Tải xuống tệp đính kèm"
                              >
                                Tải tệp
                              </a>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Lịch sử trao đổi */}
              <div className="border rounded-lg mb-6">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h4 className="font-medium">Lịch sử trao đổi</h4>
                </div>
                <div className="p-4 max-h-[400px] overflow-y-auto">
                  {ticket.childTicket?.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-4 mb-4 ${
                        message.moderatorId ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <FontAwesomeIcon
                            icon={faUser}
                            className={
                              message.moderatorId
                                ? "text-blue-600"
                                : "text-gray-600"
                            }
                          />
                        </div>
                      </div>
                      <div
                        className={`flex-1 max-w-[70%] ${
                          message.moderatorId ? "text-right" : ""
                        }`}
                      >
                        <div className="font-medium mb-1">
                          {message.moderatorId
                            ? message.moderatorName
                            : message.fullName}
                        </div>
                        <div
                          className={`rounded-lg p-3 ${
                            message.moderatorId ? "bg-blue-50" : "bg-gray-100"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          {/* Hiển thị assets trong tin nhắn */}
                          {message.assets && message.assets.length > 0 && (
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              {message.assets.map((asset, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 p-2 border rounded bg-white"
                                >
                                  {asset.type === "IMAGE" ? (
                                    <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
                                      <Image.PreviewGroup items={[asset.url]}>
                                        <Image
                                          src={asset.url}
                                          alt="Ảnh đính kèm"
                                          className="object-cover w-full h-full"
                                          preview={{ mask: "Xem ảnh" }}
                                        />
                                      </Image.PreviewGroup>
                                    </div>
                                  ) : (
                                    <>
                                      <FontAwesomeIcon
                                        icon={faDownload}
                                        className="text-[#002278]"
                                      />
                                      <a
                                        href={asset.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#002278] hover:underline truncate"
                                        title="Tải xuống tệp đính kèm"
                                      >
                                        Tải tệp
                                      </a>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {new Date(message.createTime).toLocaleString("vi-VN")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Thêm button phản hồi - chỉ hiển thị khi status không phải CLOSED */}
              {ticket.status !== "CLOSED" && ticket.status !== "CANCELED" && ticket.status !== "RESOLVING" && (
                <button
                  onClick={handleReplyClick}
                  className="mb-6 px-4 py-2 bg-[#002278] text-white rounded-lg hover:bg-opacity-90"
                >
                  Phản hồi
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add ReplyTicketModal */}
      {showReplyModal && (
        <ReplyTicketModal
          ticketId={Number(ticketId)}
          onClose={handleReplyClose}
          onSuccess={handleReplySuccess}
        />
      )}

      {/* Modal hiển thị ảnh */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-end p-4">
              <button onClick={handleCloseImage} className="hover:opacity-80">
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>
            <div className="flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Ảnh đính kèm"
                className="max-w-full max-h-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TicketDetailModal;
