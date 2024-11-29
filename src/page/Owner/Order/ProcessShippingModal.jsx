import React, { useState, useEffect } from "react";
import { Modal, message, Steps } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox, // Icon mới cho trạng thái khác
  faCheckCircle, // Icon cho Đã lấy hàng
  faTruck, // Icon cho Đang giao hàng
  faShippingFast, // Icon mới cho trạng thái giao hàng nhanh
} from "@fortawesome/free-solid-svg-icons";
import { getOrderShipStatus } from "../../../api/order";

const ProcessShippingModal = ({ visible, onClose, shippingCode }) => {
  const [isShippingModalVisible, setIsShippingModalVisible] = useState(visible);
  const [shippingLogs, setShippingLogs] = useState([]);

  const translateStatus = (status) => {
    switch (status) {
      case "picking":
        return "Đang lấy hàng";
      case "picked":
        return "Đã lấy hàng";
      case "delivering":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour12: false,
    });
  };

  const handleShowShippingStatus = async () => {
    try {
      const data = await getOrderShipStatus(shippingCode);
      if (data.status === "success") {
        setShippingLogs(data.data.logs);
        setIsShippingModalVisible(true);
      } else {
        message.error("Không thể lấy trạng thái vận chuyển: " + data.message);
      }
    } catch (error) {
      console.error("Lỗi khi lấy trạng thái vận chuyển:", error);
      message.error(
        "Lỗi khi lấy trạng thái vận chuyển: " +
          (error.response?.data?.message || "Có lỗi xảy ra")
      );
    }
  };

  useEffect(() => {
    if (visible) {
      handleShowShippingStatus();
    }
  }, [visible]);

  const iconStyle = "w-6 h-6 text-[#002278]";

  return (
    <Modal
      title="Quá trình vận chuyển"
      visible={isShippingModalVisible}
      footer={null}
      onCancel={onClose}
      width={900} // Increase modal width
      closable={false} // Ẩn nút đóng
    >
      <div className="flex flex-col items-center p-4">
        <Steps
          current={shippingLogs.length}
          items={shippingLogs.map((log, index) => ({
            title: translateStatus(log.status),
            description: log.updatedDate ? formatDate(log.updatedDate) : "",
            icon: (
              <FontAwesomeIcon
                icon={
                  log.status === "picking"
                    ? faBox
                    : log.status === "picked"
                    ? faCheckCircle
                    : log.status === "delivering"
                    ? faTruck
                    : faShippingFast
                }
                className={`${iconStyle} ${log.updatedDate ? 'text-[#002278]' : 'text-gray-400'}`}
              />
            ),
          }))}
          className="w-full"
        />
        <button
          onClick={() => {
            onClose(); // Gọi hàm onClose
            setIsShippingModalVisible(false); // Đảm bảo modal được ẩn
          }}
          className="mt-4 bg-blue-800 text-white py-2 px-4 rounded"
        >
          Đóng
        </button>
      </div>
    </Modal>
  );
};

export default ProcessShippingModal;
