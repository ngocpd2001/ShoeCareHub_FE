import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore } from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const CheckoutCard = () => {
  const location = useLocation();
  const { selectedItems: cartItems = [] } = location.state || {};
  const [deliveryOption, setDeliveryOption] = useState("delivery");

  const handleDeliveryOptionChange = (event) => {
    setDeliveryOption(event.target.value);
  };

  return (
    <div className="px-4 pt-4 bg-white">
      <div>
        <div className="grid grid-cols-4 items-center justify-center p-4 h-15">
          <div className="font-semibold text-xl text-center">Sản phẩm</div>
          <div className="font-semibold text-xl text-center">Đơn giá</div>
          <div className="font-semibold text-xl text-center">Số lượng</div>
          <div className="font-semibold text-xl text-center">Thành tiền</div>
        </div>

        {cartItems.map((shop) => {
          const shopTotal = (shop.services || []).reduce(
            (shopTotal, service) => {
              const price = service.promotion.newPrice !== undefined ? service.promotion.newPrice : service.price;
              return shopTotal + price * (service.quantity || 0);
            },
            0
          );

          return (
            <div
              key={shop}
              className="bg-white p-4 border border-[#002278] rounded-lg mb-8"
            >
              <div className="grid grid-cols-2 py-3 border-b bg-[#F9F1E7] px-4">
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faStore}
                    className="text-[#002278] mr-3"
                  />
                  <h2 className="text-xl font-bold text-[#002278] mr-2 max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
                    {shop.shopName}
                  </h2>
                  <FontAwesomeIcon
                    icon={faMessage}
                    className="text-[#002278] bg-[#F9F1E7]"
                  />
                </div>

                <div className="flex items-center justify-end">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="text-[#002278] bg-[#F9F1E7] mr-3"
                  />
                  <h2 className="text-xl text-[#002278] max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
                    {shop.shopAddress}
                  </h2>
                </div>
              </div>

              {(shop.services || []).map((service) => {
                const price = service.promotion.newPrice !== undefined ? service.promotion.newPrice : service.price;
                const totalPrice = price * (service.quantity || 0);

                return (
                  <div className="grid grid-cols-4 items-center justify-center mt-2 py-2">
                    <div className="flex items-center">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-16 h-16 mr-4"
                      />
                      <span className="font-semibold text-[#002278] max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
                        {service.name}
                      </span>
                    </div>

                    <div className="items-center justify-center text-center">
                      <span className="text-black text-right max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
                        {(service.promotion.newPrice !== undefined ? service.promotion.newPrice : service.price).toLocaleString()} đ
                      </span>
                    </div>

                    <div className="items-center justify-center text-center max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
                      <span className="text-black"> {service.quantity || 0}</span>
                    </div>

                    <div className="items-center justify-center text-center max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
                      <span className="text-[#002278] text-right">
                        {totalPrice.toLocaleString()} đ
                      </span>
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-end font-semibold text-xl my-4 pr-3">
                <span className="mr-3">Tổng tiền:</span>
                <span className="text-[#002278]">
                  {shopTotal.toLocaleString()} đ
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2 border-t border-gray-300 p-4">
                <div className="mr-8">
                  <h2 className="text-lg font-bold mb-2">Lời nhắn</h2>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded h-34"
                    placeholder="Lưu ý cho cửa hàng..."
                  />
                </div>

                <div>
                  <h2 className="text-lg font-bold mb-2">Tùy chọn giao hàng</h2>
                  <div className="flex flex-col ">
                    <div
                      className={`mb-4 p-4 h-15 rounded-md ${
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
                          Đơn hàng sẽ giao tại địa chỉ của tài khon bạn
                        </p>
                      </div>
                      <p className="font-medium">Cập nhật sau</p>
                    </div>

                    <div
                      className={`p-4 h-15 rounded-md ${
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
                            deliveryOption === "pickup"
                              ? "text-white"
                              : "text-black"
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutCard;
