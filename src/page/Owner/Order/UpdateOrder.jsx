import React, { useEffect, useState } from "react";
import { Box, Truck, MapPin, FileText, CheckCircle, Home } from "lucide-react";
import ComButton from "../../../Components/ComButton/ComButton";
import { Breadcrumb } from "antd";
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
  faFileAlt,
  faHourglassHalf,
  faCheck,
  faInbox,
  faCog,
  faWarehouse,
  faBoxOpen,
  faTimesCircle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { getOrderById, updateOrder, updateOrderStatus } from "../../../api/order";
import { getAddressById } from "../../../api/address";
import CreateOrderDetailPopup from "./ServiceModal";
import { useNotification } from "../../../Notification/Notification";

const STATUS_MAPPING = {
  "Đã hủy": "CANCELED",
  "Đang chờ": "PENDING",
  "Đã xác nhận": "APPROVED",
  "Đã nhận": "RECIEVED",
  "Đang xử lý": "PROCESSING",
  "Lưu trữ": "STORAGE",
  "Đang giao hàng": "SHIPPING",
  "Đã giao": "DELIVERIED",
  "Hoàn thành": "FINISHED",
  "Quá hạn nhận hàng": "ABANDONED"
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
  const [orderStatus, setOrderStatus] = useState(orderData?.status || "");
  const { notificationApi } = useNotification();

  const fetchOrderData = async () => {
    try {
      console.log("Fetching order data for id:", id);
      const data = await getOrderById(id);
      console.log("Order data:", data);
      setOrderData(data);

      if (data.addressId) {
        const address = await getAddressById(data.addressId);
        console.log("Address data:", address);
        setAddressData(address);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu đơn hàng: ", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderData();
    } else {
      console.warn("id is null or undefined");
    }
  }, [id]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Lỗi khi sao chép: ", err);
    });
  };

  const handleUpdateOrder = async () => {
    try {
      const updatedOrderData = {
        ...orderData,
        shippingCode,
        status: orderStatus,
      };

      const response = await updateOrder(id, updatedOrderData);
      console.log("Order updated successfully:", response);
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn hàng:", error);
    }
  };

  const handleButtonClick = () => {
    setIsPopupVisible(true);
  };

  const handleCancel = () => {
    setIsPopupVisible(false);
  };

  const getStatusHistory = (data) => {
    const statusMap = {
      createTime: { label: "Đã tạo đơn hàng", icon: faFileAlt },
      pendingTime: { label: "Đang chờ xử lý", icon: faHourglassHalf },
      approvedTime: { label: "Đã duyệt", icon: faCheck },
      revievedTime: { label: "Đã nhận", icon: faInbox },
      processingTime: { label: "Đang xử lý", icon: faCog },
      storagedTime: { label: "Đã lưu kho", icon: faWarehouse },
      shippingTime: { label: "Đang giao hàng", icon: faTruck },
      deliveredTime: { label: "Đã giao hàng", icon: faBoxOpen },
      finishedTime: { label: "Hoàn thành", icon: faCheckCircle },
      abandonedTime: { label: "Đã hủy", icon: faTimesCircle },
    };

    return Object.entries(statusMap)
      .map(([key, { label, icon }]) => ({
        status: label,
        icon: icon,
        time: data[key],
      }))
      .filter((item) => item.time !== null)
      .sort((a, b) => new Date(a.time) - new Date(b.time));
  };

  const handleStatusChange = async (e) => {
    try {
      const newStatus = STATUS_MAPPING[e.target.value];
      await updateOrderStatus(id, newStatus);
      setOrderStatus(e.target.value);
      notificationApi("success", "Thành công", "Đã cập nhật trạng thái đơn hàng");
      await fetchOrderData();
    } catch (error) {
      notificationApi("error", "Lỗi", "Không thể cập nhật trạng thái đơn hàng");
    }
  };

  if (!orderData) {
    return <div>Đang tải dữ liệu...</div>;
  }

  const orderDetails = orderData.orderDetails || [];

  const statusHistory = getStatusHistory(orderData);

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
            className="bg-[#002278] text-white px-4 py-2 rounded"
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
                      <img
                        src={item.service.assetUrls[0] || "default-image-url"}
                        alt=""
                        className="w-10 h-10 rounded mr-3"
                      />
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
                <select
                  value={orderStatus}
                  onChange={handleStatusChange}
                  className="font-medium text-gray-900 w-full p-2 border rounded-md bg-white"
                >
                  <option value="Đang xử lý" className="bg-orange-50 text-orange-700">
                    Đang xử lý
                  </option>
                  <option value="Đang chờ" className="bg-blue-50 text-blue-700">
                    Đang chờ
                  </option>
                  <option value="Đã xác nhận" className="bg-teal-50 text-teal-700">
                    Đã xác nhận
                  </option>
                  <option value="Đã nhận" className="bg-green-50 text-green-700">
                    Đã nhận
                  </option>
                  <option value="Đang giao hàng" className="bg-yellow-50 text-yellow-700">
                    Đang giao hàng
                  </option>
                  <option value="Đã giao" className="bg-green-50 text-green-700">
                    Đã giao
                  </option>
                  <option value="Hoàn thành" className="bg-green-50 text-green-700">
                    Hoàn thành
                  </option>
                  <option value="Đã hủy" className="bg-red-50 text-red-700">
                    Đã hủy
                  </option>
                  <option value="Lưu trữ" className="bg-gray-50 text-gray-700">
                    Lưu trữ
                  </option>
                  <option value="Quá hạn nhận hàng" className="bg-purple-50 text-purple-700">
                    Quá hạn nhận hàng
                  </option>
                </select>
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
        {/* Địa chỉ giao hàng */}
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
          <div>
            <h3 className="font-semibold text-blue-600 text-xl">Vận chuyển</h3>
            <div className="flex justify-between items-center text-black mt-3 text-lg">
              <div>
                <FontAwesomeIcon icon={faFile} className="mr-2" />
                Mã vận chuyển:
              </div>
              {orderData?.shippingCode && (
                <FontAwesomeIcon
                  icon={faCopy}
                  className="cursor-pointer"
                  onClick={() => handleCopy(orderData.shippingCode)}
                />
              )}
            </div>
            <p className="text-gray-600">
              {orderData?.shippingCode || "Không có mã vận chuyển"}
            </p>
            <p className="text-black mt-2 text-lg">
              <FontAwesomeIcon icon={faTruck} className="mr-2" />
              Đơn vị vận chuyển:
            </p>
            <p className="text-gray-600">
              {orderData?.shippingUnit || "Không có đơn vị vận chuyển"}
            </p>
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
