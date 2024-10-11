import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
  faHeart,
  faCartShopping,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import {
  faStar as regularStar,
  faCommentDots,
} from "@fortawesome/free-regular-svg-icons";
import FeedbackService from "../../Components/ComService/FeedbackService";
import InformationShop from "../../Components/ComService/InformationShop";
import ServiceCard from "../../Components/ComService/ServiceCard";
import ShoesDetailVideo from "../../assets/videos/Service/servicedetail.mp4";

const services = [
  {
    id: 1,
    name: "Vệ sinh chuyên sâu",
    brand: "Nike",
    rating: 4.8,
    reviews: 67,
    price: 65000,
    usage: 25,
    description:
      "Dịch vụ clean shoes chuyên sâu của chúng tôi mang đến sự chăm sóc toàn diện và tỉ mỉ cho từng đôi giày của bạn. Với quy trình làm sạch đa bước, bao gồm vệ sinh bề mặt, loại bỏ vết bẩn sâu, xử lý đế giày và khử mùi hôi.",
    images: {
      main: "https://www.asphaltgold.com/cdn/shop/files/e64c4e8e212476f63a541616935dd8657b358ba9_396463_02_Puma_Palermo_Fresh_Mint_Fast_Pink_sm_1_768x768_crop_center.jpg?v=1713163092",
      thumbnails: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQOCPie3ythIWfDE5rn8FzU26ET8Wugra2xbEO5g-VuHCDHaT8-_v01p9vQDlJ0XO-pnc&usqp=CAU",
        "https://i.ebayimg.com/images/g/3GoAAOSwckRkf3Yl/s-l1200.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQHx0NYAv5VPb_PTBUmna4imQVgqzZM30gSBKVBEZB1PNdp7sgfrGuPIN5X83b1ziPUXE&usqp=CAU",
      ],
    },
  },
];

const dataImages = [{ img: ShoesDetailVideo, type: "video" }];

const ServiceDetail = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(5);

  const currentService = services[0];

  const combinedData = [
    ...dataImages,
    ...currentService.images.thumbnails.map((img) => ({
      img,
      type: "image",
    })),
  ];

  // Điều hướng đến hình ảnh/video tiếp theo
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % combinedData.length);
  };

  // Điều hướng đến hình ảnh/video trước đó
  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + combinedData.length) % combinedData.length
    );
  };

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const MAX_LENGTH = 200; // Giới hạn số ký tự hiển thị

  const shortDescription = currentService.description.slice(0, MAX_LENGTH);
  const isLongDescription = currentService.description.length > MAX_LENGTH;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md min-h-[750px]">
          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 pt-5">
            {/* Left column - Image and thumbnails */}
            <div className="w-full md:w-1/2 p-6">
              <div className="relative">
                {/* Main Image */}
                <img
                  src={currentService.images.main}
                  alt={currentService.name}
                  className="w-full h-[500px] object-cover rounded-lg"
                />
              </div>
              <div className="flex justify-center mt-6 space-x-2 overflow-x-auto relative">
                {/* Button Previous */}
                <button
                  onClick={prevImage}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 z-10 h-8 w-8"
                >
                  <FontAwesomeIcon icon={faChevronLeft} size="lg" />
                </button>

                {/* Thumbnails cho hình ảnh/video */}
                {combinedData.map((item, index) => (
                  <div key={index} className="relative">
                    {item.type === "video" ? (
                      <video
                        src={item.img}
                        className={`w-32 h-32 object-cover cursor-pointer rounded ${
                          index === currentImageIndex
                            ? "border-2 border-[#3A4980]"
                            : ""
                        }`}
                        controls
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ) : (
                      <img
                        src={item.img}
                        alt={`Thumbnail ${index + 1}`}
                        className={`w-32 h-32 object-cover cursor-pointer rounded ${
                          index === currentImageIndex
                            ? "border-2 border-[#3A4980]"
                            : ""
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    )}
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {/* <FontAwesomeIcon
                          icon={faPlay}
                          className="text-white text-2xl"
                        /> */}
                      </div>
                    )}
                  </div>
                ))}

                {/* Button Next */}
                <button
                  onClick={nextImage}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 z-10 h-8 w-8"
                >
                  <FontAwesomeIcon icon={faChevronRight} size="lg" />
                </button>
              </div>
            </div>

            {/* Right column - Content */}
            <div className="w-full md:w-1/2 p-6 flex flex-col space-y-4">
              {/* Name-icon heart */}
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col space-y-2">
                  <h1 className="text-3xl font-bold text-gray-800">
                    {currentService.name}
                  </h1>
                  <h2 className="text-lg text-gray-400">
                    Hiệu giày: {currentService.brand}
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-semibold text-[#D46F77] bg-[#EDF0F8] rounded-xl px-4 py-1 shadow-md">
                    {currentService.usage} Sử dụng
                  </h2>
                  <div className="ml-2 bg-[#FEE2E2] rounded-full h-10 w-10 flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faHeart}
                      className="text-[#D46F77]"
                    />
                  </div>
                </div>
              </div>

              {/* Price-rating & feedback */}
              <div className="flex items-center justify-between mt-5 border-t pt-4">
                <span className="text-4xl font-bold text-blue-800">
                  {`${currentService.price}đ`}
                </span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-[#F9F6F1] rounded-xl px-4 py-1 shadow-md">
                    <FontAwesomeIcon
                      icon={regularStar}
                      className="text-[#D48D3B]"
                    />
                    <span className="ml-2 text-[#D48D3B]">
                      {currentService.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="bg-[#EDF0F8] text-[#3A4980] font-semibold rounded-xl px-2 py-1">
                    <FontAwesomeIcon icon={faCommentDots} className="pr-2" />
                    {currentService.reviews} đánh giá
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-5 border-t pt-4">
                <h2 className="text-2xl font-semibold">Mô tả dịch vụ</h2>

                <div
                  className={`mt-2 text-gray-600 transition-max-height duration-500 ease-in-out ${
                    isExpanded
                      ? "max-h-[1000px]"
                      : "max-h-[120px] overflow-hidden"
                  }`}
                >
                  <p>
                    {isExpanded
                      ? currentService.description
                      : `${shortDescription}${isLongDescription ? "..." : ""}`}
                  </p>
                </div>

                {isLongDescription && (
                  <button
                    onClick={toggleDescription}
                    className="text-blue-500 mt-2"
                  >
                    {isExpanded ? "Ẩn bớt..." : "Xem thêm..."}
                  </button>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center mt-5 border-t pt-4 space-x-6">
                <span className="text-gray-500 text-xl font-semibold">
                  Số lượng giày:
                </span>
                <div className="flex items-center bg-[#F3F3F3] rounded-full py-3 px-8 text-[#3A4980]">
                  <button
                    onClick={decreaseQuantity}
                    className="mx-2 pr-6 text-xl font-medium"
                  >
                    -
                  </button>
                  <span className="text-2xl font-semibold">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="mx-2 pl-6 text-2xl font-medium"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Button cart&checkout */}
              <div className="flex justify-center mt-5 border-t pt-8 space-x-10">
                <button className="bg-[#3A4980] text-white rounded-xl py-4 px-6 flex items-center">
                  <FontAwesomeIcon icon={faCartShopping} className="mr-4" />
                  Thêm vào giỏ hàng
                </button>
                <button className="bg-gray-200 text-[#3A4980] rounded-xl py-2 px-10">
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Shop information */}
        <div className=" mt-10 shadow-md">
          <InformationShop />
        </div>

        {/* FeedbackService */}
        <FeedbackService />

        <div className="p-6 bg-white rounded-lg shadow-md mt-10">
          <h2 className="text-2xl font-semibold text-[#344054]">
            Các dịch vụ khác của cửa hàng
          </h2>
          {/* Related Services */}
          <ServiceCard />
          <div className="text-center mt-5">
            <button className="bg-white border-2 border-[#3A4980] text-[#3A4980] font-semibold py-2 px-4 rounded-xl flex items-center justify-center mx-auto transition-colors hover:bg-[#3A4980] hover:text-white">
              Xem thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
