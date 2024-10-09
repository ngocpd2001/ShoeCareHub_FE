import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faStar } from "@fortawesome/free-solid-svg-icons";
import InformationShop from "../../Components/Service/InformationShop";
import ServiceCard from "../../Components/Service/ServiceCard";
import ServiceGrid from "../../Components/Service/ServiceGrid";

const ProviderLandingPage = () => {
  const featuredServices = [
    {
      name: "Web Design",
      price: "$79.99/hr",
      rating: 4.5,
      image: "/api/placeholder/150/150",
    },
    {
      name: "App Development",
      price: "$89.99/hr",
      rating: 4.2,
      image: "/api/placeholder/150/150",
    },
    {
      name: "SEO Optimization",
      price: "$69.99/hr",
      rating: 4.7,
      image: "/api/placeholder/150/150",
    },
    {
      name: "Content Writing",
      price: "$49.99/hr",
      rating: 4.8,
      image: "/api/placeholder/150/150",
    },
    {
      name: "Graphic Design",
      price: "$59.99/hr",
      rating: 4.6,
      image: "/api/placeholder/150/150",
    },
  ];

  const images = [
    "https://via.placeholder.com/800x400?text=Image+1",
    "https://via.placeholder.com/800x400?text=Image+2",
    "https://via.placeholder.com/800x400?text=Image+3",
  ];

  const banner2 = [
    "https://via.placeholder.com/800x400?text=Image+1",
    "https://via.placeholder.com/800x400?text=Image+2",
    "https://via.placeholder.com/800x400?text=Image+3",
    "https://via.placeholder.com/800x400?text=Image+4",
    "https://via.placeholder.com/800x400?text=Image+5",
  ];

  const banners = [
    "https://via.placeholder.com/400x400?text=Image+1",
    "https://via.placeholder.com/400x400?text=Image+2",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-white w-full">
        <div className="max-w-7xl mx-auto p-6">
          {/* Shop information */}
          <InformationShop />
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="container mx-auto p-4">
          <section className="mb-8">
            <div className="flex flex-row justify-between">
              <h2 className="text-2xl font-semibold text-[#344054]">
                GỢI Ý CHO BẠN
              </h2>
              <button className="text-[#002278] font-semibold">
                Xem tất cả
              </button>
            </div>
            {/* Related Services */}
            <ServiceCard />
          </section>

          <div className="relative w-full overflow-hidden py-8">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((image, index) => (
                <div key={index} className="min-w-full">
                  <img
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-gray-200"
            >
              &#10094;
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-gray-200"
            >
              &#10095;
            </button>
          </div>

          <div className="mx-auto flex py-8">
            <div className="w-1/12">
              <h1 className="text-2xl font-bold text-[#002278] rotate-90 w-full whitespace-nowrap pl-11">
                EXPLORE NEW AND POPULAR STYLES
              </h1>
            </div>
            <div className="w-11/24 relative h-[450px]">
              <img
                src={banner2[0]}
                alt="Shoe"
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
              <span className="absolute top-2 left-2 bg-[#FF6F61] text-white text-xs font-bold px-2 py-1 rounded">
                HOT
              </span>
              <div className="absolute bottom-0 left-0 text-white flex flex-row justify-between bg-[#1E2832] w-full p-2">
                <h2 className="text-xl font-semibold">Manto</h2>
                <p className="text-gray-200">86 Services</p>
              </div>
            </div>
            <div className="w-11/24 grid grid-cols-2 gap-2 h-[450px] pl-2">
              {banner2.slice(1).map((image, index) => (
                <div key={index} className="relative h-full">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg shadow"
                  />
                  <div className="absolute bottom-2 left-2 text-white">
                    <p className="text-sm">Image {index + 2}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="items-center bg-blue-400 p-8 flex flex-row my-8">
            <div className="w-1/3">
              <img
                src={banner2[0]}
                alt="Shoe Cleaning"
                className="rounded-lg"
              />
            </div>

            <div className="flex flex-col items-center mx-15 w-1/3">
              <h1 className="text-4xl font-bold text-black mt-4 text-center">
                Get 50% Off
              </h1>
              <p className="text-black mt-2 text-center">
                for all new product purchases min. purchase Rp. 350.000
              </p>
              <button className="mt-4 bg-white text-[#002278] font-semibold py-2 px-4 rounded flex items-center">
                <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                SHOP NOW
              </button>
            </div>

            <div className="w-1/3 relative flex flex-col justify-between h-full">
              <div className="h-1/2">
                <img
                  src={banner2[0]}
                  alt="Shoe Cleaning"
                  className="w-full rounded-lg object-cover"
                />
              </div>
              <div className="h-1/2 mt-4">
                <img
                  src={banner2[1]}
                  alt="Shoe Display"
                  className="w-full rounded-lg object-cover"
                />
              </div>
            </div>
          </div>

          {/* ServiceGrid */}
          <ServiceGrid />
        </div>
      </div>
    </div>
  );
};

export default ProviderLandingPage;
