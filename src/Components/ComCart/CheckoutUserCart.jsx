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
import { Modal, Image } from "antd";
import { getCartItems } from "../../api/cart";

const CheckoutUserCart = ({
  cartItems,
  onDeliveryOptionChange,
  onNoteChange,
  defaultAddress,
  onShippingFeesChange = () => {},
  notes: initialNotes = {},
}) => {
  const user = JSON.parse(localStorage.getItem("user"));
  // console.log("cart", cartItems);
  const [branchDataList, setBranchDataList] = useState({});
  const location = useLocation();
  const { selectedItems } = location.state || { selectedItems: [] };
  const [deliveryOptions, setDeliveryOptions] = useState({});
  const [shippingFees, setShippingFees] = useState({});
  const [loadingShippingFees, setLoadingShippingFees] = useState({});
  const [allShopsHaveDeliveryOption, setAllShopsHaveDeliveryOption] =
    useState(false);
  const [notes, setNotes] = useState(initialNotes);

  useEffect(() => {
    const fetchBranchData = async () => {
      console.log("Dữ liệu giỏ hàng:", cartItems);
      if (!cartItems || !Array.isArray(cartItems)) {
        console.log("Không có dữ liệu giỏ hàng");
        return;
      }

      const branchDataPromises = cartItems.map(async (shop) => {
        if (shop?.branchId) {
          try {
            const data = await getBranchByBranchId(shop.branchId);
            console.log("Dữ liệu chi nhánh:", data);
            const cartData = await getCartItems(shop.id);
            console.log("Dữ liệu giỏ hàng:", cartData);
            return { branchId: shop.branchId, data, cartData };
          } catch (error) {
            console.error("Lỗi khi lấy dữ liệu thương hiệu:", error);
            return { branchId: shop.branchId, data: null, cartData: null };
          }
        }
        return { branchId: shop?.branchId || null, data: null, cartData: null };
      });

      const branchDataResults = await Promise.all(branchDataPromises);
      const branchDataMap = branchDataResults.reduce(
        (acc, { branchId, data, cartData }) => {
          if (branchId) {
            acc[branchId] = { data, cartData };
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
      cartItems.forEach((shop) => {
        if (
          deliveryOptions[shop.branchId] === "delivery" &&
          defaultAddress?.id
        ) {
          calculateShippingFeeForBranch(shop.branchId, defaultAddress.id);
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

    const allShopsSelected = cartItems.every(
      (shop) =>
        deliveryOptions[shop.branchId] === "delivery" ||
        deliveryOptions[shop.branchId] === "pickup"
    );

    setAllShopsHaveDeliveryOption(allShopsSelected);
    onDeliveryOptionChange({
      isValid: allShopsSelected,
      options: deliveryOptions,
    });
  }, [deliveryOptions, cartItems]);

  const handleDeliveryOptionChange = (branchId, value) => {
    console.log("Thay đổi tùy chọn giao hàng:", branchId, value);
    setDeliveryOptions((prevOptions) => {
      const newOptions = {
        ...prevOptions,
        [branchId]: value,
      };

      onDeliveryOptionChange({
        isValid: true,
        options: newOptions,
        deliveryType: value,
      });

      return newOptions;
    });

    if (value === "delivery" && defaultAddress?.id) {
      const shop = cartItems.find((item) => item.branchId === branchId);
      if (shop) {
        calculateShippingFeeForBranch(branchId, defaultAddress.id);
      }
    } else {
      setShippingFees((prev) => ({ ...prev, [branchId]: 0 }));
    }
  };

  const handleNoteChange = (e, branchId, serviceId) => {
    const newNote = e.target.value;
    onNoteChange({ branchId, serviceId, note: newNote });

    // Cập nhật ghi chú trong notes
    setNotes((prevNotes) => ({
      ...prevNotes,
      [serviceId]: newNote, // Cập nhật ghi chú cho serviceId tương ứng
    }));

    const cartItem = cartItems.find((item) => item.branchId === branchId);
    if (cartItem) {
      const service = cartItem.services.find(
        (service) => service.id === serviceId
      );
      if (service) {
        service.note = newNote;
      }
    }
  };

  const calculateShippingFeeForBranch = async (branchId, selectedAddressId) => {
    console.log(
      "Tính phí giao hàng cho:",
      branchId,
      "với địa chỉ:",
      selectedAddressId
    );
    if (!selectedAddressId) {
      console.log("Không có địa chỉ!");
      return;
    }

    const quantity =
      cartItems.find((shop) => shop.branchId === branchId)?.services.length ||
      0;

    setLoadingShippingFees((prev) => ({ ...prev, [branchId]: true }));
    try {
      console.log("Gửi request tính phí ship với:", {
        addressId: selectedAddressId,
        branchId,
        quantity,
      });

      const fee = await calculateShippingFee({
        addressId: selectedAddressId,
        branchId,
        quantity,
      });

      console.log("Kết quả tính phí ship:", {
        branchId,
        fee,
        addressId: selectedAddressId,
      });

      // Kiểm tra nếu API trả về lỗi không hỗ trợ ship
      if (fee.error && fee.error.includes("Không hỗ trợ ship")) {
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

        // Tự động chuyển về pickup
        handleDeliveryOptionChange(branchId, "pickup");
        return;
      }

      setShippingFees((prev) => ({ ...prev, [branchId]: fee }));
    } catch (error) {
      console.error("Lỗi khi tính phí ship:", error);
      // Xử lý lỗi và hiển thị thông báo
      Modal.error({
        title: "Lỗi",
        content: "Có lỗi xảy ra khi tính phí giao hàng. Vui lòng thử lại sau.",
        okText: "Đồng ý",
        centered: true,
        okButtonProps: {
          className:
            "bg-[#002278] hover:bg-[#001a5e] border-[#002278] text-white",
        },
      });
    } finally {
      setLoadingShippingFees((prev) => ({ ...prev, [branchId]: false }));
    }
  };

  const getMaterialById = async (materialId) => {
    // Giả sử bạn có một API để lấy thông tin phụ kiện
    const response = await fetch(`/api/materials/${materialId}`);
    const data = await response.json();
    return data.price; // Trả về giá của phụ kiện
  };

  const handleMaterialFetch = async (materialId) => {
    const materialPrice = await getMaterialById(materialId);
    console.log("Giá phụ kiện:", materialPrice);
  };

  return (
    <div className="px-4 py-4 bg-white mb-4">
      <div className="grid grid-cols-3 items-center justify-center p-4 h-15">
        <div className="font-semibold text-xl text-center">Dịch vụ</div>
        <div className="font-semibold text-xl text-center">Đơn giá</div>
        <div className="font-semibold text-xl text-center">Thành tiền</div>
      </div>

      {cartItems.map((shop) => {
        let shopName, shopAddress;

        if (shop.branchId) {
          // Dữ liu từ trang Cart
          const branchData = branchDataList[shop.branchId];
          shopName = branchData
            ? branchData.data?.name || "Tên cửa hàng không có"
            : "Tên cửa hàng không có";
          shopAddress = branchData
            ? branchData.data?.address || "Địa chỉ không có"
            : "Địa chỉ không có";
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
          return shopTotal + price + (service.materialPrice || 0);
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
              const totalPrice = price + (service.materialPrice || 0);

              return (
                <div
                  key={service.id}
                  className="grid grid-cols-3 items-center justify-center mt-2 py-2"
                >
                  <div className="flex items-center">
                    <div className="w-16 h-16 mr-4">
                      {service.image ? (
                        <Image
                          src={service.image}
                          alt={service.name}
                          className="object-cover w-full h-full rounded"
                          fallback="data:image/png;base64,..."
                          preview={{
                            mask: "Xem ảnh",
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded">
                          <span className="text-gray-400 text-xs text-center">
                            Không có ảnh
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#002278] max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
                        {service.name}
                      </span>
                      {service.materialName ? (
                        <span className="text-gray-600">
                          Phụ kiện: {service.materialName}
                        </span>
                      ) : (
                        service.material && (
                          <span className="text-gray-600">
                            Phụ kiện: {service.material}
                          </span>
                        )
                      )}
                      {service.materialPrice > 0 && (
                        <div className="text-sm text-gray-600">
                          Giá phụ kiện: {service.materialPrice.toLocaleString()}{" "}
                          đ
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="items-center justify-center text-center">
                    <span className="text-black text-right max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
                      {price.toLocaleString()} đ
                    </span>
                  </div>

                  <div className="items-center justify-center text-center">
                    <span className="text-black text-right max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
                      {totalPrice.toLocaleString()} đ
                    </span>
                  </div>

                  <div className="col-span-3 mt-2">
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded h-20"
                      placeholder="Lưu ý cho dịch vụ..."
                      onChange={(e) =>
                        handleNoteChange(e, shop.branchId, service.id)
                      }
                      value={notes[service.id] || ""}
                    />
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

            <div className="mt-2 border-t border-gray-300 p-4">
              <h2 className="text-lg font-bold mb-2">Tùy chọn giao hàng</h2>
              <div className="flex justify-between">
                <div
                  className={`mb-4 p-4 rounded-md w-1/2 mr-2 ${
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
                        checked={deliveryOptions[shop.branchId] === "delivery"}
                        onChange={() =>
                          handleDeliveryOptionChange(shop.branchId, "delivery")
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
                        <span className="font-medium">
                          {shippingFees[shop.branchId]?.toLocaleString() || "0"}{" "}
                          đ
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div
                  className={`mb-4 p-4 rounded-md w-1/2 ml-2 ${
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
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutUserCart;
