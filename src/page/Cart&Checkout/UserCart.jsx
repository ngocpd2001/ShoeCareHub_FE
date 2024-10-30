import React, { useEffect, useState } from "react";
import ShopCart from "../../Components/ComCart/ShopCart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserCart, createCart, deleteCart } from "../../api/cart";
import { getServiceById } from "../../api/service";

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null;

  useEffect(() => {
    if (!userId) {
      console.error("User ID is null or undefined");
      return;
    }

    const fetchCartItems = async () => {
      try {
        const response = await getUserCart(userId);
        
        // Truy cập vào mảng data
        const items = response.data;

        if (!Array.isArray(items)) {
          console.error("Expected an array but got:", items);
          setCartItems([]);
          return;
        }

        const detailedItems = await Promise.all(
          items.map(async (item) => {
            const serviceDetails = await getServiceById(item.serviceId);
            return {
              id: serviceDetails.id,
              name: serviceDetails.name,
              image: serviceDetails.image,
              price: serviceDetails.price,
              promotion: serviceDetails.promotion,
              quantity: item.quantity,
              selected: false,
            };
          })
        );
        setCartItems(detailedItems);
      } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userId]);

  useEffect(() => {
    if (location.state && location.state.service) {
      const newService = location.state.service;
      if (newService.quantity === undefined) {
        newService.quantity = 1;
      }
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
    const selectedItems = cartItems
      .map((shop) => ({
        shopName: shop.shopName,
        shopAddress: shop.shopAddress,
        services: shop.services.filter((service) => service.selected),
      }))
      .filter((shop) => shop.services.length > 0);

    if (selectedItems.length === 0) {
      setShowPopup(true);
    } else {
      navigate("/checkout", { state: { selectedItems } });
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleQuantityChange = (id, delta) => {
    setCartItems((prevShops) =>
      prevShops.map((shop) => ({
        ...shop,
        services: shop.services.map((service) => {
          if (service.id === id) {
            return {
              ...service,
              quantity: Math.max(service.quantity + delta, 1),
            };
          }
          return service;
        }),
      }))
    );
  };

  const handleRemove = (id) => {
    setCartItems((prevShops) =>
      prevShops.map((shop) => ({
        ...shop,
        services: shop.services.filter((service) => service.id !== id),
      }))
    );
  };

  const handleToggleSelect = (id) => {
    setCartItems((prevShops) =>
      prevShops.map((shop) => ({
        ...shop,
        services: shop.services.map((service) =>
          service.id === id
            ? { ...service, selected: !service.selected }
            : service
        ),
      }))
    );
  };

  const handleToggleSelectAll = (shopName, isChecked) => {
    setCartItems((prevShops) =>
      prevShops.map((shop) => {
        if (shop.shopName === shopName) {
          return {
            ...shop,
            services: shop.services.map((service) => ({
              ...service,
              selected: isChecked,
            })),
          };
        }
        return shop;
      })
    );
  };

  const handleRemoveSelected = () => {
    setCartItems((prevShops) =>
      prevShops
        .map((shop) => ({
          ...shop,
          services: shop.services.filter((service) => !service.selected),
        }))
        .filter((shop) => shop.services.length > 0)
    );
  };

  const calculatedTotalAmount = cartItems.reduce(
    (total, shop) =>
      total +
      shop.services.reduce(
        (shopTotal, service) =>
          service.selected
            ? shopTotal +
              (service.promotion.newPrice || service.price || 0) *
                service.quantity
            : shopTotal,
        0
      ),
    0
  );

  const totalSavings = cartItems.reduce(
    (total, shop) =>
      total +
      shop.services.reduce(
        (shopTotal, service) =>
          service.selected && service.promotion.newPrice
            ? (service.price - service.promotion.newPrice) * service.quantity
            : shopTotal,
        0
      ),
    0
  );

  const totalServices = cartItems.reduce(
    (count, shop) =>
      count + shop.services.filter((service) => service.selected).length,
    0
  );

  const handleCreateCart = () => {
    // Định nghĩa hàm handleCreateCart nếu cần thiết
  };

  const handleClearCart = () => {
    // Định nghĩa hàm handleClearCart nếu cần thiết
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
            <button onClick={handleCreateCart} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
              Tạo giỏ hàng mới
            </button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-4 h-15 p-4 mx-4 mb-2">
              <div className="font-semibold text-xl text-left flex items-center w-full">
                <input
                  type="checkbox"
                  checked={cartItems.every((shop) =>
                    shop.services.every((service) => service.selected)
                  )}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    cartItems.forEach((shop) => {
                      handleToggleSelectAll(shop.shopName, isChecked);
                    });
                  }}
                  className="mr-4"
                />
                <h2 className="text-left">Sản phẩm</h2>
              </div>
              <div className="font-semibold text-xl text-center">Đơn giá</div>
              <div className="font-semibold text-xl text-center">Số lượng</div>
              <div className="flex flex-row items-center">
                <div className="font-semibold text-xl text-center w-[70%]">
                  Thành tiền
                </div>
              </div>
            </div>
            {cartItems.map((shop) => (
              <ShopCart
                key={shop.shopName}
                shop={shop}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
                onToggleSelectAll={handleToggleSelectAll}
                onToggleSelect={handleToggleSelect}
              />
            ))}
          </div>
        )}
        {cartItems.length > 0 && (
          <div className="flex items-center justify-between bg-white p-4 rounded-lg mt-4">
            <div className="flex items-center text-xl">
              <input
                type="checkbox"
                checked={cartItems.every((shop) =>
                  shop.services.every((service) => service.selected)
                )}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  cartItems.forEach((shop) => {
                    handleToggleSelectAll(shop.shopName, isChecked);
                  });
                }}
                className="mr-4"
              />
              <span className="font-bold">
                Chọn tất cả ({cartItems.reduce((total, shop) => total + shop.services.length, 0)})
              </span>
              <button
                onClick={handleClearCart}
                className="ml-4 text-gray-500"
              >
                Xóa
              </button>
            </div>
            <div className="text-right">
              <div className="text-xl">
                <span>Tổng thanh toán:</span>
                <span className="text-[#002278] font-bold ml-2">
                  {calculatedTotalAmount > 0 ? calculatedTotalAmount.toLocaleString() : "0"} đ
                </span>
              </div>
              <div className="text-lg">
                <span>({totalServices} dịch vụ)</span>
              </div>
              <div className="text-lg">
                <span>Tiết kiệm: </span>
                <span className="text-[#002278] font-bold">
                  {totalSavings > 0 ? totalSavings.toLocaleString() : "0"} đ
                </span>
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
