import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CheckoutUserCart from "../../Components/ComCart/CheckoutUserCart";
import { getServiceById } from "../../api/service";
import { checkoutCart } from "../../api/cart";
import { getAddressByAccountId } from "../../api/address";
import { getAccountById } from "../../api/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import AddressModal from "../../Components/ComCart/AddressModal";
import { Modal } from "antd";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedItems: initialCartItems = [] } = location.state || {};
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [deliveryOption, setDeliveryOption] = useState("delivery");
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [address, setAddress] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addresses, setAddresses] = useState({});
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [note, setNote] = useState("");
  const [shippingFees, setShippingFees] = useState({});
  const [deliveryOptions, setDeliveryOptions] = useState({});
  const [isValidDelivery, setIsValidDelivery] = useState(false);
  const [notes, setNotes] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const accountId = user?.id;

  // 1. Chỉ lấy dữ liệu từ localStorage một lần khi component mount
  useEffect(() => {
    if (cartItems.length === 0) {
      const storedCartItems = localStorage.getItem("cartItems");
      if (storedCartItems) {
        setCartItems(JSON.parse(storedCartItems));
      }
    }
  }, []); // Empty dependency array

  // 2. Tách riêng việc fetch service details
  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (!initialCartItems.length) return;

      try {
        const updatedCartItems = await Promise.all(
          initialCartItems.map(async (shop) => {
            if (shop.services && Array.isArray(shop.services)) {
              const updatedServices = await Promise.all(
                shop.services.map(async (service) => {
                  if (service?.serviceId) {
                    const response = await getServiceById(service.serviceId);
                    // Lọc và lấy URL ảnh từ assetUrls
                    const imageAssets = response.data.assetUrls.filter(
                      (asset) => asset.type === "image"
                    );
                    const imageUrl =
                      imageAssets.length > 0 ? imageAssets[0].url : null;

                    return {
                      ...service,
                      ...response.data,
                      id: service.id,
                      cartItemId: service.id,
                      image: imageUrl, // Thêm URL ảnh vào object service
                    };
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

    fetchServiceDetails();
  }, [initialCartItems]); // Chỉ phụ thuộc vào initialCartItems

  // 3. Tách riêng việc lưu vào localStorage
  useEffect(() => {
    const saveToLocalStorage = () => {
      if (cartItems.length > 0) {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
      }
    };

    saveToLocalStorage();
  }, [cartItems]);

  // 4. Tách riêng việc fetch user info
  useEffect(() => {
    if (!user) return;

    // Set thông tin cơ bản từ localStorage trước
    setUserInfo({
      fullname: user.fullName,
      phone: user.phone,
    });

    // Chỉ gọi API một lần khi component mount và có accountId
    const fetchUserData = async () => {
      if (!accountId) return;

      try {
        const userData = await getAccountById(accountId);
        if (userData) {
          setUserInfo((prev) => ({
            ...prev,
            ...userData,
          }));
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        // Giữ nguyên thông tin từ localStorage nếu API lỗi
      }
    };

    fetchUserData();
  }, []); // Chỉ chạy một lần khi component mount

  // 5. Tách riêng việc fetch address
  useEffect(() => {
    const fetchAddress = async () => {
      if (!accountId) return;

      try {
        const addressData = await getAddressByAccountId(accountId);
        const defaultAddr = addressData.find((addr) => addr.isDefault);
        setDefaultAddress(defaultAddr);
      } catch (error) {
        console.error("Lỗi khi lấy địa chỉ:", error);
      }
    };

    fetchAddress();
  }, [accountId]);

  // Thêm useEffect để tính totalAmount
  useEffect(() => {
    const calculateTotal = async () => {
      let total = 0;
      for (const shop of cartItems) {
        if (shop && Array.isArray(shop.services)) {
          for (const service of shop.services) {
            const servicePrice =
              service?.promotion?.newPrice || service?.price || 0;
            const materialPrice = service?.materialPrice || 0;
            total += servicePrice + materialPrice;
          }
        }
      }
      setTotalAmount(total);
    };

    calculateTotal();
  }, [cartItems]);

  // Tính tổng số dịch vụ
  const totalServices = cartItems.reduce((count, shop) => {
    if (shop && Array.isArray(shop.services)) {
      return count + shop.services.length;
    }
    return count;
  }, 0);

  const handleDeliveryOptionChange = ({ isValid, options }) => {
    setIsValidDelivery(isValid);
    setDeliveryOptions(options);
  };

  const handleNoteChange = ({ branchId, serviceId, note }) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [branchId]: {
        ...prevNotes[branchId],
        [serviceId]: note,
      },
    }));
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

  const handleCheckout = async () => {
    try {
      // Log dữ liệu nhận được từ UserCart
      console.log("Dữ liệu nhận được từ UserCart:", cartItems);

      // Kiểm tra xem có cửa hàng nào chọn giao hàng không
      const shopsWithDelivery = cartItems.filter(
        (shop) => deliveryOptions[shop.branchId] === "delivery"
      );

      // Nếu không có cửa hàng chọn giao hàng và không có địa chỉ
      if (shopsWithDelivery.length === 0 && !defaultAddress) {
        Modal.warning({
          title: "Thông báo",
          content: "Vui lòng chọn phương thức giao hàng.",
          okText: "Đồng ý",
          centered: true,
        });
        return;
      }

      // Kiểm tra xem tất cả cửa hàng đã chọn phương thức giao hàng chưa
      const allShopsHaveDeliveryOption = cartItems.every(
        (shop) =>
          deliveryOptions[shop.branchId] === "delivery" ||
          deliveryOptions[shop.branchId] === "pickup"
      );

      if (!allShopsHaveDeliveryOption) {
        Modal.warning({
          title: "Thông báo",
          content: "Vui lòng chọn phương thức giao hàng.",
          okText: "Đồng ý",
          centered: true,
        });
        return;
      }

      // Chuẩn bị dữ liệu checkout cho từng cửa hàng
      const checkoutPromises = cartItems.map(async (shop) => {
        const shopServices = shop.services.map((service) => ({
          cartItemId: service.id,
          note: notes[shop.branchId]?.[service.id] || "",
          branchId: shop.branchId,
        }));

        let checkoutData = {
          isShip: deliveryOptions[shop.branchId] === "delivery",
          cartItems: shopServices,
          accountId: Number(accountId),
          addressId: defaultAddress?.id ? Number(defaultAddress.id) : 0,
          isAutoReject: false,
        };

        // Log dữ liệu nhận được từ UserCart
        console.log("Dữ liệu nhận được từ UserCart:", checkoutData); // Đảm bảo ghi lại dữ liệu

        // Kiểm tra xem checkoutData có đầy đủ thông tin cần thiết không
        if (
          !checkoutData.accountId ||
          !checkoutData.addressId ||
          checkoutData.cartItems.length === 0
        ) {
          throw new Error("Thông tin thanh toán không đầy đủ.");
        }

        // Log để kiểm tra dữ liệu checkout
        console.log("Dữ liệu checkout gửi đi:", checkoutData);

        return await checkoutCart(checkoutData);
      });

      // Chờ tất cả các đơn hàng được xử lý
      const responses = await Promise.all(checkoutPromises);

      if (responses) {
        setIsOrderSuccess(true);
        setCartItems([]);
        localStorage.removeItem("cartItems");
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      Modal.error({
        title: "Lỗi",
        content:
          error.message || "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau!",
        okText: "Đồng ý",
        centered: true,
        okButtonProps: {
          className:
            "bg-[#002278] hover:bg-[#001a5e] border-[#002278] text-white",
        },
      });
    }
  };

  const handleShippingFeesChange = (fees) => {
    setShippingFees(fees);
    // console.log("Shipping fees updated:", fees); // Debug
  };

  const totalShippingFee = Object.values(shippingFees).reduce(
    (total, fee) => total + (fee || 0),
    0
  );

  const finalTotalAmount = totalAmount + totalShippingFee;

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
          <CheckoutUserCart
            cartItems={cartItems}
            onDeliveryOptionChange={handleDeliveryOptionChange}
            onNoteChange={handleNoteChange}
            defaultAddress={defaultAddress}
            onShippingFeesChange={handleShippingFeesChange}
            notes={notes}
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
                <span className="text-lg text-[#002278] text-right">
                  {totalShippingFee.toLocaleString()} đ
                </span>
              </div>
            </div>

            <div className="flex justify-end mb-2">
              <div className="flex justify-between w-full max-w-md">
                <h2 className="text-xl">Tổng tiền tạm tính:</h2>
                <span className="text-xl text-[#002278] text-right">
                  {finalTotalAmount.toLocaleString()} đ
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
