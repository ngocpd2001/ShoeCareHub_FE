import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CheckoutCart from "../../Components/ComCart/CheckoutCart";
import { getServiceById } from "../../api/service";
import { checkout } from "../../api/cart";

const Checkout = () => {
  const location = useLocation();
  const { selectedItems: initialCartItems = [] } = location.state || {};
  const [cartItems, setCartItems] = useState(initialCartItems);

  const fetchServiceDetails = async () => {
    try {
      const updatedCartItems = await Promise.all(
        cartItems.map(async (shop) => {
          if (shop.services && Array.isArray(shop.services)) {
            const updatedServices = await Promise.all(
              shop.services.map(async (service) => {
                if (service && service.id) {
                  const response = await getServiceById(service.id);
                  const serviceData = response.data && response.data.items 
                    ? response.data.items.find(item => item.id === service.id)
                    : null;
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
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  // Tính tổng tiền
  const totalAmount = cartItems.reduce((total, shop) => {
    if (shop && Array.isArray(shop.services)) {
      const shopTotal = shop.services.reduce((shopTotal, service) => {
        const servicePrice =
          (service && service.promotion && service.promotion.newPrice) ||
          (service && service.price) ||
          0;
        const serviceQuantity = service ? service.quantity || 1 : 1;
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

  const handleCheckout = async () => {  
    try {  
      const cartItemIds = cartItems.flatMap(shop =>   
        shop.services.map(service => service.id)  
      );  
      
      const accountId = "your_user_id"; // Replace with actual user account ID  
      const addressId = "your_address_id"; // Replace with actual address ID  
      const note = "Ghi chú nếu cần"; // Replace with actual note if needed  
  
      // Construct the request body  
      const requestBody = {  
        cartItemIds,  
        accountId,  
        addressId,  
        isAutoReject: false, // Set based on your requirements  
        note,  
        deliveredFee: 0, // Set based on your logic  
        shippingUnit: "string", // Replace with actual shipping unit if needed  
        shippingCode: "string" // Replace with actual shipping code if needed  
      };  
  
      console.log(requestBody); // Check the request body structure  
  
      const result = await checkout(requestBody); // Make sure the checkout function is revised to accept an object  
      console.log("Đặt dịch vụ đã được thực hiện", result);  
    } catch (error) {  
      console.error("Lỗi khi thực hiện checkout:", error);  
    }  
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-6 rounded-lg bg-white">
        <h1 className="text-3xl text-[#002278] font-bold mb-2">Hoàn Tất Đơn Hàng</h1>
        <CheckoutCart cartItems={cartItems} />
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
              <span className="text-lg text-[#002278] text-right">
                0 đ
              </span>
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
            <button onClick={handleCheckout} className="bg-[#002278] text-white px-4 py-2 rounded text-xl mt-4">
              Đặt dịch vụ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
