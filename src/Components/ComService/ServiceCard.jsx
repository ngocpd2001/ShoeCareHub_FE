import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { getAllService } from '../../api/service'; 

const ServiceCard = () => {
  const [services, setServices] = useState([]); // State để lưu trữ danh sách dịch vụ
  const [favorites, setFavorites] = useState([]); // State để quản lý yêu thích

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getAllService();
        console.log(response); // Kiểm tra response từ API
        if (response && response.data && response.data.items) {
          setServices(response.data.items); // Lấy danh sách dịch vụ từ response
        } else {
          console.error("Dữ liệu không hợp lệ", response);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API", error);
      }
    };

    fetchServices();
  }, []); // Chỉ chạy một lần khi component được mount

  const handleFavoriteClick = (serviceId) => {
    // Toggle trạng thái yêu thích
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(serviceId)) {
        return prevFavorites.filter((id) => id !== serviceId);
      } else {
        return [...prevFavorites, serviceId];
      }
    });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-7">
      {services.map((service, index) => (
        <div
          key={service.id}
          className="bg-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 min-h-[300px] relative"
        >
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
                  favorites.includes(service.id) ? faHeartSolid : faHeartRegular
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
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold">{service.name}</h3>
          </div>
          <div className="relative mb-2">
            <p className="text-[#667085] font-normal line-through">
              {service.price}đ
            </p>
            <p className="text-[#3A4980] font-bold text-xl">
              {service.promotion.newPrice}đ
            </p>
          </div>
          <div className="flex items-center">
            <span className="text-yellow-500 flex">
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon key={i} icon={faStar} size={12} />
              ))}
            </span>
            <span className="ml-1 text-xs text-gray-600">
              ({service.rating})
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceCard;
