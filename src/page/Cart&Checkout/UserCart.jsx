import React, { useEffect, useState } from "react";
import ShopCart from "../../Components/ComCart/ShopCart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const fetchCartItems = async () => {
  return [
    {
      shopName: "Cửa Hàng 1",
      shopAddress: "456 Trần Hưng Đạo",
      products: [
        {
          id: 1,
          name: "Tên Dịch Vụ 1",
          originalPrice: 200000,
          discountedPrice: 150000,
          quantity: 1,
          selected: false,
          image: "https://via.placeholder.com/50",
        },
        {
          id: 2,
          name: "Tên Dịch Vụ 2",
          originalPrice: 150000,
          quantity: 1,
          selected: false,
          image: "https://via.placeholder.com/50",
        },
      ],
    },
    {
      shopName: "Cửa Hàng 2",
      shopAddress: "456 Ngô Quyền",
      products: [
        {
          id: 3,
          name: "Tên Dịch Vụ 3",
          originalPrice: 100000,
          discountedPrice: 80000,
          quantity: 1,
          selected: false,
          image: "https://via.placeholder.com/50",
        },
        {
          id: 4,
          name: "Tên Dịch Vụ 4",
          originalPrice: 250000,
          discountedPrice: 225000,
          quantity: 1,
          selected: false,
          image: "https://via.placeholder.com/50",
        },
      ],
    },
  ];
};

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCartItems = async () => {
      const items = await fetchCartItems();
      setCartItems(items);
    };

    loadCartItems();
  }, []);

  const handleCheckout = () => {
    const selectedItems = cartItems
      .map((shop) => ({
        shopName: shop.shopName,
        shopAddress: shop.shopAddress,
        products: shop.products.filter((product) => product.selected),
      }))
      .filter((shop) => shop.products.length > 0);

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
        products: shop.products.map((product) => {
          if (product.id === id) {
            return {
              ...product,
              quantity: Math.max(product.quantity + delta, 1),
            };
          }
          return product;
        }),
      }))
    );
  };

  const handleRemove = (id) => {
    setCartItems((prevShops) =>
      prevShops.map((shop) => ({
        ...shop,
        products: shop.products.filter((product) => product.id !== id),
      }))
    );
  };

  const handleToggleSelect = (id) => {
    setCartItems((prevShops) =>
      prevShops.map((shop) => ({
        ...shop,
        products: shop.products.map((product) =>
          product.id === id
            ? { ...product, selected: !product.selected }
            : product
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
            products: shop.products.map((product) => ({
              ...product,
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
          products: shop.products.filter((product) => !product.selected),
        }))
        .filter((shop) => shop.products.length > 0)
    );
  };

  const totalAmount = cartItems.reduce(
    (total, shop) =>
      total +
      shop.products.reduce(
        (shopTotal, product) =>
          product.selected
            ? shopTotal +
              (product.discountedPrice || product.originalPrice || 0) *
                product.quantity
            : shopTotal,
        0
      ),
    0
  );

  const totalSavings = cartItems.reduce(
    (total, shop) =>
      total +
      shop.products.reduce(
        (shopTotal, product) =>
          product.selected && product.discountedPrice
            ? (product.originalPrice - product.discountedPrice) *
              product.quantity
            : shopTotal,
        0
      ),
    0
  );

  const totalServices = cartItems.reduce(
    (count, shop) =>
      count + shop.products.filter((product) => product.selected).length,
    0
  );

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
            <div className="grid grid-cols-4 h-15 p-4 mx-4 mb-2">
              <div className="font-semibold text-xl text-left flex items-center w-full">
                <input
                  type="checkbox"
                  checked={cartItems.every((shop) =>
                    shop.products.every((product) => product.selected)
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
                  shop.products.every((product) => product.selected)
                )}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  cartItems.forEach((shop) => {
                    handleToggleSelectAll(shop.shopName, isChecked);
                  });
                }}
                className="mr-4"
              />
              <span className="font-bold">Chọn tất cả</span>
              <button
                onClick={handleRemoveSelected}
                className="ml-4 text-gray-500"
              >
                Xóa
              </button>
            </div>
            <div className="text-right">
              <div className="text-xl">
                <span>Tổng thanh toán:</span>
                <span className="text-[#002278] font-bold ml-2">
                  {totalAmount > 0 ? totalAmount.toLocaleString() : "0"} đ
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
