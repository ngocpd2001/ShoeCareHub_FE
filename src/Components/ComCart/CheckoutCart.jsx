import React from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore } from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-regular-svg-icons";

const CheckoutCard = () => {
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

  return (
    <div className="p-4 bg-white">
      {cartItems.length === 0 ? (
        <div className="text-center">
          <h2 className="text-[#002278] text-2xl font-bold mb-2">
            Giỏ hàng trống
          </h2>
          <p className="text-gray-500">Không có dịch vụ nào được chọn.</p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-4 items-center justify-center py-3 h-15">
            <div className="font-semibold text-xl text-center">Sản phẩm</div>
            <div className="font-semibold text-xl text-center">Đơn giá</div>
            <div className="font-semibold text-xl text-center">Số lượng</div>
            <div className="font-semibold text-xl text-center">Thành tiền</div>
          </div>

          {cartItems.map((shop) => (
            <div
              key={shop.shopName}
              className="bg-white p-4 border-b border rounded-lg mb-6"
            >
              <div className="flex items-center py-3 border-b bg-[#F9F1E7] px-4">
                <FontAwesomeIcon
                  icon={faStore}
                  className="text-[#002278] mr-3"
                />
                <h2 className="text-xl font-bold text-[#002278] mr-2">
                  {shop.shopName}
                </h2>
                <FontAwesomeIcon icon={faMessage} className="text-[#002278]" />
              </div>

              {shop.products.map((product) => (
                <div className="grid grid-cols-4 items-center justify-center mt-2 py-2">
                  <div className="text-center flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 mr-4"
                    />
                    <span className="font-semibold text-[#002278]">
                      {product.name}
                    </span>
                  </div>

                  <div className="items-center justify-center text-center">
                    <span className="text-black text-right">
                      {(
                        product.discountedPrice || product.originalPrice
                      ).toLocaleString()}{" "}
                      đ
                    </span>
                  </div>

                  <div className="items-center justify-center text-center">
                    <span className="text-black"> {product.quantity}</span>
                  </div>

                  <div className="items-center justify-center text-center">
                    <span className="text-[#002278] text-right">
                      {(
                        (product.discountedPrice || product.originalPrice) *
                        product.quantity
                      ).toLocaleString()}{" "}
                      đ
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CheckoutCard;
