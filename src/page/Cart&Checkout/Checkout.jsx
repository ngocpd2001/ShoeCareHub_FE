import React from "react";
import { useLocation } from "react-router-dom";
import CheckoutCart from "../../Components/ComCart/CheckoutCart";

const Checkout = () => {
  const location = useLocation();
  const { selectedItems: cartItems = [] } = location.state || {};

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

        <div className="border-t border-gray-300 p-4 mx-2">
          <div className="flex justify-end mb-2">
            <div className="flex justify-between w-full max-w-md">
              <div>
                <h2 className="text-xl">Tổng tiền dịch vụ:</h2>
                <span className="block text-lg text-center ">
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
