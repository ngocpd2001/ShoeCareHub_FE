// InvoiceDisplay.js
import React, { useState } from "react";
import { CreditCard } from "lucide-react"; // Sử dụng biểu tượng placeholder
import { postData } from "../../../api/api";

const paymentMethods = [
  { id: "VnPay", name: "VNPay", icon: CreditCard },
  { id: "zalopay", name: "ZaloPay", icon: CreditCard },
];

export default function InvoiceDisplay({ packageInfo, onClose }) {
  const [selectedMethod, setSelectedMethod] = useState("");

  const handlePaymentMethodChange = (methodId) => {
    setSelectedMethod(methodId);
  };
  const payment = () => {
    postData(`/payments/payment-url`, {
      packId: packageInfo.id,
      payment: selectedMethod.id,
    })
      .then((e) => {
        // chuyển đường dẫn thanh toán
        console.log("====================================");
        console.log(e);
        window.location.href = e;

        console.log("====================================");
      })
      .catch((error) => {});
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-800 min-w-[400px] text-white py-4 px-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Hóa đơn</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Thông tin gói */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">Thông tin gói</h3>
            <div className="flex justify-between">
              <span className="text-gray-600">Tên gói:</span>
              <span className="font-medium">{packageInfo.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Số tiền:</span>
              <span className="font-medium">
                {packageInfo.price.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Thời hạn:</span>
              <span className="font-medium">{packageInfo.period} tháng</span>
            </div>
          </div>

          {/* Lựa chọn phương thức thanh toán */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              Phương thức thanh toán
            </h3>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={() => handlePaymentMethodChange(method.id)}
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                  <method.icon className="h-6 w-6 text-gray-400" />
                  <span className="text-gray-700">{method.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Tổng cộng và nút xác nhận */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium text-gray-900">
              Tổng cộng:
            </span>
            <span className="text-2xl font-bold text-blue-600">
              {packageInfo.price.toLocaleString("vi-VN")} VNĐ
            </span>
          </div>
          <button
            onClick={payment}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedMethod}
          >
            Xác nhận thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
