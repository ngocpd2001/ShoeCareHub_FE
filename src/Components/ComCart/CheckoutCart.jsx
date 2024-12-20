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
import { getMaterialById } from "../../api/material";

const CheckoutCart = ({
  cartItems,
  onDeliveryOptionChange,
  onNoteChange,
  defaultAddress,
  onShippingFeesChange = () => {},
  notes: initialNotes = {},
  materials,
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
  const [materialData, setMaterialData] = useState({});

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

  // useEffect(() => {
  //   // Kiểm tra xem giỏ hàng có vật liệu nào không
  //   const hasMaterials = cartItems.some(
  //     (shop) => shop.materials && shop.materials.length > 0
  //   );
  //   if (hasMaterials) {
  //     console.log("Giỏ hàng có vật liệu.");
  //   } else {
  //     console.log("Giỏ hàng không có vật liệu.");
  //   }
  // }, [cartItems]);

  const handleDeliveryOptionChange = (branchId, value) => {
    setDeliveryOptions((prevOptions) => {
      const newOptions = {
        ...prevOptions,
        [branchId]: value,
      };

      const materialsIds = cartItems.flatMap(
        (shop) =>
          shop.services?.flatMap(
            (service) => service.materials?.map((material) => material.id) || []
          ) || []
      );

      onShippingFeesChange({
        isValid: true,
        options: newOptions,
        deliveryType: value,
        materialIds: materialsIds,
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

  const handleMaterial = async (materialId) => {
    try {
      const materialData = await getMaterialById(materialId);
      console.log("Dữ liệu vật liệu:", materialData);

      if (
        materialData &&
        materialData.data &&
        Array.isArray(materialData.data.assetUrls)
      ) {
        const assetUrls = materialData.data.assetUrls.map((asset) => asset.url);
        console.log("Asset URLs:", assetUrls);
        return assetUrls; // Trả về danh sách URL ảnh
      } else {
        console.error("Không có assetUrls hợp lệ:", materialId);
        return [];
      }
    } catch (error) {
      console.error("Lỗi khi fetch vật liệu:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchMaterials = async () => {
      const materialsPromises = cartItems.flatMap((shop) =>
        shop.services?.flatMap((service) =>
          service.materials?.map(async (material) => {
            const data = await handleMaterial(material.id);
            return { ...material, assetUrls: data }; // Ghi lại dữ liệu vật liệu
          }) || []
        ) || []
      );

      const materialsResults = await Promise.all(materialsPromises);
      const materialsMap = {};
      materialsResults.forEach((material) => {
        if (material) {
          materialsMap[material.id] = material;
        }
      });
      setMaterialData(materialsMap); // Lưu trữ dữ liệu vật liệu vào state
    };

    fetchMaterials();
  }, [cartItems]);

  cartItems.forEach((shop) => {
    shop.services.forEach((service) => {
      if (service.materials) {
        service.materials.forEach((material) => {
          console.log("Material ID:", material.id);
        });
      }
    });
  });

  return (
    <div className="px-4 py-4 bg-white mb-4">
      <div className="grid grid-cols-2 items-center justify-center p-4 h-15">
        <div className="font-semibold text-xl text-center">Dịch vụ</div>
        <div className="font-semibold text-xl text-center">Đơn giá</div>
      </div>

      {cartItems.map((shop) => {
        let shopName, shopAddress;

        if (shop.branchId) {
          // Dữ liệu t trang Cart
          const branchData = branchDataList[shop.branchId];
          shopName = branchData ? branchData.name : "Tên cửa hàng không có";
          shopAddress = branchData ? branchData.address : "Địa chỉ không có";
        } else {
          // D liệu từ trang ServiceDetail
          const branch = shop.services?.[0]?.branchServices?.[0]?.branch;
          shopName = branch ? branch.name : "Tên cửa hàng không có";
          shopAddress = branch ? branch.address : "Địa chỉ không có";
        }

        const shopTotal = (shop.services || []).reduce((shopTotal, service) => {
          if (!service) return shopTotal;
          const servicePrice =
            service.promotion && service.promotion.newPrice !== undefined
              ? service.promotion.newPrice
              : service.price;

          const materialsPrice = (service.materials || []).reduce(
            (total, material) => {
              return total + (material.price || 0);
            },
            0
          );

          return shopTotal + servicePrice + materialsPrice;
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

            {shop.services.map((service) => (
              <div key={service.id} className="mb-4">
                <div className="grid grid-cols-2 items-center justify-center mt-2 py-2">
                  <div className="flex items-center">
                    <div className="w-16 h-16 mr-4">
                      {service.assetUrls && service.assetUrls.length > 0 ? (
                        <Image
                          src={service.assetUrls[0].url}
                          alt={service.name}
                          className="object-cover w-full h-full rounded"
                          fallback="data:image/png;base64,..."
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
                    </div>
                  </div>
                  <div className="items-center justify-center text-center">
                    <span className="text-black text-right max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
                      {service.promotion &&
                      service.promotion.newPrice !== undefined
                        ? service.promotion.newPrice.toLocaleString()
                        : service.price.toLocaleString()}{" "}
                      đ
                    </span>
                  </div>
                </div>

                {service.materials &&
                  service.materials.length > 0 &&
                  service.materials.map((material) => {
                    const materialInfo = materialData[material.id]; // Lấy dữ liệu từ state
                    return (
                      <div
                        key={material.id}
                        className="grid grid-cols-2 items-center justify-center mt-2 py-2"
                      >
                        <div className="flex items-center">
                          <div className="w-16 h-16 mr-4">
                            {materialInfo?.assetUrls && materialInfo.assetUrls.length > 0 ? (
                              <Image
                                src={materialInfo.assetUrls[0]}
                                alt={materialInfo.name}
                                className="object-cover w-full h-full rounded"
                                fallback="data:image/png;base64,..."
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
                              {materialInfo?.name}
                            </span>
                            <span className="mt-1 border border-red-500 text-red-500 bg-white px-1 py-0.5 rounded text-sm w-16">
                                Phụ kiện
                              </span>
                          </div>
                        </div>
                        <div className="items-center justify-center text-center">
                          <span className="text-black text-right max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
                            {materialInfo?.price
                              ? materialInfo.price.toLocaleString()
                              : "0"}{" "}
                            đ
                          </span>
                        </div>
                      </div>
                    );
                  })}

                <div className="col-span-2 mt-2">
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
            ))}

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

export default CheckoutCart;
