import React, { useEffect, useState } from "react";
import {
  Box,
  Truck,
  MapPin,
  FileText,
  CheckCircle,
  Home,
} from "lucide-react";
import ComButton from "../../../Components/ComButton/ComButton";
import { Breadcrumb } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseUser, faStore, faFile, faCopy, faTruck, faInfoCircle, faShoppingCart, faUser, faEnvelope, faPhone, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { getOrderDetailsByOrderId } from "../../../api/order";
import { getAddressByAccountId } from "../../../api/user";

const OrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  // console.log("Order ID:", id);
  const [orderData, setOrderData] = useState({});
  const [serviceCount, setServiceCount] = useState(0);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const orderDetailsResponse = await getOrderDetailsByOrderId(id);
        console.log("Order Details Response:", orderDetailsResponse);

        const orderData = orderDetailsResponse.data[0].order;
        const branchName = orderDetailsResponse.data[0].branch.name;

        setOrderData({
          ...orderData,
          data: orderDetailsResponse.data,
          branchName: branchName,
        });

        const addressId = orderData.addressId;

        const addressResponse = await getAddressByAccountId(orderData.accountId);

        if (addressResponse && addressResponse.status === "success" && Array.isArray(addressResponse.data)) {
          const address = addressResponse.data.find(addr => addr.id === addressId);

          setOrderData(prevData => ({
            ...prevData,
            address: address ? address.address : "Không có thông tin địa chỉ",
          }));
        } else {
          console.error("Dữ liệu địa chỉ không hợp lệ hoặc không có dữ liệu:", addressResponse);
        }
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };

    fetchOrderData();
  }, [id]);


  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).catch(err => {
      console.error('Lỗi khi sao chép: ', err);
    });
  };

  // Giả sử bạn có một mảng các bước trạng thái trong orderData
  const timelineSteps = orderData.statusHistory || []; // Sử dụng statusHistory hoặc một trường tương tự từ orderData

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
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold">Service</h2>
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded">
                {orderData.data?.length || 0} dịch vụ
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  orderData.status === "Đang xử lý"
                    ? "bg-orange-100 text-orange-600"
                    : orderData.status === "Đang chờ"
                    ? "bg-blue-100 text-blue-600"
                    : orderData.status === "Hoàn thành"
                    ? "bg-green-100 text-green-600"
                    : orderData.status === "Đã hủy"
                    ? "bg-red-100 text-red-600"
                    : orderData.status === "Lưu trữ"
                    ? "bg-gray-100 text-gray-600"
                    : orderData.status === "Đang giao hàng"
                    ? "bg-yellow-100 text-yellow-600"
                    : orderData.status === "Quá hạn nhận hàng"
                    ? "bg-purple-100 text-purple-600"
                    : orderData.status === "Đã xác nhận"
                    ? "bg-teal-100 text-teal-600"
                    : ""
                }`}
              >
                {orderData.status || "Không có thông tin trạng thái"}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <table className="w-full mb-6">
            <thead className="text-gray-500 text-sm">
              <tr>
                <th className="text-left py-2">Dịch vụ</th>
                {/* <th className="text-left">Mã đơn hàng</th> */}
                <th className="text-right">Số lượng gói</th>
                <th className="text-right">Đơn giá</th>
                <th className="text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {orderData.data?.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="py-3">
                    <div className="flex items-center">
                      <img
                        src={item.service.assetUrls[0] || 'default-image-url'}
                        alt=""
                        className="w-10 h-10 rounded mr-3"
                      />
                      <span>{item.service.name}</span>
                    </div>
                  </td>
                  {/* <td>{item.orderId}</td> */}
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">
                    {item.price.toLocaleString()}đ
                  </td>
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
              <span>
                {orderData.orderPrice?.toLocaleString()}đ
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Phí giao hàng</span>
              <span>{orderData.deliveredFee?.toLocaleString()}đ</span>
            </div>
            {/* <div className="flex justify-between mb-2">
              <span className="text-gray-600">VAT</span>
              <span>{orderData.vat?.toLocaleString() || '0'}đ</span>
            </div> */}
            <div className="flex justify-between font-semibold">
              <span>Tổng thanh toán</span>
              <span>{orderData.totalPrice?.toLocaleString()}đ</span>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4 text-xl flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-2">
                <FontAwesomeIcon icon={faInfoCircle} className="text-blue-800" />
              </div>
              Thông tin chung
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-lg mb-2">
                  <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                  Trạng thái đơn hàng
                </p>
                {/* <p className="font-medium w-full p-2 border rounded-md">
                  {orderData.status || "Không có thông tin trạng thái"}
                </p> */}
                                <span
                  className={`font-medium text-gray-900 w-full p-2 border rounded-md ${
                    orderData.status === "Đang xử lý"
                      ? "bg-orange-100 text-orange-600"
                      : orderData.status === "Đang chờ"
                      ? "bg-blue-100 text-blue-600"
                      : orderData.status === "Hoàn thành"
                      ? "bg-green-100 text-green-600"
                      : orderData.status === "Đã hủy"
                      ? "bg-red-100 text-red-600"
                      : orderData.status === "Lưu trữ"
                      ? "bg-gray-100 text-gray-600"
                      : orderData.status === "Đang giao hàng"
                      ? "bg-yellow-100 text-yellow-600"
                      : orderData.status === "Quá hạn nhận hàng"
                      ? "bg-purple-100 text-purple-600"
                      : orderData.status === "Đã xác nhận"
                      ? "bg-teal-100 text-teal-600"
                      : ""
                  }`}
                >
                  {orderData.status || "Không có thông tin trạng thái"}
                </span>
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
              {timelineSteps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                    <step.icon size={20} />
                  </div>
                  <div>
                    <p className="font-medium">{step.status}</p>
                    <p className="text-sm text-gray-500">Mô tả trạng thái</p>
                    <p className="text-sm text-gray-500">{step.time}</p>
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
            <h3 className="font-semibold text-blue-600 text-xl">Địa chỉ giao hàng</h3>
            <p className="text-black mt-3 text-lg">
              <FontAwesomeIcon icon={faHouseUser} className="mr-2" />
              Địa chỉ:
            </p>
            <p className="text-gray-600">
              {orderData.address 
                ? `${orderData.address}, ${orderData.ward}, ${orderData.district}, ${orderData.province}`
                : "Không có thông tin địa chỉ"}
            </p>
            <p className="text-black mt-2 text-lg">
              <FontAwesomeIcon icon={faStore} className="mr-2" />
              Chi nhánh:
            </p>
            <p className="text-gray-600">
              {orderData.branchName || "Không có thông tin chi nhánh"}
            </p>
            {/* Thêm thông tin bổ sung nếu cần */}
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
                Mã vận chuyểm:
              </div>
              <FontAwesomeIcon 
                icon={faCopy} 
                className="cursor-pointer" 
                onClick={() => handleCopy(orderData.shippingCode)} 
              />
            </div>
            <p className="text-gray-600">
              {orderData.shippingCode}
            </p>
            <p className="text-black mt-2 text-lg">
              <FontAwesomeIcon icon={faTruck} className="mr-2" />
              Đơn vị vận chuyển:
            </p>
            <p className="text-gray-600">
              {orderData.shippingUnit}
            </p>
            {/* Thêm thông tin bổ sung nếu cần */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
