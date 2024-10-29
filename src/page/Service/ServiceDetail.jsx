import React, { useState, useEffect, useRef } from "react";
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
import { getServiceById } from "../../api/service";
import { useParams, useNavigate } from "react-router-dom";

const ServiceDetail = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentService, setCurrentService] = useState(null);
  const containerRef = useRef(null);
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  // Định nghĩa dataImages
  const dataImages = []; // Thay thế bằng dữ liệu thực tế nếu có

  useEffect(() => {
    const fetchService = async () => {
      try {
        const service = await getServiceById(id);
        setCurrentService(service);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin dịch vụ:", error);
        // Thêm thông báo lỗi cho người dùng nếu cần
      }
    };

    fetchService();
  }, [id]); // Đảm bảo rằng id là dependency để gọi lại khi id thay đổi

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setCurrentImageIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Kiểm tra currentService và currentService.images trước khi sử dụng
  const combinedData = currentService && currentService.images ? [
    ...dataImages,
    ...currentService.images.thumbnails.map((img) => ({
      img,
      type: "image",
    })),
  ] : [];

  if (!currentService) {
    return <div>Đang tải...</div>;
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % combinedData.length);
  };

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

  const MAX_LENGTH = 200;

  const shortDescription = currentService.description
    ? currentService.description.slice(0, MAX_LENGTH)
    : "";
  const isLongDescription = currentService.description
    ? currentService.description.length > MAX_LENGTH
    : false;

  const handleAddToCart = () => {
    if (currentService) {
      const service = {
        ...currentService,
        quantity: quantity || 1, 
      };
      setCart((prevCart) => [...prevCart, service]);
      navigate("/cart", { state: { service } }); 
    }
  };

  const handleCheckout = () => {
    if (currentService) {
      const service = {
        ...currentService,
        quantity: quantity || 1,
      };
      navigate("/checkout", {
        state: { selectedItems: [{ services: [service] }] },
      });
    }
  };

  const formatCurrency = (value) => {
    return value ? value.toLocaleString("vi-VN") + "đ" : "N/A";
  };

  const formatRating = (rating) => {
    return rating !== undefined ? rating.toFixed(1) : "N/A";
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md min-h-[750px]">
          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 pt-5">
            {/* Left column - Image and thumbnails */}
            <div className="w-full md:w-1/2 p-6" ref={containerRef}>
              <div className="relative">
                {/* Main Image */}
                {currentService.images && (
                  <img
                    src={currentService.images.main}
                    alt={currentService.name}
                    className="w-full h-[500px] object-cover rounded-lg"
                  />
                )}
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
                <div className="flex flex-col space-y-2 max-w-[70%]">
                  <h1 className="text-3xl font-bold text-gray-800 break-words">
                    {currentService.name}
                  </h1>
                  <h2 className="text-lg text-gray-400">
                    Hiệu giày: {currentService.brand}
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-semibold text-[#D46F77] bg-[#EDF0F8] rounded-xl px-4 py-1 shadow-md whitespace-nowrap">
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
                <div className="flex flex-col items-start">
                  {currentService.promotion && currentService.promotion.newPrice ? (
                    <>
                      <span className="text-3xl font-bold text-blue-800">
                        {formatCurrency(currentService.promotion.newPrice)}
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        {formatCurrency(currentService.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-[#3A4980] font-bold text-xl">
                      {formatCurrency(currentService.price)}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-[#F9F6F1] rounded-xl px-4 py-1 shadow-md">
                    <FontAwesomeIcon
                      icon={regularStar}
                      className="text-[#D48D3B]"
                    />
                    <span className="ml-2 text-[#D48D3B]">
                      {formatRating(currentService.rating)}
                    </span>
                  </div>
                  <span className="bg-[#EDF0F8] text-[#3A4980] font-semibold rounded-xl px-2 py-1">
                    <FontAwesomeIcon icon={faCommentDots} className="pr-2" />
                    {currentService.feedbackedNum} đánh giá
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
                <button
                  onClick={handleAddToCart}
                  className="bg-[#3A4980] text-white rounded-xl py-4 px-6 flex items-center"
                >
                  <FontAwesomeIcon icon={faCartShopping} className="mr-4" />
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={handleCheckout}
                  className="bg-gray-200 text-[#3A4980] rounded-xl py-2 px-10"
                >
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
