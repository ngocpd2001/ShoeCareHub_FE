import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  notification,
  Breadcrumb,
  Select,
  Form,
  Input,
  Upload,
  Image,
  Modal,
} from "antd";
import {
  getTicketById,
  updateTicketStatus,
  createChildTicket,
  notifyCustomerForTicket,
} from "../../../api/ticket";
import { UploadOutlined } from "@ant-design/icons";
import { firebaseImgs } from "../../../upImgFirebase/firebaseImgs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

// Thêm hàm formatDate
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

// Thêm object để map status từ tiếng Anh sang tiếng Việt
const STATUS_DISPLAY = {
  OPENING: "Đang mở",
  PROCESSING: "Đang xử lý",
  CLOSED: "Đóng",
};

// Sử dụng trực tiếp STATUS_DISPLAY trong component
const UpdateTicket_Mod = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ticketDetails, setTicketDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [userId, setUserId] = useState(null);

  // Sửa lại statusOptions để hiển thị tiếng Việt
  const statusOptions = [
    { value: "OPENING", label: STATUS_DISPLAY["OPENING"] },
    { value: "PROCESSING", label: STATUS_DISPLAY["PROCESSING"] },
    { value: "CLOSED", label: STATUS_DISPLAY["CLOSED"] },
  ];

  const handleStatusChange = async (newStatus) => {
    Modal.confirm({
      title: "Xác nhận thay đổi",
      content: `Bạn có chắc chắn muốn thay đổi trạng thái thành "${STATUS_DISPLAY[newStatus]}"?`,
      okText: "Đồng ý",
      cancelText: "Hủy bỏ",
      onOk: async () => {
        try {
          setLoading(true);
          await updateTicketStatus(id, newStatus);

          notification.success({
            message: "Thành công",
            description: "Cập nhật trạng thái thành công",
          });

          // Refresh data
          const response = await getTicketById(id);
          setTicketDetails(response.data);
        } catch (error) {
          console.error("Error details:", error);
          notification.error({
            message: "Lỗi",
            description:
              error.response?.data?.message || "Không thể cập nhật trạng thái",
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Thêm useEffect để fetch dữ liệu
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
          // console.log("API Response:", response);

          if (response && response.data) {
            setTicketDetails(response.data);
            setUserId(response.data.userId);
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

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);

      let assets = [];
      const files = attachments
        .filter((att) => att.file)
        .map((att) => att.file);

      if (files.length > 0) {
        const uploadedUrls = await firebaseImgs(files);
        assets = uploadedUrls.map((url) => ({
          url: url,
          type: url.includes("mp4") ? "VIDEO" : "IMAGE",
        }));
      }

      const requestData = {
        title: ticketDetails.title,
        content: values.content,
        assets: assets,
      };

      await createChildTicket(id, requestData);

      notification.success({
        message: "Thành công",
        description: "Đã thêm phản hồi mới",
      });

      // Refresh data
      const response = await getTicketById(id);
      setTicketDetails(response.data);

      // Reset form và attachments
      form.resetFields();
      setAttachments([]);
    } catch (error) {
      console.error("Submit error:", error);
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể thêm phản hồi",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  // Hiển thị status trong tiếng Việt
  const displayStatus = (status) => {
    return STATUS_DISPLAY[status] || status;
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/quicktime",
    ];

    const validFiles = files.filter(
      (file) =>
        allowedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      notification.warning({
        message: "Cảnh báo",
        description:
          "Chỉ chấp nhận file ảnh (JPG, PNG, GIF) hoặc video (MP4, MOV) và dung lượng dưới 10MB",
      });
    }

    const newAttachments = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "IMAGE" : "VIDEO",
      file: file,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Thêm hàm xử lý thông báo
  const handleNotifyCustomer = async () => {
    console.log("Bắt đầu gửi thông báo cho khách hàng");
    try {
      if (!userId) {
        notification.error({
          message: "Lỗi",
          description: "Không tìm thấy thông tin người dùng",
          duration: 3,
        });
        return;
      }

      console.log("Gửi thông báo cho khách hàng với accountId:", userId, "và ticketId:", ticketDetails.id);

      await notifyCustomerForTicket(userId, ticketDetails.id);
      notification.success({
        message: "Thành công",
        description: "Đã gửi thông báo cho khách hàng",
        duration: 3,
      });
    } catch (error) {
      console.error("Lỗi khi gửi thông báo:", error);
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể gửi thông báo cho khách hàng",
        duration: 3,
      });
    }
  };

  if (!ticketDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center pb-4 px-4">
        <div>
          <h2 className="text-xl font-semibold text-blue-800">
            Cập nhật khiếu nại
          </h2>
          <Breadcrumb
            separator=">"
            items={[
              { title: "Cửa hàng" },
              { title: <Link to="/moderator/ticket">Khiếu nại</Link> },
              {
                title: (
                  <span className="text-[#002278]">Cập nhật khiếu nại</span>
                ),
              },
            ]}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
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
            <div className="flex items-center gap-2">
              <Select
                value={ticketDetails.status}
                onChange={handleStatusChange}
                options={statusOptions}
                loading={loading}
                disabled={loading}
                style={{ width: 150 }}
              />
              {ticketDetails.status === "PROCESSING" && (
                <button
                  onClick={handleNotifyCustomer}
                  className="ml-2 px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1"
                >
                  <FontAwesomeIcon icon={faBell} className="text-sm" />
                  <span>Thông báo khách hàng</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <h3 className="font-medium mb-2">Tiêu đề:</h3>
            <p className="bg-gray-50 p-3 rounded">{ticketDetails.title}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Nội dung:</h3>
            <p className="bg-gray-50 p-3 rounded whitespace-pre-wrap">
              {ticketDetails.content}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-4">Ảnh đính kèm:</h3>
          <div className="flex gap-4 flex-wrap">
            {ticketDetails.assets &&
              ticketDetails.assets.map((asset, index) => (
                <div key={index} className="w-[200px]">
                  <Image.PreviewGroup>
                    <Image
                      src={asset.url}
                      alt={`Ảnh ${index + 1}`}
                      className="w-full h-auto rounded border"
                    />
                  </Image.PreviewGroup>
                </div>
              ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-4">Lịch sử trao đổi</h3>
          <div className="bg-gray-50 p-4 rounded space-y-4">
            {/* Main ticket */}
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-800">
                  {ticketDetails.fullName?.charAt(0) || "U"}
                </span>
              </div>
              <div className="flex-1">
                <div className="font-medium">{ticketDetails.fullName}</div>
                <p className="text-gray-600 mb-2">{ticketDetails.content}</p>
                {ticketDetails.assets && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {ticketDetails.assets.map((asset, index) => (
                      <div key={index} className="w-[150px]">
                        <Image.PreviewGroup>
                          <Image
                            src={asset.url}
                            alt={`Ảnh ${index + 1}`}
                            className="w-full h-[150px] object-cover rounded border"
                          />
                        </Image.PreviewGroup>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-sm text-gray-500">
                  {formatDate(ticketDetails.createTime)}
                </div>
              </div>
            </div>

            {/* Child tickets as conversation history */}
            {ticketDetails.childTicket &&
              ticketDetails.childTicket.map((reply, index) => (
                <div key={index} className="flex gap-3 border-t pt-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-800">
                      {reply.fullName?.charAt(0) || "A"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {reply.fullName || "Admin"}
                    </div>
                    <p className="text-gray-600 mb-2 text-lg">
                      {reply.content}
                    </p>
                    {reply.assets && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {reply.assets
                          .filter(
                            (asset) => asset.isImage || asset.type === "IMAGE"
                          )
                          .map((asset, assetIndex) => (
                            <div key={assetIndex} className="w-[150px]">
                              <Image.PreviewGroup>
                                <Image
                                  src={asset.url}
                                  alt={`Ảnh phản hồi ${index + 1}-${
                                    assetIndex + 1
                                  }`}
                                  className="w-full h-[150px] object-cover rounded border"
                                />
                              </Image.PreviewGroup>
                            </div>
                          ))}
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      {formatDate(reply.createTime)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Modal xem ảnh */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
            onClick={handleCloseImage}
          >
            <div className="relative max-w-[90%] max-h-[90vh]">
              <img
                src={selectedImage}
                alt="Ảnh lớn"
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}

        {/* Form phản hồi mới */}
        <div className="mb-6 border-t pt-6">
          <h3 className="font-medium mb-4">Thêm phản hồi</h3>
          {ticketDetails.status === "CLOSED" ? (
            <div className="bg-gray-100 p-4 rounded text-gray-600 text-center">
              Phiếu hỗ trợ đã đóng. Không thể thêm phản hồi mới.
            </div>
          ) : (
            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              initialValues={{
                parentTicketId: parseInt(id),
                title: ticketDetails?.title || "",
              }}
            >
              {/* Hidden fields */}
              <Form.Item name="parentTicketId" hidden>
                <Input />
              </Form.Item>

              <Form.Item name="title" hidden>
                <Input />
              </Form.Item>

              {/* Content field */}
              <Form.Item
                label="Nội dung phản hồi"
                name="content"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập nội dung phản hồi",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Nhập nội dung phản hồi..."
                  maxLength={undefined}
                  showCount={false}
                  autoSize={{ minRows: 4, maxRows: 10 }}
                />
              </Form.Item>

              {/* Assets field */}
              <Form.Item label="Ảnh đính kèm" name="assets">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <label className="text-[#002278] border border-[#002278] px-4 py-2 rounded-md hover:bg-[#002278] hover:text-white flex items-center gap-2 cursor-pointer relative">
                      <UploadOutlined />
                      <span>Tải ảnh lên</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                        className="hidden [&::file-selector-button]:hidden absolute w-0 p-0 border-0 text-transparent"
                      />
                    </label>
                  </div>

                  {/* Preview Attachments */}
                  {attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h3 className="text-sm font-medium text-gray-700">
                        Ảnh đính kèm:
                      </h3>
                      <div className="flex flex-wrap gap-4">
                        {attachments.map((attachment, index) => (
                          <div key={index} className="relative group w-24 h-24">
                            {attachment.type === "IMAGE" ? (
                              <Image
                                src={attachment.url}
                                alt={`Attachment ${index + 1}`}
                                className="max-w-[200px] max-h-[200px] w-auto h-auto object-contain rounded-lg"
                              />
                            ) : (
                              <video
                                src={attachment.url}
                                className="max-w-[200px] max-h-[200px] w-auto h-auto object-contain rounded-lg"
                                controls
                              />
                            )}
                            <button
                              onClick={() => removeAttachment(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-600"
                            >
                              X
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Form.Item>

              <div className="flex justify-center gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/moderator/ticket")}
                  className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 disabled:opacity-50"
                >
                  {submitting ? "Đang gửi..." : "Gửi phản hồi"}
                </button>
              </div>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateTicket_Mod;
