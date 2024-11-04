import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore } from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { getAddressByAccountId } from '../../api/user';

const CheckoutCard = () => {
  const location = useLocation();
  const { selectedItems: cartItems = [] } = location.state || {};
  const [deliveryOption, setDeliveryOption] = useState("delivery");
  const [address, setAddress] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const accountId = user ? user.id : null;
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchAddress = async () => {
      if (accountId) {
        try {
          const addressData = await getAddressByAccountId(accountId);
          setAddress(addressData);
        } catch (error) {
          console.error("Lỗi khi lấy địa chỉ:", error);
        }
      }
    };

    fetchAddress();
  }, [accountId]);

  const handleDeliveryOptionChange = (event) => {
    setDeliveryOption(event.target.value);
  };

  const handleSubmit = async () => {
    const payload = {
      cartItemIds: cartItems.map(item => item.id), // Lấy danh sách ID sản phẩm từ giỏ hàng
      accountId: accountId || "your_user_id", // ID tài khoản, thay thế bằng giá trị hợp lệ
      addressId: address ? address[0].id : "your_address_id", // ID địa chỉ, thay thế bằng giá trị hợp lệ
      isAutoReject: false, // Giá trị mặc định
      note: note || "Ghi chú nếu cần...", // Gắn giá trị cho lời nhắn
      deliveredFee: 0, // Phí giao hàng (có thể thay đổi theo logic của bạn)
      shippingUnit: "string", // Đơn vị giao hàng (có thể thay đổi theo logic của bạn)
      shippingCode: "string" // Mã giao hàng (có thể thay đổi theo logic của bạn)
    };

    try {
      const response = await fetch('/api/your-endpoint', { // Thay đổi '/api/your-endpoint' thành endpoint thực tế
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi gửi yêu cầu');
      }

      const data = await response.json();
      console.log('Phản hồi từ server:', data);
    } catch (error) {
      console.error('Lỗi:', error);
    }
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
              if (!service) return shopTotal;
              const price = service.promotion && service.promotion.newPrice !== undefined 
                ? service.promotion.newPrice 
                : service.price;
              return shopTotal + price * (service.quantity || 0);
            },
            0
          );

          return (
            <div
              key={shop.id}
              className="bg-white p-4 border border-[#002278] rounded-lg mb-8"
            >
              <div className="grid grid-cols-2 py-3 border-b bg-[#F9F1E7] px-4">
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faStore}
                    className="text-[#002278] mr-3"
                  />
                  <h2 className="text-xl font-bold text-[#002278] mr-2 max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
                    {shop.shopName || "Tên cửa hàng không có"}
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
                    {shop.shopAddress || "Địa chỉ không có"}
                  </h2>
                </div>
              </div>

              {(shop.services || []).map((service) => {
                if (!service) return null;
                const price = service.promotion && service.promotion.newPrice !== undefined 
                  ? service.promotion.newPrice 
                  : service.price;
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
                        {price.toLocaleString()} đ
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
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
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
                      } flex items-center justify-between h-29`}
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
                          } break-words`}
                        >
                          {address ? (
                            <>
                              {address[0].address}, {address[0].ward},<br /> {address[0].province}, {address[0].city}
                            </>
                          ) : (
                            "Đang tải địa chỉ..."
                          )}
                        </p>
                      </div>
                      <p className="font-medium">Chỉnh sửa</p>
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
