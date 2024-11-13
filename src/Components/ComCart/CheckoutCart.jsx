import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStore,
  faMessage,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { getBranchByBranchId } from "../../api/branch";
import { calculateShippingFee } from "../../api/cart";

const CheckoutCart = ({ cartItems, onDeliveryOptionChange, onNoteChange, defaultAddress, onShippingFeesChange = () => {}, notes = {} }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  // console.log("cart", cartItems);
  const [branchDataList, setBranchDataList] = useState({});
  const location = useLocation();
  const { selectedItems } = location.state || { selectedItems: [] };
  const [deliveryOptions, setDeliveryOptions] = useState({});
  const [shippingFees, setShippingFees] = useState({});
  const [loadingShippingFees, setLoadingShippingFees] = useState({});
  const [allShopsHaveDeliveryOption, setAllShopsHaveDeliveryOption] = useState(false);

  useEffect(() => {
    const fetchBranchData = async () => {
      if (!cartItems || !Array.isArray(cartItems)) {
        // console.log("Không có dữ liệu giỏ hàng");
        return;
      }

      const branchDataPromises = cartItems.map(async (shop) => {
        if (shop?.branchId) {
          try {
            const data = await getBranchByBranchId(shop.branchId);
            return { branchId: shop.branchId, data };
          } catch (error) {
            console.error("Lỗi khi lấy dữ liệu thương hiệu:", error);
            return { branchId: shop.branchId, data: null };
          }
        }
        return { branchId: shop?.branchId || null, data: null };
      });

      const branchDataResults = await Promise.all(branchDataPromises);
      const branchDataMap = branchDataResults.reduce(
        (acc, { branchId, data }) => {
          if (branchId) {
            acc[branchId] = data;
          }
          return acc;
        },
        {}
      );

      setBranchDataList(branchDataMap);
    };

    fetchBranchData();
  }, [cartItems]);

  useEffect(() => {
    if (cartItems && Array.isArray(cartItems)) {
      cartItems.forEach(shop => {
        if (deliveryOptions[shop.branchId] === "delivery" && defaultAddress?.id) {
          const totalQuantity = shop.services.reduce((total, service) => {
            return total + (service?.quantity || 0);
          }, 0);
          calculateShippingFeeForBranch(shop.branchId, totalQuantity, defaultAddress.id);
        }
      });
    }
  }, [defaultAddress, deliveryOptions, cartItems]);

  useEffect(() => {
    if (onShippingFeesChange) {
      onShippingFeesChange(shippingFees);
    }
  }, [shippingFees, onShippingFeesChange]);

  useEffect(() => {
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      setAllShopsHaveDeliveryOption(false);
      return;
    }

    const allShopsSelected = cartItems.every(shop => 
      deliveryOptions[shop.branchId] === 'delivery' || deliveryOptions[shop.branchId] === 'pickup'
    );
    
    setAllShopsHaveDeliveryOption(allShopsSelected);
    onDeliveryOptionChange({ isValid: allShopsSelected, options: deliveryOptions });
  }, [deliveryOptions, cartItems]);

  const handleDeliveryOptionChange = (branchId, value) => {
    setDeliveryOptions((prevOptions) => {
      const newOptions = {
        ...prevOptions,
        [branchId]: value,
      };
      
      onDeliveryOptionChange({ 
        isValid: true, 
        options: newOptions,
        deliveryType: value 
      });
      
      return newOptions;
    });

    if (value === "delivery" && defaultAddress?.id) {
      const shop = cartItems.find(item => item.branchId === branchId);
      if (shop) {
        const totalQuantity = shop.services.reduce((total, service) => {
          return total + (service?.quantity || 0);
        }, 0);
        calculateShippingFeeForBranch(branchId, totalQuantity, defaultAddress.id);
      }
    } else {
      setShippingFees(prev => ({...prev, [branchId]: 0}));
    }
  };

  const handleNoteChange = (e, branchId) => {
    const newNote = e.target.value;
    onNoteChange({ branchId, note: newNote });
  };

  const calculateShippingFeeForBranch = async (branchId, totalQuantity, selectedAddressId) => {
    if (!selectedAddressId) {
      console.log("Không có địa chỉ!");
      return;
    }
    
    setLoadingShippingFees(prev => ({...prev, [branchId]: true}));
    try {
      console.log("Gửi request tính phí ship với:", {
        addressId: selectedAddressId,
        branchId,
        quantity: totalQuantity
      });

      const fee = await calculateShippingFee({
        addressId: selectedAddressId,
        branchId,
        quantity: totalQuantity
      });
      
      console.log("Kết quả tính phí ship:", {
        branchId,
        fee,
        totalQuantity,
        addressId: selectedAddressId
      });
      
      setShippingFees(prev => ({...prev, [branchId]: fee}));
    } catch (error) {
      console.error("Lỗi khi tính phí ship:", error);
    } finally {
      setLoadingShippingFees(prev => ({...prev, [branchId]: false}));
    }
  };

  return (
    <div className="px-4 py-4 bg-white mb-4">
      <div className="grid grid-cols-4 items-center justify-center p-4 h-15">
        <div className="font-semibold text-xl text-center">Dịch vụ</div>
        <div className="font-semibold text-xl text-center">Đơn giá</div>
        <div className="font-semibold text-xl text-center">
          Số lượng (đôi giày)
        </div>
        <div className="font-semibold text-xl text-center">Thành tiền</div>
      </div>

      {cartItems.map((shop) => {
        let shopName, shopAddress;

        if (shop.branchId) {
          // Dữ liệu từ trang Cart
          const branchData = branchDataList[shop.branchId];
          shopName = branchData ? branchData.name : "Tên cửa hàng không có";
          shopAddress = branchData ? branchData.address : "Địa chỉ không có";
        } else {
          // Dữ liệu từ trang ServiceDetail
          const branch = shop.services?.[0]?.branchServices?.[0]?.branch;
          shopName = branch ? branch.name : "Tên cửa hàng không có";
          shopAddress = branch ? branch.address : "Địa chỉ không có";
        }

        const shopTotal = (shop.services || []).reduce((shopTotal, service) => {
          if (!service) return shopTotal;
          const price =
            service.promotion && service.promotion.newPrice !== undefined
              ? service.promotion.newPrice
              : service.price;
          return shopTotal + price * (service.quantity || 0);
        }, 0);

        return (
          <div
            key={shop.branchId}
            className="bg-white p-4 border border-[#002278] rounded-lg mb-4"
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
                  onChange={(e) => handleNoteChange(e, shop.branchId)}
                  value={notes[shop.branchId] || ''}
                />
              </div>

              <div>
                <h2 className="text-lg font-bold mb-2">Tùy chọn giao hàng</h2>
                <div className="flex flex-col">
                  <div
                    className={`mb-4 p-4 rounded-md ${
                      deliveryOptions[shop.branchId] === "delivery"
                        ? "bg-[#002278] text-white"
                        : "bg-white text-black"
                    } flex items-center justify-between`}
                  >
                    <div className="flex flex-col">
                      <label className="flex items-center font-semibold text-xl">
                        <input
                          type="radio"
                          value="delivery"
                          checked={
                            deliveryOptions[shop.branchId] === "delivery"
                          }
                          onChange={() =>
                            handleDeliveryOptionChange(
                              shop.branchId,
                              "delivery"
                            )
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
                        }`}
                      >
                        Đơn hàng sẽ giao tại địa chỉ của bạn
                      </p>
                    </div>
                    {deliveryOptions[shop.branchId] === "delivery" && (
                      <div className="text-right">
                        {loadingShippingFees[shop.branchId] ? (
                          <span className="font-medium"></span>
                        ) : (
                          <>
                            {/* {console.log("Hiển thị phí ship:", {
                              branchId: shop.branchId,
                              fee: shippingFees[shop.branchId]
                            })} */}
                            <span className="font-medium">
                              {shippingFees[shop.branchId]?.toLocaleString() || "0"} đ
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div
                    className={`p-4 rounded-md ${
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
                          checked={deliveryOptions[shop.branchId] === "pickup"}
                          onChange={() =>
                            handleDeliveryOptionChange(shop.branchId, "pickup")
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
  );
};

export default CheckoutCart;
