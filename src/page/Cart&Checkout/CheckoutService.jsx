import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CheckoutCart from "../../Components/ComCart/CheckoutCart";
import { getServiceById } from "../../api/service";
import { checkoutService } from "../../api/cart";
import { getAddressByAccountId } from "../../api/address";
import { getAccountById } from "../../api/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import AddressModal from "../../Components/ComCart/AddressModal";
import { Modal } from "antd";
import { getMaterialByServiceId } from "../../api/material";

const CheckoutService = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedItems: initialCartItems = [] } = location.state || {};
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [deliveryOption, setDeliveryOption] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [notes, setNotes] = useState({});
  const [address, setAddress] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addresses, setAddresses] = useState({});
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [shippingFees, setShippingFees] = useState({});
  const [deliveryOptions, setDeliveryOptions] = useState({});
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const accountId = user?.id;

  // Gộp logic xử lý user info vào một useEffect duy nhất
  useEffect(() => {
    const initializeUserInfo = async () => {
      if (!accountId) return;

      try {
        // Đầu tiên set thông tin cơ bản từ localStorage
        setUserInfo({
          fullname: user.fullName || "",
          phone: user.phone || "",
        });

        // Sau đó fetch thông tin chi tiết từ API
        const userData = await getAccountById(accountId);
        if (userData) {
          setUserInfo((prevInfo) => ({
            ...prevInfo,
            ...userData,
          }));
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    initializeUserInfo();
  }, [accountId]); // Chỉ chạy lại khi accountId thay đổi

  const fetchServiceDetails = async () => {
    try {
      const updatedCartItems = await Promise.all(
        cartItems.map(async (shop) => {
          if (!shop.services || !Array.isArray(shop.services)) {
            return shop;
          }

          const updatedServices = await Promise.all(
            shop.services.map(async (service) => {
              if (!service?.id) {
                return service;
              }

              try {
                const response = await getServiceById(service.id);

                // Log để debug
                // console.log("Raw response:", response);

                // Kiểm tra xem response có phải là data trực tiếp không
                const serviceData = response.data || response;

                // Log để debug
                // console.log("Service data:", serviceData);

                // Lấy URL ảnh từ assetUrls
                let imageUrl = null;
                let foundImageAsset = null;
                if (
                  serviceData.assetUrls &&
                  Array.isArray(serviceData.assetUrls)
                ) {
                  foundImageAsset = serviceData.assetUrls.find(
                    (asset) =>
                      asset &&
                      (asset.type === "image" || asset.isImage === false) &&
                      asset.url
                  );
                  imageUrl = foundImageAsset?.url || null;
                }

                // Log để debug
                // console.log("Asset URLs:", serviceData.assetUrls);
                // console.log("Found image asset:", foundImageAsset);
                // console.log("Final image URL:", imageUrl);

                return {
                  ...service,
                  ...serviceData,
                  image: imageUrl,
                };
              } catch (error) {
                console.error(
                  `Lỗi khi lấy thông tin dịch vụ ${service.id}:`,
                  error
                );
                return service;
              }
            })
          );

          return { ...shop, services: updatedServices };
        })
      );

      if (JSON.stringify(updatedCartItems) !== JSON.stringify(cartItems)) {
        setCartItems(updatedCartItems);
      }
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
    if (cartItems.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (cartItems.length === 0 && storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  // Kiểm tra dữ liệu nhận được
  useEffect(() => {
    console.log("Selected Items:", initialCartItems);
  }, [initialCartItems]);

  // Tính tổng tiền dịch vụ
  const totalAmount = cartItems.reduce((total, shop) => {
    if (shop && Array.isArray(shop.services)) {
      const shopTotal = shop.services.reduce((shopTotal, service) => {
        const servicePrice =
          service?.promotion?.newPrice || service?.price || 0;
        const materialPrice = service?.materialPrice || 0;
        return shopTotal + (servicePrice + materialPrice);
      }, 0);
      return total + shopTotal;
    }
    return total;
  }, 0);

  // Tính tổng số dịch vụ
  const totalServices = cartItems.reduce((count, shop) => {
    if (shop && Array.isArray(shop.services)) {
      return (
        count +
        shop.services.reduce((serviceCount, service) => {
          return serviceCount + (service?.quantity || 1);
        }, 0)
      );
    }
    return count;
  }, 0);

  const handleDeliveryOptionChange = (option) => {
    if (typeof option === "object") {
      if (option.hasOwnProperty("isValid")) {
        setDeliveryOption(option.isValid);
      }
      if (option.hasOwnProperty("options")) {
        setDeliveryOptions(option.options);
      }
    }
  };

  const handleNoteChange = ({ branchId, note }) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [branchId]: note,
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
    const addressId = selectedAddress?.id;
    console.log("Selected Address ID:", addressId);
    setIsAddressModalOpen(false);
  };

  const handleCheckout = async () => {
    try {
      // Kiểm tra xem đã chọn phương thức giao hàng chưa
      const hasDeliveryOptions = Object.values(deliveryOptions).length > 0;
      if (!hasDeliveryOptions) {
        Modal.confirm({
          title: "Thông báo",
          content: "Vui lòng chọn phương thức giao hàng",
          okText: "Đồng ý",
          cancelText: "Hủy",
          okButtonProps: {
            className:
              "bg-[#002278] hover:bg-[#001a5e] border-[#002278] text-white",
          },
          className: "custom-modal mt-[-32%]",
          centered: true,
        });
        return;
      }

      // Xác định isShip dựa trên deliveryOptions
      const isShip = Object.values(deliveryOptions).some(
        (option) => option === "delivery"
      );

      // Kiểm tra nếu có giao hàng nhưng không có địa chỉ
      if (isShip && !defaultAddress) {
        Modal.confirm({
          title: "Thông báo",
          content: "Vui lòng chọn địa chỉ giao hàng cho đơn hàng giao tận nơi",
          okText: "Đồng ý",
          cancelText: "Hủy",
          okButtonProps: {
            className:
              "bg-[#002278] hover:bg-[#001a5e] border-[#002278] text-white",
          },
          centered: true,
          className: "custom-antd-modal",
        });
        return;
      }

      const checkoutItems = cartItems.flatMap((shop) =>
        shop.services.map((service) => {
          const item = {
            serviceId: Number(service.id),
            branchId: Number(service.branchId),
            addressId: defaultAddress?.id ? Number(defaultAddress.id) : null,
            note: notes[service.branchId] || "",
            // Thêm materialId nếu có
            ...(service.materialId && { materialId: Number(service.materialId) }),
          };

          return item;
        })
      );

      // Log dữ liệu checkoutItems
      console.log("Dữ liệu gửi đi:", JSON.stringify(checkoutItems, null, 2));

      // Cập nhật cấu trúc checkoutData
      let checkoutData = {
        item: checkoutItems[0], // Lấy item đầu tiên
        accountId: Number(accountId),
        addressId: defaultAddress?.id ? Number(defaultAddress.id) : null,
        isAutoReject: false,
        notes: notes,
        isShip: isShip,
      };

      // Log dữ liệu checkoutData
      console.log("Dữ liệu checkout:", JSON.stringify(checkoutData, null, 2));

      const response = await checkoutService(checkoutData); // Sửa tên hàm gọi
      console.log("Response from API:", response);

      if (response) {
        setIsOrderSuccess(true);
        setCartItems([]);
        localStorage.removeItem("cartItems");
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      Modal.error({
        title: "Lỗi",
        content: "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau!",
        okText: "Đồng ý",
        centered: true,
        okButtonProps: {
          style: {
            backgroundColor: "#002278",
            borderColor: "#002278",
          },
        },
        style: {
          top: "20px",
        },
      });
    }
  };

  const handleShippingFeesChange = (fees, branchId) => {
    // Kiểm tra nếu có lỗi không hỗ trợ ship
    if (fees.error && fees.error.includes("Không hỗ trợ ship")) {
      Modal.warning({
        title: "Thông báo",
        content:
          "Không hỗ trợ giao hàng cho khu vực này. Vui lòng chọn hình thức nhận hàng tại cửa hàng hoặc chọn địa chỉ khác.",
        okText: "Đồng ý",
        centered: true,
        okButtonProps: {
          className:
            "bg-[#002278] hover:bg-[#001a5e] border-[#002278] text-white",
        },
      });
      // Reset delivery option về pickup
      handleDeliveryOptionChange({
        isValid: true,
        options: { [branchId]: "pickup" },
      });
    } else {
      setShippingFees(fees);
    }
  };

  // Tính tổng tiền giao hàng
  const totalShippingFee = Object.values(shippingFees).reduce(
    (total, fee) => total + (fee || 0),
    0
  );

  // Tính tổng tiền tạm tính
  const finalTotalAmount = totalAmount + totalShippingFee;

  useEffect(() => {
    const fetchMaterialData = async () => {
      if (cartItems.length > 0) {
        try {
          const materialsPromises = cartItems.map(async (shop) => {
            const serviceIds = shop.services.map((service) => service.id);
            const materials = await Promise.all(
              serviceIds.map((id) => getMaterialByServiceId(id))
            );
            return materials;
          });
          const materialsData = await Promise.all(materialsPromises);
          console.log("Dữ liệu phụ kiện:", materialsData);
          // Xử lý dữ liệu phụ kiện ở đây nếu cần
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu phụ kiện:", error);
        }
      }
    };

    fetchMaterialData();
  }, [cartItems]); // Gọi lại khi cartItems thay đổi

  const handleMaterialChange = (checkedValues) => {
    setSelectedMaterials(checkedValues);
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
                  {userInfo?.phone || "Số iện thoại không có"})
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
            onNoteChange={handleNoteChange}
            onDeliveryOptionChange={handleDeliveryOptionChange}
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

export default CheckoutService;
