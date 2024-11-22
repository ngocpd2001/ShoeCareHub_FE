import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getServiceByBusinessId } from "../../api/service";
import { getServiceByBranchId } from "../../api/branch";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Sử dụng useNavigate thay vì useHistory

const ServiceCard = ({ businessId, branchId }) => {
  const [services, setServices] = useState([]); // State để lưu trữ danh sách dịch vụ
  const [favorites, setFavorites] = useState([]); // State để quản lý yêu thích
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  useEffect(() => {
    const fetchServices = async () => {
      try {
        let response;
        if (branchId) {
          response = await getServiceByBranchId(branchId);
          // Sắp xếp services theo orderedNum giảm dần
          const sortedServices = response.data.items.sort((a, b) => b.orderedNum - a.orderedNum);
          setServices(sortedServices || []);
        } else if (businessId) {
          response = await getServiceByBusinessId(businessId);
          // Sắp xếp services theo orderedNum giảm dần
          const sortedServices = response.data.items.sort((a, b) => b.orderedNum - a.orderedNum);
          setServices(sortedServices || []);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API", error);
        setServices([]);
      }
    };

    fetchServices();
  }, [businessId, branchId]);

  const handleCardClick = (serviceId) => {
    navigate(`/servicedetail/${serviceId}`, { state: { businessId } }); // Điều hướng đến trang chi tiết dịch vụ
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-7">
      {services.slice(0, 5).map((service) => {
        // console.log(`ServiceCard[${service.id}]: ${service.name}`, {
        //   price: service.price,
        //   hasPromotion: !!service.promotion,
        //   promotionActive: service.status?.trim() === "Hoạt Động",
        //   promotionPrice: service.promotion?.newPrice,
        //   status: service.status
        // });
        return (
          <div
            key={service.id}
            className="bg-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 min-h-[300px] relative"
            onClick={() => handleCardClick(service.id)}
          >
            <img
              src={service.assetUrls[0]?.url}
              alt={service.name}
              className="w-full h-50 object-cover rounded"
            />
            <div className="absolute top-2 right-2">
              {service.promotion && 
               service.promotion.newPrice && 
               service.status?.trim() === "Hoạt Động" && (
                <div className="bg-red-500 text-white rounded-lg px-2 py-1">
                  <span className="text-sm font-bold">
                    -{service.promotion.saleOff}%
                  </span>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold">{service.name}</h3>
            </div>
            <div className="relative mb-2">
              {service.promotion && 
               service.promotion.newPrice && 
               service.status?.trim() === "Hoạt Động" ? (
                <>
                  <p className="text-[#667085] font-normal line-through">
                    {service.price.toLocaleString('vi-VN')}đ
                  </p>
                  <p className="text-[#3A4980] font-bold text-xl">
                    {service.promotion.newPrice.toLocaleString('vi-VN')}đ
                  </p>
                </>
              ) : (
                <p className="text-[#3A4980] font-bold text-xl">
                  {service.price.toLocaleString('vi-VN')}đ
                </p>
              )}
            </div>
            <div className="flex items-center">
              <span className="text-yellow-500 flex">
                {[...Array(5)].map((_, index) => {
                  const fillPercentage = Math.max(
                    0,
                    Math.min(100, (service.rating - index) * 100)
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
              </span>
              <span className="ml-1 text-xs text-gray-600">
                ({service.rating})
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ServiceCard;
