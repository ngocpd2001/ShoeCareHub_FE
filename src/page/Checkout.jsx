import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import CheckoutCart from "../Components/ComCart/CheckoutCart";

const Checkout = () => {
  const [deliveryOption, setDeliveryOption] = useState("delivery");
  const location = useLocation();
  const { selectedItems: cartItems = [] } = location.state || {};

  const handleDeliveryOptionChange = (event) => {
    setDeliveryOption(event.target.value);
  };

  const totalAmount = cartItems.reduce(
    (total, shop) =>
      total +
      shop.products.reduce(
        (shopTotal, product) =>
          shopTotal +
          (product.discountedPrice || product.originalPrice) * product.quantity,
        0
      ),
    0
  );

  const totalServices = cartItems.reduce(
    (count, shop) => count + shop.products.length,
    0
  );

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-6 rounded-lg bg-white">
        <h1 className="text-3xl text-[#002278] font-bold mb-2">Thanh Toán</h1>
        <CheckoutCart />

        <div className="grid grid-cols-2 gap-4 mt-2 border-t border-gray-300 pt-4">
          <div className="mr-8">
            <h2 className="text-lg font-bold mb-2">Lời nhắn</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded h-44"
              placeholder="Lưu ý cho cửa hàng..."
            />
          </div>

          <div>
            <h2 className="text-lg font-bold mb-2">Tùy chọn giao hàng</h2>
            <div className="flex flex-col ">
              <div
                className={`mb-4 p-4 h-20 rounded-md ${
                  deliveryOption === "delivery"
                    ? "bg-[#002278] text-white"
                    : "bg-white text-black"
                } flex items-center justify-between`}
              >
                <div className="flex flex-col">
                  <label className="flex items-center font-semibold text-xl">
                    <input
                      type="radio"
                      value="delivery"
                      checked={deliveryOption === "delivery"}
                      onChange={handleDeliveryOptionChange}
                      className="mr-2"
                    />
                    Giao hàng
                  </label>
                  <p
                    className={`ml-4 ${
                      deliveryOption === "delivery"
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    Đơn hàng sẽ giao tại địa chỉ của tài khoản bạn
                  </p>
                </div>
                <p className="font-medium">Cập nhật sau</p>
              </div>

              <div
                className={`p-4 h-20 rounded-md ${
                  deliveryOption === "pickup"
                    ? "bg-[#002278] text-white"
                    : "bg-white text-black"
                } flex items-center justify-between`}
              >
                <div className="flex flex-col">
                  <label className="flex items-center font-semibold text-xl">
                    <input
                      type="radio"
                      value="pickup"
                      checked={deliveryOption === "pickup"}
                      onChange={handleDeliveryOptionChange}
                      className="mr-2"
                    />
                    Lấy tại cửa hàng
                  </label>
                  <p
                    className={`ml-4 ${
                      deliveryOption === "pickup" ? "text-white" : "text-black"
                    }`}
                  >
                    Nhận hàng tại cửa hàng
                  </p>
                </div>
                <p className="font-medium">Free</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-300 pt-4">
          <div className="flex justify-end mb-2">
            <div className="flex justify-between w-full max-w-md">
              <div>
                <h2 className="text-xl">Tổng tiền dịch vụ:</h2>
                <span className="block text-lg text-center">
                  ({totalServices} dịch vụ)
                </span>
              </div>
              <span className="text-xl text-[#002278] text-right">
                {totalAmount.toLocaleString()} đ
              </span>
            </div>
          </div>

          <div className="flex justify-end mb-2">
            <div className="flex justify-between w-full max-w-md">
              <h2 className="text-lg">Tiền giao hàng:</h2>
              <span className="text-lg text-[#002278]text-right"></span>
            </div>
          </div>

          <div className="flex justify-end mb-2">
            <div className="flex justify-between w-full max-w-md">
              <h2 className="text-xl">Tổng thanh toán:</h2>
              <span className="text-xl text-[#002278] text-right">
                {totalAmount.toLocaleString()} đ
              </span>
            </div>
          </div>

          <div className="flex justify-end my-3">
            <button className="bg-[#002278] text-white px-4 py-2 rounded text-xl mt-4">
              Đặt dịch vụ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
