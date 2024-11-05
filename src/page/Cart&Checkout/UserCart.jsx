import React, { useEffect, useState } from "react";
import ShopCart from "../../Components/ComCart/ShopCart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserCart, createCart, deleteCart } from "../../api/cart";
import { getServiceById } from "../../api/service";

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null;

  const fetchCartItems = async () => {
    try {
      const data = await getUserCart(userId);
      setBranches(data || []);
      console.log("data:", data);

      const detailedItems = await Promise.all(
        (data || []).flatMap((branch) =>
          (branch.items || []).map(async (item) => {
            const serviceDetails = await getServiceById(item.serviceId);
            return {
              id: item.id,
              branchId: branch.branchId,
              shopName: branch.shopName,
              shopAddress: branch.shopAddress,
              name: serviceDetails.name,
              image: serviceDetails.image,
              price: item.price,
              promotion: serviceDetails.promotion,
              quantity: item.quantity,
              selected: false,
            };
          })
        )
      );

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
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
      setCartItems([]);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [userId]);

  useEffect(() => {
    if (location.state?.service) {
      const newService = { ...location.state.service, quantity: 1 };
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

  const handleCheckout = () => {
    const selectedItems = cartItems.filter((shop) => shop.services.some((service) => service.selected)).map((shop) => ({
      branchId: shop.branchId,
      shopName: shop.shopName,
      shopAddress: shop.shopAddress,
      services: shop.services.filter((service) => service.selected),
    }));
  
    if (selectedItems.length === 0) {
      setShowPopup(true);
    } else {
      navigate("/checkout", { state: { selectedItems } });
    }
  };

  const handleClosePopup = () => setShowPopup(false);

  const handleQuantityChange = (id, delta) => {
    setCartItems((prevShops) =>
      (prevShops || []).map((shop) => ({
        ...shop,
        services: (shop.services || []).map((service) =>
          service.id === id
            ? { ...service, quantity: Math.max(service.quantity + delta, 1) }
            : service
        ),
      }))
    );
  };

  const handleRemove = async (id) => {
    try {
      await deleteCart(id);
      await fetchCartItems();
    } catch (error) {
      console.error("Lỗi khi xóa mục:", error);
    }
  };

  const handleCreateCart = async () => {
    if (userId) {
      try {
        const newCart = await createCart(userId);
        setCartItems([]);
        console.log("New cart created:", newCart);
      } catch (error) {
        console.error("Error creating a new cart:", error);
      }
    }
  };

  const handleClearCart = async () => {
    if (cartItems.length > 0) {
      try {
        await deleteCart(cartItems[0].id);
        setCartItems([]);
        console.log("Cart cleared successfully");
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    }
  };

  const totalAmount = cartItems.reduce((total, shop) => {
    if (!shop || !Array.isArray(shop.services)) return total;
    return (
      total +
      shop.services.reduce(
        (shopTotal, service) =>
          service.selected
            ? shopTotal +
              (service.promotion?.newPrice || service.price || 0) *
                service.quantity
            : shopTotal,
        0
      )
    );
  }, 0);

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
                selected: !shop.services.every((s) => s.selected),
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
            ? { ...service, selected: !service.selected }
            : service
        ),
      }))
    );
  };

  const handleSelectAllShops = () => {
    const allSelected = cartItems.every((shop) =>
      shop.services.every((service) => service.selected)
    );
    setCartItems((prevShops) =>
      prevShops.map((shop) => ({
        ...shop,
        services: shop.services.map((service) => ({
          ...service,
          selected: !allSelected,
        })),
      }))
    );
  };

  return (
    <div className="auto px-4 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl text-[#002278] font-bold mb-4">Giỏ hàng</h1>
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
            <div className="grid grid-cols-4 h-15 p-4 bg-white border border-[#002278]">
              <div className="font-semibold text-xl text-left flex items-center w-full">
                <input
                  type="checkbox"
                  checked={cartItems.every((shop) =>
                    shop.services.every((service) => service.selected)
                  )}
                  onChange={handleSelectAllShops}
                  className="mr-2"
                />
                <h2 className="text-left">Sản phẩm</h2>
              </div>
              <div className="font-semibold text-xl text-center">Đơn giá</div>
              <div className="font-semibold text-xl text-center pr-8">
                Số lượng
              </div>
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
              <button onClick={handleClearCart} className="ml-4 text-gray-500">
                Xóa
              </button>
              <button
                onClick={handleSelectAllShops}
                className="ml-4 text-gray-500"
              >
                Chọn tất cả
              </button>
            </div>
            <div className="text-right">
              <div className="text-xl">
                <span>Tổng thanh toán: {totalAmount.toLocaleString()} đ</span>
              </div>
              <div className="text-lg">
                <span>({selectedServiceCount} dịch vụ)</span>
              </div>
              <div className="text-lg">
                <span>Tiết kiệm: </span>
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
