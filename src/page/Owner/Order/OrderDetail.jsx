import React, { useState, useEffect } from "react";
import { getOrderById } from "../../../api/order";
import { getAddressById } from "../../../api/address";
import { Box, Truck, MapPin, FileText, CheckCircle, Home } from "lucide-react";
import ComButton from "../../../Components/ComButton/ComButton";
import { Breadcrumb } from "antd";
import { Link, useParams } from "react-router-dom";
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

const OrderDetail = () => {
  const { id } = useParams();
  // console.log("Received id:", id);

  const [orderData, setOrderData] = useState(null);
  const [addressData, setAddressData] = useState(null);

  useEffect(() => {
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

    if (id) {
      fetchOrderData();
    } else {
      console.warn("id is null or undefined");
    }
  }, [id]);

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

  if (!orderData) {
    console.warn("orderData is null, rendering loading message");
    return <div>Đang tải dữ liệu...</div>;
  }

  const statusHistory = getStatusHistory(orderData);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Lỗi khi sao chép: ", err);
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 px-4">
        <div>
          <h2 className="text-xl font-semibold text-blue-800">
            Chi tiết đơn hàng
          </h2>
          <Breadcrumb
            separator=">"
            items={[
              { title: "Cửa hàng" },
              { title: <Link to="/owner/order">Đơn hàng</Link> },
              { title: `Chi tiết đơn hàng` },
            ]}
          />
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
                {orderData.orderDetails.length} dịch vụ
              </span>
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
              {orderData.orderDetails.map((item) => (
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
              <span>{orderData?.orderPrice?.toLocaleString() || "0"}đ</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Phí giao hàng</span>
              <span>{orderData?.deliveredFee?.toLocaleString() || "0"}đ</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Tổng thanh toán</span>
              <span>{orderData?.totalPrice?.toLocaleString() || "0"}đ</span>
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
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Khách hàng
                </p>
                <p className="font-medium text-gray-900">
                  {orderData?.fullName || "Không có thông tin khách hàng"}
                </p>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-lg">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                    Email
                  </p>
                  {orderData?.email && (
                    <FontAwesomeIcon
                      icon={faCopy}
                      className="cursor-pointer"
                      onClick={() => handleCopy(orderData.email)}
                    />
                  )}
                </div>
                <p className="font-medium text-gray-900 ">
                  {orderData?.email || "Không có thông tin email"}
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-lg">
                    <FontAwesomeIcon icon={faPhone} className="mr-2" />
                    Số điện thoại
                  </p>
                  {orderData?.phone && (
                    <FontAwesomeIcon
                      icon={faCopy}
                      className="cursor-pointer"
                      onClick={() => handleCopy(orderData.phone)}
                    />
                  )}
                </div>
                <p className="font-medium text-gray-900">
                  {orderData?.phone || "Không có thông tin số điện thoại"}
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
              {orderData.orderDetails.length > 0
                ? orderData.orderDetails[0].branch.name
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
    </div>
  );
};

export default OrderDetail;
