import React, { useEffect, useState } from "react";
import { Box, Truck, MapPin, FileText, CheckCircle, Home } from "lucide-react";
import ComButton from "../../../Components/ComButton/ComButton";
import { Breadcrumb, Popconfirm, Image } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseUser,
  faStore,
  faFile,
  faCopy,
  faTruck,
  faInfoCircle,
  faShoppingCart,
  faUser,
  faEnvelope,
  faPhone,
  faCalendar,
  faPlus,
  faFileLines,
  faHourglassHalf,
  faCheck,
  faInbox,
  faCog,
  faWarehouse,
  faBoxOpen,
  faTimesCircle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  getOrderById,
  updateOrder,
  updateOrderStatus,
} from "../../../api/order";
import { getAddressById } from "../../../api/address";
import CreateOrderDetailPopup from "./ServiceModal";
import { useNotification } from "../../../Notification/Notification";
import { message, Modal } from 'antd';

const STATUS_TO_ENUM = {
  "Đang chờ": "PENDING",
  "Đã hủy": "CANCELED",
  "Đã xác nhận": "APPROVED",
  "Đã nhận": "RECEIVED",
  "Đang xử lý": "PROCESSING",
  "Lưu trữ": "STORAGE",
  "Đang giao hàng": "SHIPPING",
  "Đã giao hàng": "DELIVERED",
  "Hoàn thành": "FINISHED",
  "Quá hạn nhận hàng": "ABANDONED",
};

const ENUM_TO_STATUS = {
  PENDING: "Đang chờ",
  CANCELED: "Đã hủy",
  APPROVED: "Đã xác nhận",
  RECEIVED: "Đã nhận",
  PROCESSING: "Đang xử lý",
  STORAGE: "Lưu trữ",
  SHIPPING: "Đang giao hàng",
  DELIVERED: "Đã giao hàng",
  FINISHED: "Hoàn thành",
  ABANDONED: "Quá hạn nhận hàng",
};

const getAvailableStatuses = (currentStatus) => {
  if (!currentStatus) return [];

  const statusEnum = STATUS_TO_ENUM[currentStatus] || currentStatus;

  switch (statusEnum) {
    case "PENDING":
      return [
        { value: "Đã xác nhận", className: "bg-green-50 text-green-700" },
        { value: "Đã hủy", className: "bg-red-50 text-red-700" },
      ];

    case "APPROVED":
      return [
        { value: "Đã nhận", className: "bg-green-50 text-green-700" },
        { value: "Đang xử lý", className: "bg-orange-50 text-orange-700" },
        { value: "Lưu trữ", className: "bg-gray-50 text-gray-700" },
        { value: "Đang giao hàng", className: "bg-yellow-50 text-yellow-700" },
        { value: "Đã giao hàng", className: "bg-green-50 text-green-700" },
        { value: "Hoàn thành", className: "bg-green-50 text-green-700" },
        { value: "Quá hạn nhận hàng", className: "bg-red-50 text-red-700" },
      ];

    case "RECEIVED":
      return [
        { value: "Đang xử lý", className: "bg-orange-50 text-orange-700" },
        { value: "Lưu trữ", className: "bg-gray-50 text-gray-700" },
        { value: "Đang giao hàng", className: "bg-yellow-50 text-yellow-700" },
        { value: "Đã giao hàng", className: "bg-green-50 text-green-700" },
        { value: "Hoàn thành", className: "bg-green-50 text-green-700" },
        { value: "Quá hạn nhận hàng", className: "bg-red-50 text-red-700" },
      ];

    case "PROCESSING":
      return [
        { value: "Lưu trữ", className: "bg-gray-50 text-gray-700" },
        { value: "Đang giao hàng", className: "bg-yellow-50 text-yellow-700" },
        { value: "Đã giao hàng", className: "bg-green-50 text-green-700" },
        { value: "Hoàn thành", className: "bg-green-50 text-green-700" },
        { value: "Quá hạn nhận hàng", className: "bg-red-50 text-red-700" },
      ];

    case "STORAGE":
      return [
        { value: "Đang giao hàng", className: "bg-yellow-50 text-yellow-700" },
        { value: "Đã giao hàng", className: "bg-green-50 text-green-700" },
        { value: "Hoàn thành", className: "bg-green-50 text-green-700" },
        { value: "Quá hạn nhận hàng", className: "bg-red-50 text-red-700" },
      ];
    case "SHIPPING":
      return [
        { value: "Đã giao hàng", className: "bg-green-50 text-green-700" },
        { value: "Hoàn thành", className: "bg-green-50 text-green-700" },
        { value: "Quá hạn nhận hàng", className: "bg-red-50 text-red-700" },
      ];

    case "DELIVERED":
      return [{ value: "Hoàn thành", className: "bg-green-50 text-green-700" }];

    case "ABANDONED":
      return [
        { value: "Lưu trữ", className: "bg-gray-50 text-gray-700" },
        { value: "Đang giao hàng", className: "bg-yellow-50 text-yellow-700" },
        { value: "Đã giao hàng", className: "bg-green-50 text-green-700" },
        { value: "Hoàn thành", className: "bg-green-50 text-green-700" },
      ];

    case "FINISHED":
      return [];

    case "CANCELED":
      return [];

    default:
      return [];
  }
};

// Thêm hàm kiểm tra thời gian
const checkOrderExpiration = (createTime, status) => {
  if (status === "PENDING") {
    const createdDate = new Date(createTime);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 7;
  }
  return false;
};

const UpdateOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [addressData, setAddressData] = useState(null);
  const [shippingCode, setShippingCode] = useState("");
  const [formData, setFormData] = useState({
    deliveredFee: 0,
    shippingCode: "",
    shippingUnit: "",
  });
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");
  const { notificationApi } = useNotification();
  const [statusHistory, setStatusHistory] = useState([]);
  const [newStatus, setNewStatus] = useState(null);

  const fetchOrderData = async () => {
    try {
      const data = await getOrderById(id);

      // Kiểm tra nếu đơn hàng đã quá 7 ngày và vẫn ở trạng thái PENDING
      if (checkOrderExpiration(data.createTime, data.status)) {
        // Tự động cập nhật trạng thái thành CANCELED
        await updateOrderStatus(id, "CANCELED");
        // Fetch lại dữ liệu sau khi cập nhật
        const updatedData = await getOrderById(id);
        setOrderData(updatedData);
        const displayStatus = ENUM_TO_STATUS[updatedData.status];
        setOrderStatus(displayStatus || updatedData.status);
        notificationApi(
          "info",
          "Thông báo",
          "Đơn hàng đã tự động hủy do quá 7 ngày không được xác nhận"
        );
      } else {
        setOrderData(data);
        const displayStatus = ENUM_TO_STATUS[data.status];
        setOrderStatus(displayStatus || data.status);
      }

      setFormData({
        deliveredFee: data.deliveredFee || 0,
        shippingCode: data.shippingCode || "",
        shippingUnit: data.shippingUnit || "",
      });

      if (data.addressId) {
        const address = await getAddressById(data.addressId);
        setAddressData(address);
      }

      const history = getStatusHistory(data);
      setStatusHistory(history);
    } catch (error) {
      notificationApi("error", "Lỗi", "Không thể tải dữ liệu đơn hàng");
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderData();
    }
  }, [id]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Lỗi khi sao chép: ", err);
    });
  };

  const handleUpdateOrder = async () => {
    Modal.confirm({
      title: "Xác nhận cập nhật",
      content: "Bạn có chắc chắn muốn cập nhật thông tin đơn hàng không?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      okButtonProps: {
        className: "bg-blue-500 hover:bg-blue-600 text-white",
      },
      async onOk() {
        try {
          const updatedOrderData = {
            ...orderData,
            deliveredFee: formData.deliveredFee,
            shippingCode: formData.shippingCode,
            shippingUnit: formData.shippingUnit,
            status: orderData.status,
          };

          await updateOrder(id, updatedOrderData);
          await fetchOrderData();

          message.success("Cập nhật đơn hàng thành công!");
          navigate("/owner/order", { state: { refresh: true } });
        } catch (error) {
          console.error("Lỗi cập nhật:", error);
          message.error("Có lỗi xảy ra khi cập nhật đơn hàng!");
        }
      },
    });
  };

  const handleButtonClick = () => {
    setIsPopupVisible(true);
  };

  const handleCancel = () => {
    setIsPopupVisible(false);
    setNewStatus(null);
  };

  const getStatusHistory = (data) => {
    const savedHistory = localStorage.getItem(`orderHistory_${id}`);
    let history = savedHistory ? JSON.parse(savedHistory) : [];

    if (history.length === 0) {
      history = [
        {
          status: "Đã tạo đơn hàng",
          icon: faFileLines,
          time: data.createTime,
          order: 1,
        },
      ];
    }

    const currentStatus = data.status;
    if (currentStatus) {
      const statusLabel = ENUM_TO_STATUS[currentStatus] || currentStatus;
      const lastStatus = history[history.length - 1];

      if (lastStatus.status !== statusLabel) {
        history.push({
          status: statusLabel,
          icon: getIconForStatus(statusLabel),
          time: data.updatedTime || new Date().toISOString(),
          order: history.length + 1,
        });
      }
    }

    const uniqueHistory = history.reduce((acc, current) => {
      const exists = acc.some((item) => item.status === current.status);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);

    const sortedHistory = uniqueHistory.sort(
      (a, b) => new Date(a.time) - new Date(b.time)
    );
    localStorage.setItem(`orderHistory_${id}`, JSON.stringify(sortedHistory));

    return sortedHistory;
  };

  const getIconForStatus = (status) => {
    const iconMap = {
      PENDING: faHourglassHalf,
      APPROVED: faCheck,
      RECEIVED: faInbox,
      PROCESSING: faCog,
      STORAGE: faWarehouse,
      SHIPPING: faTruck,
      DELIVERED: faBoxOpen,
      FINISHED: faCheckCircle,
      ABANDONED: faTimesCircle,
      CANCELED: faTimesCircle,
      // Map cho text tiếng Việt
      "Đã tạo đơn hàng": faFileLines,
      "Đang chờ": faHourglassHalf,
      "Đã xác nhận": faCheck,
      "Đã nhận": faInbox,
      "Đang xử lý": faCog,
      "Lưu trữ": faWarehouse,
      "Đang giao hàng": faTruck,
      "Đã giao hàng": faBoxOpen,
      "Hoàn thành": faCheckCircle,
      "Quá hạn nhận hàng": faTimesCircle,
      "Đã hủy": faTimesCircle,
    };

    return iconMap[status] || faFileLines;
  };

  const handleStatusChange = async (e) => {
    try {
      const selectedStatus = e.target.value;
      const statusEnum = STATUS_TO_ENUM[selectedStatus];

      if (!statusEnum) {
        notificationApi("error", "Lỗi", "Trạng thái không hợp lệ");
        return;
      }

      setNewStatus(selectedStatus);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Lỗi không xác định";
      notificationApi(
        "error",
        "Lỗi",
        `Không thể cập nhật trạng thái đơn hàng: ${errorMessage}`
      );
    }
  };

  const confirmStatusChange = async () => {
    try {
      const statusEnum = STATUS_TO_ENUM[newStatus];
      const response = await updateOrderStatus(id, statusEnum);

      if (response) {
        // Cập nhật orderData với status mới
        setOrderData((prev) => ({
          ...prev,
          status: statusEnum,
          updatedTime: new Date().toISOString(), // Thêm thời gian cập nhật mới
        }));

        setOrderStatus(newStatus);

        // Tạo một bản ghi lịch sử mới
        const newHistoryEntry = {
          status: newStatus,
          icon: getIconForStatus(newStatus),
          time: new Date().toISOString(),
          order: statusHistory.length + 1,
        };

        // Cập nhật statusHistory với bản ghi mới
        const updatedHistory = [...statusHistory, newHistoryEntry];
        setStatusHistory(updatedHistory);

        // Lưu vào localStorage
        localStorage.setItem(
          `orderHistory_${id}`,
          JSON.stringify(updatedHistory)
        );

        setNewStatus(null);

        notificationApi(
          "success",
          "Thành công",
          "Đã cập nhật trạng thái đơn hàng"
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Lỗi không xác định";
      notificationApi(
        "error",
        "Lỗi",
        `Không thể cập nhật trạng thái đơn hàng: ${errorMessage}`
      );
      setNewStatus(null);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!orderData) {
    return <div>Đang tải dữ liệu...</div>;
  }

  const orderDetails = orderData.orderDetails || [];

  const branchId = orderDetails.length > 0 ? orderDetails[0].branch.id : null;

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 px-4">
        <div>
          <h2 className="text-xl font-semibold text-blue-800">
            Cập nhật đơn hàng
          </h2>
          <Breadcrumb
            separator=">"
            items={[
              { title: "Cửa hàng" },
              { title: <Link to="/owner/order">Đơn hàng</Link> },
              { title: `Cập nhật đơn hàng` },
            ]}
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleUpdateOrder}
            className="bg-[#002278] hover:bg-blue-900 transition-colors duration-200 text-white px-6 py-2.5 rounded-md font-medium"
          >
            Cập nhật
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold">Service</h2>
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded">
                {orderDetails.length} dịch vụ
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="bg-[#002278] text-white w-10 h-10 flex items-center justify-center rounded-full"
                onClick={handleButtonClick}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>

          {/* Order Items */}
          <table className="w-full mb-6">
            <thead className="text-gray-500 text-sm">
              <tr>
                <th className="text-left py-2">Dịch vụ</th>
                <th className="text-right">Số lượng gói</th>
                <th className="text-right">Đơn giá</th>
                <th className="text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="py-3">
                    <div className="flex items-center">
                      <div className="w-24 h-24 flex items-center justify-center overflow-hidden mr-3">
                        {item.service.assetUrls &&
                        item.service.assetUrls.length > 0 ? (
                          <Image.PreviewGroup
                            preview={{
                              onChange: (current, prev) =>
                                console.log(
                                  `Switched from preview ${prev} to ${current}`
                                ),
                            }}
                          >
                            <Image
                              src={item.service.assetUrls[0].url} // Thay đổi ở đây
                              alt={item.service.name}
                              className="object-cover w-full h-full"
                              fallback="data:image/png;base64,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"
                              preview={{
                                mask: "Xem ảnh",
                                urls: item.service.assetUrls.map(
                                  (asset) => asset.url
                                ), // Thay đổi ở đây
                              }}
                            />
                          </Image.PreviewGroup>
                        ) : (
                          <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                      </div>
                      <span>{item.service.name}</span>
                    </div>
                  </td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">{item.price.toLocaleString()}đ</td>
                  <td className="text-right">
                    {(item.price * item.quantity).toLocaleString()}đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tổng tiền hàng</span>
              <span>{orderData.orderPrice?.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Phí giao hàng</span>
              <span>{orderData.deliveredFee?.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Tổng thanh toán</span>
              <span>{orderData.totalPrice?.toLocaleString()}₫</span>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4 text-xl flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-2">
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="text-blue-800"
                />
              </div>
              Thông tin chung
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-lg mb-2">
                  <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                  Trạng thái đơn hàng
                </p>
                {newStatus ? (
                  <Popconfirm
                    title="Xác nhận thay đổi trạng thái"
                    description={`Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng thành "${newStatus}" không?`}
                    onConfirm={confirmStatusChange}
                    onCancel={handleCancel}
                    okText="Đồng ý"
                    cancelText="Hủy"
                    okButtonProps={{
                      style: { backgroundColor: "#1890ff" },
                    }}
                    open={Boolean(newStatus)}
                  >
                    <select
                      value={newStatus || orderStatus}
                      onChange={handleStatusChange}
                      className="font-medium text-gray-900 w-full p-2 border rounded-md bg-white"
                    >
                      <option value={orderStatus}>
                        {ENUM_TO_STATUS[orderStatus] || orderStatus}
                      </option>
                      {getAvailableStatuses(orderStatus).map((status) => (
                        <option
                          key={status.value}
                          value={status.value}
                          className={status.className}
                        >
                          {status.value}
                        </option>
                      ))}
                    </select>
                  </Popconfirm>
                ) : (
                  <select
                    value={orderStatus}
                    onChange={handleStatusChange}
                    className="font-medium text-gray-900 w-full p-2 border rounded-md bg-white"
                  >
                    <option value={orderStatus}>
                      {ENUM_TO_STATUS[orderStatus] || orderStatus}
                    </option>
                    {getAvailableStatuses(orderStatus).map((status) => (
                      <option
                        key={status.value}
                        value={status.value}
                        className={status.className}
                      >
                        {status.value}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <p className="text-gray-500 text-lg mb-2">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Khách hàng
                </p>
                <p className="font-medium text-gray-900">
                  {orderData.fullName || "Không có thông tin khách hàng"}
                </p>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-lg">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                    Email
                  </p>
                  {orderData.email && (
                    <FontAwesomeIcon
                      icon={faCopy}
                      className="cursor-pointer"
                      onClick={() => handleCopy(orderData.email)}
                    />
                  )}
                </div>
                <p className="font-medium text-gray-900 ">
                  {orderData.email || "Không có thông tin email"}
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-lg">
                    <FontAwesomeIcon icon={faPhone} className="mr-2" />
                    Số điện thoại
                  </p>
                  {orderData.phone && (
                    <FontAwesomeIcon
                      icon={faCopy}
                      className="cursor-pointer"
                      onClick={() => handleCopy(orderData.phone)}
                    />
                  )}
                </div>
                <p className="font-medium text-gray-900">
                  {orderData.phone || "Không có thông tin số điện thoại"}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4 text-xl">Trạng thái đơn hàng</h3>
            <div className="space-y-4">
              {statusHistory.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <FontAwesomeIcon
                      icon={step.icon}
                      size="lg"
                      style={{ color: "#002278" }}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{step.status}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(step.time).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Address and Shipping Info */}
      <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-4">
        {/* Địa ch giao hàng */}
        <div className="flex items-start bg-white rounded-lg shadow p-4">
          <MapPin className="w-5 h-5 text-blue-600 mr-2" />
          <div>
            <h3 className="font-semibold text-blue-600 text-xl">
              Địa chỉ giao hàng
            </h3>
            <p className="text-black mt-3 text-lg">
              <FontAwesomeIcon icon={faHouseUser} className="mr-2" />
              Địa chỉ:
            </p>
            <p className="text-gray-600">
              {addressData
                ? `${addressData.address}, ${addressData.ward}, ${addressData.district}, ${addressData.province}`
                : "Lấy tại cửa hàng"}
            </p>
            <p className="text-black mt-2 text-lg">
              <FontAwesomeIcon icon={faStore} className="mr-2" />
              Chi nhánh:
            </p>
            <p className="text-gray-600">
              {orderDetails.length > 0
                ? orderDetails[0].branch.name
                : "Không có thông tin chi nhánh"}
            </p>
          </div>
        </div>

        {/* Thông tin vận chuyển */}
        <div className="flex items-start bg-white rounded-lg shadow p-4 w-full">
          <Truck className="w-5 h-5 text-blue-600 mr-2" />
          <div className="w-full">
            <h3 className="font-semibold text-blue-600 text-xl">Vận chuyển</h3>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  Phí giao hàng (VNĐ)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="deliveredFee"
                    value={formData.deliveredFee}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded pr-12"
                    min="0"
                    step="1000"
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    VNĐ
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Mã vận chuyển
                </label>
                <input
                  type="text"
                  name="shippingCode"
                  value={formData.shippingCode}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Đơn vị vận chuyển
                </label>
                <input
                  type="text"
                  name="shippingUnit"
                  value={formData.shippingUnit}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup */}
      <CreateOrderDetailPopup
        visible={isPopupVisible}
        onCancel={handleCancel}
        orderId={id}
        branchId={branchId}
        onServiceAdded={fetchOrderData}
      />
    </div>
  );
};

export default UpdateOrder;
