import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { Button, Dropdown, Menu, Pagination } from "antd";
import { DownOutlined } from "@ant-design/icons";

const services = [
  {
    id: 1,
    name: "Web Development",
    discountPrice: "$59.99/hr",
    originalPrice: "$119.99/hr",
    rating: 4.5,
    reviews: 150,
    image:
      "https://cany.vn/image/catalog/lnt/15224/Palermo-Hairy-Men's-Sneakers_75(1).jpg",
  },
  {
    id: 2,
    name: "Graphic Design",
    discountPrice: "$59.99/hr",
    originalPrice: "$119.99/hr",
    rating: 4.8,
    reviews: 110,
    image:
      "https://cany.vn/image/catalog/lnt/15224/Palermo-Hairy-Men's-Sneakers_75(1).jpg",
  },
  {
    id: 3,
    name: "SEO Services",
    discountPrice: "$59.99/hr",
    originalPrice: "$119.99/hr",
    rating: 4.6,
    reviews: 90,
    image:
      "https://cany.vn/image/catalog/lnt/15224/Palermo-Hairy-Men's-Sneakers_75(1).jpg",
  },
  {
    id: 4,
    name: "Content Writing",
    discountPrice: "$59.99/hr",
    originalPrice: "$119.99/hr",
    rating: 4.7,
    reviews: 130,
    image:
      "https://cany.vn/image/catalog/lnt/15224/Palermo-Hairy-Men's-Sneakers_75(1).jpg",
  },
  {
    id: 5,
    name: "Digital Marketing",
    discountPrice: "$59.99/hr",
    originalPrice: "$119.99/hr",
    rating: 4.4,
    reviews: 70,
    image:
      "https://cany.vn/image/catalog/lnt/15224/Palermo-Hairy-Men's-Sneakers_75(1).jpg",
  },
  {
    id: 6,
    name: "UI/UX Design",
    discountPrice: "$59.99/hr",
    originalPrice: "$119.99/hr",
    rating: 4.9,
    reviews: 120,
    image:
      "https://cany.vn/image/catalog/lnt/15224/Palermo-Hairy-Men's-Sneakers_75(1).jpg",
  },
  {
    id: 7,
    name: "App Development",
    discountPrice: "$59.99/hr",
    originalPrice: "$119.99/hr",
    rating: 4.8,
    reviews: 80,
    image:
      "https://cany.vn/image/catalog/lnt/15224/Palermo-Hairy-Men's-Sneakers_75(1).jpg",
  },
  {
    id: 8,
    name: "Video Editing",
    discountPrice: "$59.99/hr",
    originalPrice: "$119.99/hr",
    rating: 4.5,
    reviews: 60,
    image:
      "https://cany.vn/image/catalog/lnt/15224/Palermo-Hairy-Men's-Sneakers_75(1).jpg",
  },
];

const handleMenuClick = (e) => {
  console.log("Click on menu item:", e);
};

const ServiceGrid = () => {
  const [selected, setSelected] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const handleFocus = () => {
    setSelected(true);
  };

  const handleBlur = () => {
    setSelected(false);
  };

  const handleFavoriteClick = (serviceId) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(serviceId)) {
        return prevFavorites.filter((id) => id !== serviceId);
      } else {
        return [...prevFavorites, serviceId];
      }
    });
  };

  const totalPages = Math.ceil(services.length / pageSize);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const displayedServices = services.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Định nghĩa menu trong ServiceGrid
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">Rẻ</Menu.Item>
      <Menu.Item key="2">Trung Bình</Menu.Item>
      <Menu.Item key="3">Cao</Menu.Item>
    </Menu>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row items-center mb-4 bg-white p-4">
        <h2 className="text-lg font-semibold text-center">SẮP XẾP THEO</h2>

        <Button
          className={`mx-3 ${
            selected ? "bg-white border-3 border-[#3A4980] text-white" : ""
          } text-center`}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          Phổ biến
        </Button>

        <Dropdown overlay={menu} trigger={["click"]}>
          <Button>
            Giá <DownOutlined />
          </Button>
        </Dropdown>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 shadow-md">
        {displayedServices.map((service) => (
          <div
            key={service.id}
            className="bg-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 min-h-[350px] relative"
          >
            <div className="relative flex-grow overflow-hidden">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-50 object-cover rounded"
              />
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => handleFavoriteClick(service.id)}
                  className="bg-white rounded-full p-2 w-10 h-10 flex items-center justify-center"
                >
                  <FontAwesomeIcon
                    icon={
                      favorites.includes(service.id)
                        ? faHeartSolid
                        : faHeartRegular
                    }
                    className={`text-[#3A4980] ${
                      favorites.includes(service.id)
                        ? "text-[#3A4980]"
                        : "text-gray-400"
                    }`}
                    size="xl"
                  />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold mt-2">{service.name}</h3>
            <p className="text-[#667085] font-normal line-through">
              {service.originalPrice}
            </p>
            <p className="text-[#3A4980] font-bold text-xl">
              {service.discountPrice}
            </p>
            <div className="flex items-center mt-1">
              <span className="text-yellow-500">
                {"★".repeat(Math.floor(service.rating))}
              </span>
              <span className="text-gray-500 ml-1">({service.reviews})</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          total={services.length}
          pageSize={pageSize}
          onChange={onPageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default ServiceGrid;
