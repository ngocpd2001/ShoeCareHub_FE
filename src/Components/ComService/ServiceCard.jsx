import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";

const ServiceCard = () => {
  const services = [
    {
      id: 1,
      name: "TDX Sinkers",
      rating: "5.0",
      originalPrice: 675,
      discountedPrice: 675,
      typesAvailable: 5,
      reviews: 121,
      image:
        "https://www.asphaltgold.com/cdn/shop/files/e64c4e8e212476f63a541616935dd8657b358ba9_396463_02_Puma_Palermo_Fresh_Mint_Fast_Pink_sm_1_768x768_crop_center.jpg?v=1713163092https://i.ebayimg.com/images/g/1oAAAOSw2URk0mVj/s-l1200.jpg",
    },
    {
      id: 2,
      name: "TDX Sinkers",
      rating: "5.0",
      originalPrice: 675,
      discountedPrice: 675,
      typesAvailable: 5,
      reviews: 121,
      image:
        "https://www.asphaltgold.com/cdn/shop/files/e64c4e8e212476f63a541616935dd8657b358ba9_396463_02_Puma_Palermo_Fresh_Mint_Fast_Pink_sm_1_768x768_crop_center.jpg?v=1713163092https://i.ebayimg.com/images/g/1oAAAOSw2URk0mVj/s-l1200.jpg",
    },
    {
      id: 3,
      name: "TDX Sinkers",
      rating: "5.0",
      originalPrice: 675,
      discountedPrice: 675,
      typesAvailable: 5,
      reviews: 121,
      image:
        "https://www.asphaltgold.com/cdn/shop/files/e64c4e8e212476f63a541616935dd8657b358ba9_396463_02_Puma_Palermo_Fresh_Mint_Fast_Pink_sm_1_768x768_crop_center.jpg?v=1713163092https://i.ebayimg.com/images/g/1oAAAOSw2URk0mVj/s-l1200.jpg",
    },
    {
      id: 4,
      name: "TDX Sinkers",
      rating: "5.0",
      originalPrice: 675,
      discountedPrice: 675,
      typesAvailable: 5,
      reviews: 121,
      image:
        "https://www.asphaltgold.com/cdn/shop/files/e64c4e8e212476f63a541616935dd8657b358ba9_396463_02_Puma_Palermo_Fresh_Mint_Fast_Pink_sm_1_768x768_crop_center.jpg?v=1713163092https://i.ebayimg.com/images/g/1oAAAOSw2URk0mVj/s-l1200.jpg",
    },
    {
      id: 5,
      name: "TDX Sinkers",
      rating: "5.0",
      originalPrice: 675,
      discountedPrice: 675,
      typesAvailable: 5,
      reviews: 121,
      image:
        "https://www.asphaltgold.com/cdn/shop/files/e64c4e8e212476f63a541616935dd8657b358ba9_396463_02_Puma_Palermo_Fresh_Mint_Fast_Pink_sm_1_768x768_crop_center.jpg?v=1713163092https://i.ebayimg.com/images/g/1oAAAOSw2URk0mVj/s-l1200.jpg",
    },
  ];

  const [favorites, setFavorites] = useState([]); // State to manage favorites

  const handleFavoriteClick = (serviceId) => {
    // Toggle favorite status
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(serviceId)) {
        return prevFavorites.filter((id) => id !== serviceId);
      } else {
        return [...prevFavorites, serviceId];
      }
    });
  };

  return (
    // <div className="p-6 bg-white rounded-lg shadow-md mt-10">
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
              className="bg-white rounded-full p-2 w-10 h-10 flex items-center justify-center]"
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
              {service.originalPrice}đ
            </p>
            <p className="text-[#3A4980] font-bold text-xl">
              {service.discountedPrice}đ
            </p>
          </div>
          <div className="flex items-center">
            <span className="text-yellow-500 flex">
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon key={i} icon={faStar} size={12} />
              ))}
            </span>
            <span className="ml-1 text-xs text-gray-600">
              ({service.reviews})
            </span>
          </div>
        </div>
      ))}
    </div>

    // </div>
  );
};

export default ServiceCard;
