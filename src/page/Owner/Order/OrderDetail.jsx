import React, { useEffect } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseUser, faStore, faFile, faCopy, faTruck, faInfoCircle, faShoppingCart, faUser, faEnvelope, faPhone, faCalendar } from '@fortawesome/free-solid-svg-icons';

const OrderDetail = () => {
  const navigate = useNavigate();

  const [orderData, setOrderData] = React.useState({
    orderId: "#20192",
    status: "Hoàn thành",
    date: "13/10/2023, 14:00",
    customer: {
      name: "Nguyễn Minh Lan",
      email: "minlan.nguyen@email.com",
      phone: "0904444789",
    },
    items: [
      {
        id: "202011",
        name: "Vé sinh chuyên sâu",
        quantity: 1,
        price: 50000,
        total: 50000,
        image: "/api/placeholder/40/40",
      },
      {
        id: "302011",
        name: "Vệ sinh đặc biệt",
        quantity: 2,
        price: 100000,
        total: 200000,
        image: "/api/placeholder/40/40",
      },
    ],
    shipping: 25000,
    total: 275000,
    address: "227 Thống Nhất, Đường Bình Tân Bì, Thuận An, Thủ Đức",
    deliveryCode: "SHPI909231",
    shippingUnit: "Grab",
    vat: 0,
    branch: {
      id: "BR001",
      name: "Chi nhánh Thủ Đức",
      address: "123 Đường ABC, Thủ Đức, TP.HCM",
      phone: "0901234567",
    },
  });

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/orders/${orderData.orderId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setOrderData(data);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };

    fetchOrderDetail();
  }, [orderData.orderId]);

  const timelineSteps = [
    { status: "Đã đặt hàng", time: "12/10/2023, 07:30", icon: FileText },
    { status: "Xử lý", time: "20/04/YY, 08:30", icon: CheckCircle },
    { status: "Đã đưa vào kho", time: "20/04/YY, 09:30", icon: Home },
    { status: "Vận chuyển", time: "20/04/YY, 10:30", icon: Truck },
    { status: "Đã giao hàng", time: "20/04/YY, 11:30", icon: Box },
  ];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).catch(err => {
      console.error('Lỗi khi sao chép: ', err);
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 px-4">
        <div>
          <h2 className="text-xl font-semibold text-blue-800">
            Đơn hàng {orderData.orderId}
          </h2>
          <Breadcrumb
            separator=">"
            items={[
              { title: "Cửa hàng" },
              { title: <Link to="/owner/order">Đơn hàng</Link> },
              { title: `Đơn hàng ${orderData.orderId}` },
            ]}
          />
        </div>
        <div className="ml-auto">
          <ComButton className="bg-blue-800 text-white px-4 py-2 rounded flex items-center" onClick={() => navigate("/owner/order/create")}>
            <FontAwesomeIcon icon={faFile} className="mr-2 text-lg" />
            <span className="text-lg">Hóa đơn</span>
          </ComButton>
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
                {orderData.items.length} dịch vụ
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-500">
                <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                {orderData.date}
              </div>
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded">
                {orderData.status}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <table className="w-full mb-6">
            <thead className="text-gray-500 text-sm">
              <tr>
                <th className="text-left py-2">Dịch vụ</th>
                <th className="text-left">Mã đơn hàng</th>
                <th className="text-right">Số lượng gói</th>
                <th className="text-right">Đơn giá</th>
                <th className="text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {orderData.items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="py-3">
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt=""
                        className="w-10 h-10 rounded mr-3"
                      />
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td>{item.id}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">
                    {item.price.toLocaleString()}đ
                  </td>
                  <td className="text-right">
                    {item.total.toLocaleString()}đ
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
                {orderData.items
                  .reduce((acc, item) => acc + item.total, 0)
                  .toLocaleString()}
                đ
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Phí giao hàng</span>
              <span>{orderData.shipping.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">VAT</span>
              <span>{orderData.vat.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Tổng thanh toán</span>
              <span>{orderData.total.toLocaleString()}đ</span>
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
                <select className="font-medium w-full p-2 border rounded-md">
                  <option>{orderData.status}</option>
                  {/* Thêm các trạng thái khác nếu cần */}
                </select>
              </div>
              <div>
                <p className="text-gray-500 text-lg mb-2">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Khách hàng
                </p>
                <p className="font-medium">{orderData.customer.name}</p>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-lg">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                    Email
                  </p>
                  <FontAwesomeIcon 
                    icon={faCopy} 
                    className="cursor-pointer" 
                    onClick={() => handleCopy(orderData.customer.email)} 
                  />
                </div>
                <p className="text-gray-600">{orderData.customer.email}</p>
              </div>
             
              <div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-lg">
                    <FontAwesomeIcon icon={faPhone} className="mr-2" />
                    Số điện thoại
                  </p>
                  <FontAwesomeIcon 
                    icon={faCopy} 
                    className="cursor-pointer" 
                    onClick={() => handleCopy(orderData.customer.phone)} 
                  />
                </div>
                <p>{orderData.customer.phone}</p>
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
            <p className="text-gray-600 mt-3 text-lg">
              <FontAwesomeIcon icon={faHouseUser} className="mr-2" />
              Địa chỉ:
            </p>
            <p className="text-gray-600">
              {orderData.address}
            </p>
            <p className="text-gray-600 mt-2 text-lg">
              <FontAwesomeIcon icon={faStore} className="mr-2" />
              Chi nhánh:
            </p>
            <p className="text-gray-600">
              {orderData.branch.name}
            </p>
            {/* Thêm thông tin bổ sung nếu cần */}
          </div>
        </div>
        
        {/* Thông tin vận chuyển */}
        <div className="flex items-start bg-white rounded-lg shadow p-4 w-full">
          <Truck className="w-5 h-5 text-blue-600 mr-2" />
          <div>
            <h3 className="font-semibold text-blue-600 text-xl">Vận chuyển</h3>
            <div className="flex justify-between items-center text-gray-600 mt-3 text-lg">
              <div>
                <FontAwesomeIcon icon={faFile} className="mr-2" />
                Mã vận chuyn:
              </div>
              <FontAwesomeIcon 
                icon={faCopy} 
                className="cursor-pointer" 
                onClick={() => handleCopy(orderData.deliveryCode)} 
              />
            </div>
            <p className="text-gray-600">
              {orderData.deliveryCode}
            </p>
            <p className="text-gray-600 mt-2 text-lg">
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