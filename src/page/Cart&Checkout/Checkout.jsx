import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CheckoutCart from "../../Components/ComCart/CheckoutCart";
import { getServiceById } from "../../api/service";
import { checkout } from "../../api/cart";
import { getAddressByAccountId } from "../../api/address";
import { getAccountById } from "../../api/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import AddressModal from "../../Components/ComCart/AddressModal";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedItems: initialCartItems = [] } = location.state || {};
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [deliveryOption, setDeliveryOption] = useState("delivery");
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState({});
  const [address, setAddress] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addresses, setAddresses] = useState({});
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [userInfo, setUserInfo] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));
  const accountId = user?.id;

  // Sử dụng dữ liệu từ localStorage nếu API không hoạt động
  useEffect(() => {
    if (user) {
      setUserInfo({
        fullname: user.fullName,
        phone: user.phone,
      });
    }
  }, [user]);

  const fetchUserInfo = async () => {
    try {
      const userData = await getAccountById(accountId);
      console.log("User data:", userData);
      setUserInfo(userData);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchUserInfo();
    }
  }, [accountId]);

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
    const fetchAddress = async () => {
      if (accountId) {
        try {
          const addressData = await getAddressByAccountId(accountId);
          const defaultAddr = addressData.find((addr) => addr.isDefault);
          setDefaultAddress(defaultAddr);
        } catch (error) {
          console.error("Lỗi khi lấy địa chỉ:", error);
        }
      }
    };

    fetchAddress();
  }, [accountId]);

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

  const handleNotesChange = (branchId, note) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [branchId]: note,
    }));
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

      const items = cartItems.flatMap((shop) =>
        shop.services && Array.isArray(shop.services)
          ? shop.services.map((service) => ({
              serviceId: service.id,
              materialId: service.materialId || 0,
              branchId: service.branchId || 0,
              quantity: service.quantity || 1,
            }))
          : []
      );

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

      // Kết hợp các note cho từng branchId
      const combinedNotes = Object.values(notes)
        .filter((note) => note)
        .join("; ");

      // Xác định dữ liệu cần truyền dựa trên nguồn gốc thanh toán
      const requestData = {
        accountId,
        addressId,
        isAutoReject,
        note: combinedNotes,
        isShip,
      };

      if (location.state?.fromServiceDetail) {
        // Thanh toán từ ServiceDetail
        if (items.length > 0) {
          requestData.items = items;
        } else {
          console.error("Không có dịch vụ nào để thanh toán.");
          return;
        }
      } else {
        // Thanh toán từ Cart
        if (cartItemIds.length > 0) {
          requestData.cartItemIds = cartItemIds;
        } else {
          console.error("Không có mục giỏ hàng nào để thanh toán.");
          return;
        }
      }

      console.log("Dữ liệu gửi đi:", requestData);

      const result = await checkout(
        requestData.items,
        requestData.cartItemIds,
        accountId,
        addressId,
        requestData.note
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

  const handleAddressModalOpen = () => {
    setIsAddressModalOpen(true);
  };

  const handleAddressModalClose = () => {
    setIsAddressModalOpen(false);
  };

  const handleSelectAddress = (selectedAddress) => {
    setDefaultAddress(selectedAddress);
    setIsAddressModalOpen(false);
  };

  return (
    <>
      <h1 className="text-3xl text-[#002278] font-bold bg-white w-full text-center py-4">
        Hoàn Tất Đơn Hàng
      </h1>
      <div className="p-4 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto p-6 rounded-lg">
          <div className="mb-4 mt-1 block w-full px-3 py-2 border-t-2 border-[#002278] rounded-md shadow-sm focus:outline-none focus:ring-[#002278] focus:border-[#002278] sm:text-sm bg-white">
            <label className="text-lg font-medium flex items-center">
              <span className="text-[#002278] p-1 rounded-full mr-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </span>
              Địa chỉ nhận hàng:
            </label>
            <div className="mt-2 text-lg flex items-center justify-between flex-wrap">
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-6 font-medium">
                  {userInfo?.fullname || "Tên không có"} (
                  {userInfo?.phone || "Số điện thoại không có"})
                </div>
                <div className="flex-1 text-right whitespace-nowrap mr-6">
                  {defaultAddress ? (
                    <>
                      {defaultAddress.address}, {defaultAddress.ward},{" "}
                      {defaultAddress.district}, {defaultAddress.province}
                      {defaultAddress.isDefault && (
                        <span className="ml-2 px-1 py-0.5 border border-red-500 text-red-500 text-sm rounded">
                          Mặc Định
                        </span>
                      )}
                    </>
                  ) : (
                    "Đang tải địa chỉ..."
                  )}
                </div>
                <button
                  onClick={handleAddressModalOpen}
                  className="text-white bg-[#002278] text-lg ml-6 px-4 py-1 rounded-lg"
                >
                  Thay Đổi
                </button>
              </div>
            </div>
          </div>
          <CheckoutCart
            cartItems={cartItems}
            onNoteChange={handleNotesChange}
            onDeliveryOptionChange={handleDeliveryOptionChange}
          />
          <div className="border-gray-300 p-4 bg-white">
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
              <h2 className="text-2xl font-bold mb-2">
                Cảm ơn bạn đã đặt hàng!
              </h2>
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

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={handleAddressModalClose}
        accountId={accountId}
        onSelectAddress={handleSelectAddress}
      />
    </>
  );
};

export default Checkout;
