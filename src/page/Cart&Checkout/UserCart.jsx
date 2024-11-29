import React, { useEffect, useState } from "react";
import ShopCart from "../../Components/ComCart/ShopCart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserCart, deleteCartItem } from "../../api/cart";
import { getServiceById } from "../../api/service";
import { getMaterialById } from "../../api/material";

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [branches, setBranches] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [savingsAmount, setSavingsAmount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null;

  const calculateTotalAmount = (items) => {
    return items.reduce((total, shop) => {
      return (
        total +
        shop.services.reduce((serviceTotal, service) => {
          const materialPrice = service.materialPrice || 0;
          const price = service.promotion?.newPrice || service.price;
          return serviceTotal + (price + materialPrice);
        }, 0)
      );
    }, 0);
  };

  const fetchCartItems = async () => {
    try {
      console.log("Fetching cart items for userId:", userId);
      const response = await getUserCart(userId);
      console.log("Response from getUserCart:", response);

      const dataArray = response.cartItems;
      setBranches(dataArray);

      console.log("Dữ liệu giỏ hàng:", dataArray);

      const detailedItems = await Promise.all(
        dataArray.flatMap((branch) =>
          (branch.items || []).map(async (item) => {
            const serviceDetails = await getServiceById(item.serviceId);
            const imageUrl = serviceDetails.assetUrls?.[0]?.url || "";
            let materialPrice = 0;

            if (item.materials && item.materials.length > 0) {
              materialPrice = item.materials.reduce((total, material) => total + material.price, 0);
            }

            return {
              id: item.id,
              branchId: branch.branchId,
              shopName: branch.shopName,
              shopAddress: branch.shopAddress,
              name: serviceDetails.name,
              image: imageUrl,
              price: serviceDetails.price,
              promotion: serviceDetails.promotion,
              quantity: item.quantity,
              selected: false,
              status: serviceDetails.status,
              isAvailable: serviceDetails.status !== "UNAVAILABLE",
              material: item.materials.map(m => m.name).join(", ") || "",
              materialPrice: materialPrice,
            };
          })
        )
      );

      console.log("Dữ liệu chi tiết giỏ hàng:", detailedItems);

      const groupedItems = detailedItems.reduce((acc, item) => {
        const branch = acc.find((b) => b.branchId === item.branchId);
        if (branch) {
          branch.services.push(item);
        } else {
          acc.push({
            branchId: item.branchId,
            shopName: item.shopName,
            shopAddress: item.shopAddress,
            services: [item],
          });
        }
        return acc;
      }, []);

      setCartItems(groupedItems);
      const newTotal = calculateTotalAmount(groupedItems);
      setTotalAmount(newTotal);
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error.message);
      setCartItems([]);
      setTotalAmount(0);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [userId]);

  useEffect(() => {
    if (location.state?.service) {
      const newService = { ...location.state.service };
      setCartItems((prevItems) => {
        const shopIndex = prevItems.findIndex(
          (shop) => shop.shopName === newService.shopName
        );
        if (shopIndex !== -1) {
          const serviceIndex = prevItems[shopIndex].services.findIndex(
            (service) => service.id === newService.id
          );
          if (serviceIndex === -1) {
            const updatedShops = [...prevItems];
            updatedShops[shopIndex].services.push(newService);
            return updatedShops;
          }
          return prevItems;
        } else {
          return [
            ...prevItems,
            {
              shopName: newService.shopName,
              shopAddress: newService.shopAddress,
              services: [newService],
            },
          ];
        }
      });
    }
  }, [location.state]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const calculateTotalAmount = () => {
      return cartItems.reduce((sum, shop) => {
        return (
          sum +
          shop.services.reduce((serviceSum, service) => {
            return (
              serviceSum +
              (service.selected
                ? (service.promotion?.newPrice || service.price) +
                  (service.materialPrice || 0)
                : 0)
            );
          }, 0)
        );
      }, 0);
    };

    const total = calculateTotalAmount();
    setTotalAmount(total);
    setSavingsAmount(calculateSavings(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (cartItems.length === 0) {
      fetchCartItems();
    }
  }, [cartItems]);

  useEffect(() => {
    // console.log("CartItems đã cập nhật:", cartItems);
  }, [cartItems]);

  const handleCheckout = () => {
    const selectedItems = cartItems
      .filter((shop) => shop.services.some((service) => service.selected))
      .map((shop) => ({
        branchId: shop.branchId,
        shopName: shop.shopName,
        shopAddress: shop.shopAddress,
        services: shop.services.filter((service) => service.selected),
      }));

    if (selectedItems.length === 0) {
      setShowPopup(true);
    } else {
      console.log("Selected items for checkout:", selectedItems);
      navigate("/checkout", { state: { selectedItems } });
    }
  };

  const handleClosePopup = () => setShowPopup(false);

  const handleRemove = async (serviceId) => {
    try {
      await deleteCartItem(serviceId);
      setCartItems((prevShops) =>
        prevShops
          .map((shop) => ({
            ...shop,
            services: shop.services.filter(
              (service) => service.id !== serviceId
            ),
          }))
          .filter((shop) => shop.services.length > 0)
      );
      // console.log("Item removed successfully");
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const selectedServiceCount = cartItems.reduce((count, shop) => {
    if (!shop || !Array.isArray(shop.services)) return count;
    return count + shop.services.filter((service) => service.selected).length;
  }, 0);

  const handleSelectAll = (branchId) => {
    setCartItems((prevShops) =>
      prevShops.map((shop) =>
        shop.branchId === branchId
          ? {
              ...shop,
              services: shop.services.map((service) => ({
                ...service,
                selected: service.isAvailable
                  ? !shop.services.every((s) => s.selected)
                  : false,
              })),
            }
          : shop
      )
    );
  };
  const handleSelect = (serviceId) => {
    setCartItems((prevShops) =>
      prevShops.map((shop) => ({
        ...shop,
        services: shop.services.map((service) =>
          service.id === serviceId
            ? {
                ...service,
                selected: service.isAvailable ? !service.selected : false,
              }
            : service
        ),
      }))
    );
  };

  const handleSelectAllShops = () => {
    const allSelected = cartItems.every((shop) =>
      shop.services.every((service) =>
        service.isAvailable ? service.selected : true
      )
    );

    setCartItems((prevShops) =>
      prevShops.map((shop) => ({
        ...shop,
        services: shop.services.map((service) => ({
          ...service,
          selected: service.isAvailable ? !allSelected : false,
        })),
      }))
    );
  };

  const handleRemoveSelectedItems = async () => {
    const selectedItems = cartItems.flatMap((shop) =>
      shop.services
        .filter((service) => service.selected)
        .map((service) => service.id)
    );

    try {
      await Promise.all(selectedItems.map((itemId) => deleteCartItem(itemId)));
      setCartItems((prevShops) =>
        prevShops
          .map((shop) => ({
            ...shop,
            services: shop.services.filter((service) => !service.selected),
          }))
          .filter((shop) => shop.services.length > 0)
      );
      // console.log("Selected items removed successfully");
    } catch (error) {
      console.error("Error removing selected items:", error);
    }
  };

  const calculateSavings = (items) => {
    return items.reduce((totalSavings, shop) => {
      return (
        totalSavings +
        shop.services.reduce((shopSavings, service) => {
          if (service.selected) {
            const originalPrice = service.price;
            const discountedPrice =
              service.promotion?.newPrice || service.price;
            const savingPerUnit = originalPrice - discountedPrice;
            const quantity = service.quantity || 1;
            const totalServiceSaving = savingPerUnit * quantity;

            // console.log({
            //   serviceName: service.name,
            //   savingPerUnit,
            //   quantity,
            //   totalServiceSaving,
            // });

            return shopSavings + totalServiceSaving;
          }
          return shopSavings;
        }, 0)
      );
    }, 0);
  };

  const handleQuantityChange = (id, newQuantity) => {
    setCartItems((prevShops) =>
      prevShops.map((shop) => ({
        ...shop,
        services: shop.services.map((service) => {
          if (service.id === id) {
            return {
              ...service,
              quantity: 1,
            };
          }
          return service;
        }),
      }))
    );
  };

  return (
    <div>
      <h1 className="text-3xl text-[#002278] font-bold bg-white w-full text-center py-4">
        Giỏ hàng
      </h1>
      <div className="auto px-4 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center">
              <FontAwesomeIcon
                icon={faCartShopping}
                className="text-[#002278] text-6xl h-20 w-20 mb-3"
              />
              <h2 className="text-[#002278] text-3xl font-bold mb-2">
                0 Dịch vụ
              </h2>
              <p className="text-gray-500 text-xl">Giỏ hàng của bạn trống</p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-3 h-15 p-4 bg-white border border-[#002278]">
                <div className="font-semibold text-xl text-left flex items-center w-full">
                  <input
                    type="checkbox"
                    checked={cartItems.every((shop) =>
                      shop.services.every((service) => service.selected)
                    )}
                    onChange={handleSelectAllShops}
                    className="mr-2"
                  />
                  <h2 className="text-left">Dịch vụ</h2>
                </div>
                <div className="font-semibold text-xl text-center">Đơn giá</div>
                <div className="flex flex-row items-center">
                  <div className="font-semibold text-xl text-center w-[70%] pr-6">
                    Thành tiền
                  </div>
                </div>
              </div>
              {cartItems &&
                cartItems.map((item) => (
                  <ShopCart
                    key={item.branchId}
                    shop={item}
                    userId={userId}
                    setCartItems={setCartItems}
                    setTotalAmount={setTotalAmount}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemove}
                    onSelectAll={handleSelectAll}
                    onSelect={handleSelect}
                  />
                ))}
            </div>
          )}
          {branches.length > 0 && (
            <div className="flex items-center justify-between bg-white p-4 rounded-lg mt-4">
              <div className="flex items-center text-xl">
                <input
                  type="checkbox"
                  checked={cartItems.every((shop) =>
                    shop.services.every((service) => service.selected)
                  )}
                  onChange={handleSelectAllShops}
                  className="mr-4"
                />
                <span className="font-bold">Chọn tất cả</span>
                <button
                  onClick={handleRemoveSelectedItems}
                  className="ml-4 text-gray-500"
                >
                  Xóa
                </button>
              </div>
              <div className="text-right">
                <div className="text-xl">
                  <span>
                    Tổng tiền dịch vụ: {totalAmount.toLocaleString()} đ
                  </span>
                </div>
                <div className="text-lg">
                  <span>({selectedServiceCount} dịch vụ)</span>
                </div>
                <div className="text-lg">
                  <span>Tiết kiệm: {savingsAmount.toLocaleString()} đ</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="bg-[#002278] text-white px-4 py-2 rounded text-xl"
              >
                Đặt dịch vụ
              </button>
            </div>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative h-50 w-90 flex flex-col justify-center items-center">
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 text-gray-700 hover:text-black text-3xl"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <h2 className="text-2xl font-semibold mb-2 text-center text-[#002278]">
              Bạn chưa chọn dịch vụ nào!
            </h2>
            <p className="text-lg text-gray-500 text-center">
              Vui lòng chọn dịch vụ để đặt hàng
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCart;
