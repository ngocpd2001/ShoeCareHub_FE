import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CheckoutCart from "../../Components/ComCart/CheckoutCart";
import { getServiceById } from "../../api/service";
import { checkout } from "../../api/cart";
import { getAddressByAccountId } from "../../api/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedItems: initialCartItems = [] } = location.state || {};
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [deliveryOption, setDeliveryOption] = useState("delivery");
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [note, setNote] = useState("");

  const fetchServiceDetails = async () => {
    try {
      const updatedCartItems = await Promise.all(
        cartItems.map(async (shop) => {
          if (shop.services && Array.isArray(shop.services)) {
            const updatedServices = await Promise.all(
              shop.services.map(async (service) => {
                if (service?.id) {
                  const response = await getServiceById(service.id);
                  const serviceData = response.data?.items?.find(
                    (item) => item.id === service.id
                  );
                  return { ...service, ...serviceData };
                }
                return service;
              })
            );
            return { ...shop, services: updatedServices };
          }
          return shop;
        })
      );
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin dịch vụ", error);
    }
  };

  useEffect(() => {
    if (initialCartItems.length > 0) {
      fetchServiceDetails();
    }
  }, [initialCartItems]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (cartItems.length === 0) {
      const storedCartItems = localStorage.getItem("cartItems");
      if (storedCartItems) {
        setCartItems(JSON.parse(storedCartItems));
      }
    }
  }, []);

  // Tính tổng tiền
  const totalAmount = cartItems.reduce((total, shop) => {
    if (shop && Array.isArray(shop.services)) {
      const shopTotal = shop.services.reduce((shopTotal, service) => {
        const servicePrice =
          service?.promotion?.newPrice || service?.price || 0;
        const serviceQuantity = service?.quantity || 1;
        return shopTotal + servicePrice * serviceQuantity;
      }, 0);
      return total + shopTotal;
    }
    return total;
  }, 0);

  const totalServices = cartItems.reduce((count, shop) => {
    if (shop && Array.isArray(shop.services)) {
      return count + shop.services.length;
    }
    return count;
  }, 0);

  const handleDeliveryOptionChange = (option) => {
    setDeliveryOption(option);
  };

  const handleNoteChange = (newNote) => {
    setNote(newNote || "");
  };

  const handleCheckout = async () => {
    try {
      const storedCartItems = localStorage.getItem("cartItems");
      console.log("Dữ liệu cartitems từ localStorage:", storedCartItems);
      const cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];

      if (cartItems.length === 0) {
        console.error("Giỏ hàng trống");
        return;
      }

      const cartItemIds = cartItems.flatMap((shop) =>
        shop.services && Array.isArray(shop.services)
          ? shop.services.map((service) => service.id)
          : []
      );

      if (cartItemIds.length === 0) {
        console.error("Không tìm thấy ID dịch vụ");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));
      const accountId = user?.id;

      if (!accountId) {
        console.error("Không tìm thấy UserId");
        return;
      }

      const addressData = await getAddressByAccountId(accountId);
      const addressId = addressData[0]?.id;

      if (!addressId) {
        console.error("Không tìm thấy AddressId");
        return;
      }

      const isShip = deliveryOption === "delivery";

      const isAutoReject = false;

      const requestData = {
        cartItemIds,
        accountId,
        addressId,
        isAutoReject,
        note: note || "",
        isShip,
      };
      console.log("Dữ liệu gửi đi:", requestData);

      const result = await checkout(
        cartItemIds,
        accountId,
        addressId,
        note,
        isShip
      );
      console.log("Đặt dịch vụ đã được thực hiện", result);
      setIsOrderSuccess(true);
    } catch (error) {
      console.error("Lỗi khi thực hiện checkout:", error);
    }
  };

  const handleViewOrder = () => {
    navigate("/user/order-history");
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-6 rounded-lg bg-white">
        <h1 className="text-3xl text-[#002278] font-bold mb-2">
          Hoàn Tất Đơn Hàng
        </h1>
        <CheckoutCart
          cartItems={cartItems}
          onNoteChange={handleNoteChange}
          onDeliveryOptionChange={handleDeliveryOptionChange}
        />
        <div className="border-t border-gray-300 p-4 mx-2">
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
              <span className="text-lg text-[#002278] text-right">0 đ</span>
            </div>
          </div>

          <div className="flex justify-end mb-2">
            <div className="flex justify-between w-full max-w-md">
              <h2 className="text-xl">Tổng tiền tạm tính:</h2>
              <span className="text-xl text-[#002278] text-right">
                {totalAmount.toLocaleString()} đ
              </span>
            </div>
          </div>

          <div className="flex justify-end my-3">
            <button
              onClick={handleCheckout}
              className="bg-[#002278] text-white px-4 py-2 rounded text-xl mt-4"
            >
              Đặt dịch vụ
            </button>
          </div>
        </div>
      </div>

      {isOrderSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-6xl text-[#002278] mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">Cảm ơn bạn đã đặt hàng!</h2>
            <p className="text-gray-600 mb-4">
              Đơn hàng của bạn đã được đặt thành công.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleViewOrder}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Xem đơn hàng
              </button>
              <button
                onClick={handleContinueShopping}
                className="bg-[#002278] text-white px-4 py-2 rounded"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
