import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStore,
  faMessage,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { getAddressByAccountId } from "../../api/user";
import { getBranchByBranchId } from "../../api/branch";
import AddressModal from "./AddressModal";

const CheckoutCart = ({ cartItems, onDeliveryOptionChange, onNoteChange }) => {
  const [deliveryOption, setDeliveryOption] = useState("delivery");
  const [addresses, setAddresses] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));
  const accountId = user ? user.id : null;
  // console.log("cart", cartItems);
  const [branchDataList, setBranchDataList] = useState({});
  const location = useLocation();
  const { selectedItems } = location.state || { selectedItems: [] };
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [deliveryOptions, setDeliveryOptions] = useState({});
  const [currentBranchId, setCurrentBranchId] = useState(null);

  useEffect(() => {
    const fetchAddress = async () => {
      if (accountId) {
        try {
          const addressData = await getAddressByAccountId(accountId);
          const availableAddress = addressData.find(
            (addr) => addr.status === "AVAILABLE"
          );
          setAddresses({ [accountId]: availableAddress });
        } catch (error) {
          console.error("Lỗi khi lấy địa chỉ:", error);
        }
      }
    };

    fetchAddress();
  }, [accountId]);

  useEffect(() => {
    const fetchBranchData = async () => {
      const branchDataPromises = cartItems.map(async (shop) => {
        if (shop.branchId) {
          try {
            const data = await getBranchByBranchId(shop.branchId);
            return { branchId: shop.branchId, data };
          } catch (error) {
            console.error("Lỗi khi lấy dữ liệu thương hiệu:", error);
            return { branchId: shop.branchId, data: null };
          }
        }
        return { branchId: shop.branchId, data: null };
      });

      const branchDataResults = await Promise.all(branchDataPromises);
      const branchDataMap = branchDataResults.reduce(
        (acc, { branchId, data }) => {
          acc[branchId] = data;
          return acc;
        },
        {}
      );

      setBranchDataList(branchDataMap);
    };

    fetchBranchData();
  }, [cartItems]);

  const handleDeliveryOptionChange = (event, branchId) => {
    const newDeliveryOptions = {
      ...deliveryOptions,
      [branchId]: event.target.value,
    };
    setDeliveryOptions(newDeliveryOptions);
    onDeliveryOptionChange(newDeliveryOptions);
  };

  const handleAddressModalOpen = (branchId) => {
    setCurrentBranchId(branchId);
    setIsAddressModalOpen(true);
  };

  const handleAddressModalClose = () => {
    setIsAddressModalOpen(false);
  };

  const handleSelectAddress = (selectedAddress, branchId) => {
    setAddresses((prevAddresses) => ({
      ...prevAddresses,
      [branchId]: selectedAddress,
    }));
  };

  useEffect(() => {
    console.log("Selected items:", selectedItems);
  }, [selectedItems]);

  useEffect(() => {
    console.log("Selected items in CheckoutCart:", selectedItems);
  }, [selectedItems]);

  const handleNoteChange = (event) => {
    onNoteChange(event.target.value);
  };

  return (
    <div className="px-4 pt-4 bg-white">
      <div>
        <div className="grid grid-cols-4 items-center justify-center p-4 h-15">
          <div className="font-semibold text-xl text-center">Dịch vụ</div>
          <div className="font-semibold text-xl text-center">Đơn giá</div>
          <div className="font-semibold text-xl text-center">
            Số lượng (đôi giày)
          </div>
          <div className="font-semibold text-xl text-center">Thành tiền</div>
        </div>

        {selectedItems.map((shop) => {
          const branch = shop.branchId ? branchDataList[shop.branchId] : null;
          const shopName = branch ? branch.name : "Tên cửa hàng không có";
          const shopAddress = branch ? branch.address : "Địa chỉ không có";

          // Kiểm tra nếu có thông tin serviceName và serviceStatus
          const serviceName = shop.serviceName || null;
          const serviceStatus = shop.serviceStatus || null;

          const shopTotal = (shop.services || []).reduce(
            (shopTotal, service) => {
              if (!service) return shopTotal;
              const price =
                service.promotion && service.promotion.newPrice !== undefined
                  ? service.promotion.newPrice
                  : service.price;
              return shopTotal + price * (service.quantity || 0);
            },
            0
          );

          return (
            <div
              key={shop.branchId || shop.services?.[0]?.id}
              className="bg-white p-4 border border-[#002278] rounded-lg mb-8"
            >
              <div className="grid grid-cols-2 py-3 border-b bg-[#F9F1E7] px-4">
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faStore}
                    className="text-[#002278] mr-3"
                  />
                  <h2 className="text-xl font-medium text-[#002278] mr-2 max-w-sm break-words whitespace-normal overflow-hidden overflow-ellipsis">
                    {shopName}
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
                    {shopAddress}
                  </h2>
                </div>
              </div>

              {serviceName && serviceStatus && (
                <div className="mt-2">
                  <p>Tên dịch vụ: {serviceName}</p>
                  <p>Trạng thái dịch vụ: {serviceStatus}</p>
                </div>
              )}

              {(shop.services || []).map((service) => {
                if (!service) return null;
                const price =
                  service.promotion && service.promotion.newPrice !== undefined
                    ? service.promotion.newPrice
                    : service.price;
                const totalPrice = price * (service.quantity || 0);

                return (
                  <div
                    key={service.id}
                    className="grid grid-cols-4 items-center justify-center mt-2 py-2"
                  >
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
                      <span className="text-black">
                        {" "}
                        {service.quantity || 0}
                      </span>
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
                    onChange={handleNoteChange}
                  />
                </div>

                <div>
                  <h2 className="text-lg font-bold mb-2">Tùy chọn giao hàng</h2>
                  <div className="flex flex-col ">
                    <div
                      className={`mb-4 p-4 h-15 rounded-md ${
                        deliveryOptions[shop.branchId] === "delivery"
                          ? "bg-[#002278] text-white"
                          : "bg-white text-black"
                      } flex items-center justify-between h-29`}
                    >
                      <div className="flex flex-col">
                        <label className="flex items-center font-semibold text-xl">
                          <input
                            type="radio"
                            value="delivery"
                            checked={
                              deliveryOptions[shop.branchId] === "delivery"
                            }
                            onChange={(e) =>
                              handleDeliveryOptionChange(e, shop.branchId)
                            }
                            className="mr-2"
                          />
                          Giao hàng
                        </label>
                        <p
                          className={`ml-4 ${
                            deliveryOptions[shop.branchId] === "delivery"
                              ? "text-white"
                              : "text-black"
                          } break-words`}
                        >
                          {addresses[accountId] ? (
                            <>
                              {addresses[accountId].address},{" "}
                              {addresses[accountId].ward},<br />
                              {addresses[accountId].province},{" "}
                              {addresses[accountId].city}
                            </>
                          ) : (
                            "Đang tải địa chỉ..."
                          )}
                        </p>
                      </div>
                      <button
                        className="font-medium"
                        onClick={() => handleAddressModalOpen(shop.branchId)}
                      >
                        Thay đổi
                      </button>
                    </div>

                    <div
                      className={`p-4 h-15 rounded-md ${
                        deliveryOptions[shop.branchId] === "pickup"
                          ? "bg-[#002278] text-white"
                          : "bg-white text-black"
                      } flex items-center justify-between`}
                    >
                      <div className="flex flex-col">
                        <label className="flex items-center font-semibold text-xl">
                          <input
                            type="radio"
                            value="pickup"
                            checked={
                              deliveryOptions[shop.branchId] === "pickup"
                            }
                            onChange={(e) =>
                              handleDeliveryOptionChange(e, shop.branchId)
                            }
                            className="mr-2"
                          />
                          Lấy tại cửa hàng
                        </label>
                        <p
                          className={`ml-4 ${
                            deliveryOptions[shop.branchId] === "pickup"
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
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={handleAddressModalClose}
        accountId={accountId}
        onSelectAddress={(selectedAddress) =>
          handleSelectAddress(selectedAddress, currentBranchId)
        }
      />
    </div>
  );
};

export default CheckoutCart;
