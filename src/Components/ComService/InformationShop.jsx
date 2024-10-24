import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faCommentDots } from "@fortawesome/free-solid-svg-icons";
import ShopAvatar from "../../assets/images/Provider/shop_avatar.jpg";
import { useLocation } from "react-router-dom";
import { FaStar } from "react-icons/fa";

// Nhận prop isProviderLandingPage để xác định có đang ở trang landing không
const InformationShop = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const isProviderLandingPage = location.pathname === "/provider-landingpage";
  const provider = {
    id: 1,
    name: "Cửa hàng Nike",
    isActive: true,
    avatar: ShopAvatar,
  };

  const services = [
    {
      id: 1,
      name: "Vệ sinh chuyên sâu",
      brand: "Nike",
      rating: 4.3,
      reviews: 67,
      usage: 200,
      joined: "10 tháng trước",
    },
  ];

  const branches = [
    { id: 1, address: "123 Đường ABC, Quận 1" },
    { id: 2, address: "456 Đường DEF, Quận 3" },
    { id: 3, address: "789 Đường GHI, Quận 5" },
  ];

  return (
    <div className="bg-white rounded-lg p-5 items-center flex flex-row space-x-6">
      <div className="ml-4 flex flex-row items-center border-r-2 pr-4">
        <img
          src={provider.avatar}
          alt={provider.name}
          className="rounded-full w-25 h-25 mr-4"
        />
        <div className="flex flex-col">
          <div className="flex-1 flex-col mb-3">
            <h2 className="text-xl font-semibold text-[#1D364D]">
              {provider.name}
            </h2>
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faCircle}
                className={`text-${
                  provider.isActive ? "green" : "red"
                }-500 mr-2 text-sm`}
              />
              <p className="text-sm text-gray-600">
                {provider.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
              </p>
            </div>
          </div>
          <div className="flex flex-row">
            <button className="bg-[#1D364D] text-white rounded-lg py-2 px-4 flex items-center mr-3">
              <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
              Chat Ngay
            </button>

            {/* Kiểm tra xem đang ở trang ProviderLandingPage hay ServiceDetail */}
            {isProviderLandingPage ? (
              <div className="relative inline-block">
                <button
                  onClick={toggleDropdown}
                  className="border border-[#1D364D] text-[#1D364D] rounded-lg py-2 px-4 ml-3"
                >
                  Chi nhánh
                </button>
                {isDropdownOpen && (
                  <div className="absolute bg-white shadow-lg rounded-lg mt-2 py-2 w-52">
                    {/* Dropdown chi nhánh */}
                    {branches.map((branch) => (
                      <a
                        key={branch.id}
                        href="#"
                        className="block px-4 py-2 text-gray-800 hover:bg-[#1D364D] hover:text-white"
                      >
                        {branch.address}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button className="border border-[#1D364D] text-[#1D364D] rounded-lg py-2 px-4 ml-3">
                Xem Shop
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Phần đánh giá và dịch vụ */}
      <div className="flex flex-col flex-1">
        <div className="flex flex-row justify-between mr-8 my-4">
          <span className="text-lg font-normal">Đánh giá</span>
          <span className="text-lg text-[#002278] font-normal flex items-center">
            <span className="text-xl">{`${services[0].rating}`}</span>
            <div className="flex ml-2">
              {[...Array(5)].map((_, index) => {
                const fillPercentage = Math.max(
                  0,
                  Math.min(100, (services[0].rating - index) * 100)
                );
                return (
                  <div
                    key={index}
                    className="relative inline-block w-4 h-4"
                    style={{ marginRight: "4px" }}
                  >
                    <FaStar
                      style={{
                        position: "absolute",
                        color: "gold",
                        width: "1em",
                        height: "1em",
                        zIndex: 1,
                        stroke: "gold",
                        strokeWidth: "30px",
                      }}
                    />
                    <FaStar
                      style={{
                        position: "absolute",
                        color: "white",
                        clipPath: `inset(0 0 0 ${fillPercentage}%)`,
                        width: "1em",
                        height: "1em",
                        zIndex: 2,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </span>
        </div>
        <div className="flex flex-row justify-between mr-8 my-4">
          <span className="text-lg font-normal">Dịch vụ</span>
          <span className="text-lg text-[#002278] font-normal">1</span>
        </div>
      </div>

      {/* Phần thông tin tham gia */}
      <div className="flex flex-col flex-1">
        <div className="flex flex-row justify-between mr-8 my-4">
          <span className="text-lg font-normal">Tham gia</span>
          <span className="text-lg text-[#002278] font-normal">
            {services[0].joined}
          </span>
        </div>
        <div className="flex flex-row justify-between mr-8 my-4">
          <span className="text-lg font-normal">Số lượt sử dụng</span>
          <span className="text-lg text-[#002278] font-normal">
            {services[0].usage}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InformationShop;
