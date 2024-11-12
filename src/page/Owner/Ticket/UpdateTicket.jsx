import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { notification, Breadcrumb, Select, Form, Input, Upload } from "antd";
import {
  getTicketById,
  updateTicketStatus,
  createChildTicket,
} from "../../../api/ticket";
import { UploadOutlined } from "@ant-design/icons";

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
  'OPENING': 'Đang mở',
  'PROCESSING': 'Đang xử lý',
  'CLOSED': 'Đã đóng'
};

// Sử dụng trực tiếp STATUS_DISPLAY trong component
const UpdateTicket = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ticketDetails, setTicketDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // Sửa lại statusOptions để hiển thị tiếng Việt
  const statusOptions = [
    { value: 'OPENING', label: STATUS_DISPLAY['OPENING'] },
    { value: 'PROCESSING', label: STATUS_DISPLAY['PROCESSING'] },
    { value: 'CLOSED', label: STATUS_DISPLAY['CLOSED'] }
  ];

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      await updateTicketStatus(id, newStatus);
      
      notification.success({
        message: "Thành công",
        description: "Cập nhật trạng thái thành công",
      });

      // Refresh data sau khi cập nhật
      const response = await getTicketById(id);
      setTicketDetails(response.data);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể cập nhật trạng thái",
      });
    } finally {
      setLoading(false);
    }
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

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);

      // Xử lý files upload
      const assets = fileList.map((file) => ({
        url: file.response?.url || file.url,
        type: file.type?.startsWith("image") ? "IMAGE" : "FILE",
      }));

      const requestData = {
        parentTicketId: parseInt(id), // Chuyển id sang number
        title: ticketDetails.title, // Sử dụng title của ticket gốc
        content: values.content,
        assets: assets,
      };

      console.log("Request data:", requestData); // Log để debug

      await createChildTicket(requestData);

      notification.success({
        message: "Thành công",
        description: "Đã thêm phản hồi mới",
      });

      // Refresh data
      const response = await getTicketById(id);
      setTicketDetails(response.data);

      // Reset form
      form.resetFields();
      setFileList([]);
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
              { title: <Link to="/owner/ticket">Khiếu nại</Link> },
              { title: "Cập nhật khiếu nại" },
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
            <Select
              value={ticketDetails.status}
              onChange={handleStatusChange}
              options={statusOptions}
              loading={loading}
              disabled={loading}
              style={{ width: 150 }}
            />
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
              {ticketDetails.description}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-4">Tệp đính kèm:</h3>
          <div className="flex gap-4 flex-wrap">
            {ticketDetails.assets &&
              ticketDetails.assets
                .filter((asset) => asset.isImage || asset.type === "IMAGE")
                .map((asset, index) => (
                  <div key={index} className="w-[200px]">
                    <img
                      src={asset.url}
                      alt={`Ảnh ${index + 1}`}
                      className="w-full h-auto rounded border cursor-pointer"
                      onClick={() => handleImageClick(asset.url)}
                    />
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
                <p className="text-gray-600 mb-2">
                  {ticketDetails.description}
                </p>
                {ticketDetails.assets &&
                  ticketDetails.assets
                    .filter((asset) => asset.isImage || asset.type === "IMAGE")
                    .map((asset, index) => (
                      <div key={index} className="mb-2">
                        <img
                          src={asset.url}
                          alt={`Ảnh ${index + 1}`}
                          className="max-w-[200px] rounded border"
                        />
                      </div>
                    ))}
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
                    <p className="text-gray-600 mb-2">{reply.description}</p>
                    {reply.assets &&
                      reply.assets
                        .filter(
                          (asset) => asset.isImage || asset.type === "IMAGE"
                        )
                        .map((asset, assetIndex) => (
                          <div key={assetIndex} className="mb-2">
                            <img
                              src={asset.url}
                              alt={`nh phản hồi ${index + 1}-${
                                assetIndex + 1
                              }`}
                              className="max-w-[200px] rounded border"
                            />
                          </div>
                        ))}
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
                { required: true, message: "Vui lòng nhập nội dung phản hồi" },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Nhập nội dung phản hồi..."
              />
            </Form.Item>

            {/* Assets field */}
            <Form.Item label="Tệp đính kèm" name="assets">
              <Upload
                listType="picture"
                fileList={fileList}
                onChange={({ fileList }) => {
                  setFileList(fileList);
                  // Cập nhật form field assets
                  const assets = fileList.map((file) => ({
                    url: file.response?.url || file.url,
                    type: file.type?.startsWith("image") ? "IMAGE" : "FILE",
                  }));
                  form.setFieldValue("assets", assets);
                }}
                multiple
              >
                <button
                  type="button"
                  className="flex items-center px-4 py-2 border rounded"
                >
                  <UploadOutlined className="mr-2" />
                  Tải lên tệp đính kèm
                </button>
              </Upload>
            </Form.Item>

            <div className="flex justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate("/owner/ticket")}
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
        </div>
      </div>
    </div>
  );
};

export default UpdateTicket;
