import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as solidStar,
  faStarHalf as solidStarHalf,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import {
  faThumbsUp as regularThumbsUp,
  faThumbsUp as solidThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import ShopAvatar from "../../assets/images/Provider/shop_avatar.jpg";
import ServiceDetail from "../../assets/videos/Service/servicedetail.mp4";
// Import FaStar từ react-icons/fa
import { FaStar } from "react-icons/fa";
import { getServiceFeedback, getServiceById } from "../../api/service";
import { useParams } from "react-router-dom";
import { getAccountById } from "../../api/user";

const FeedbackService = () => {
  const { id } = useParams();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceRating, setServiceRating] = useState(0);
  const [customerInfo, setCustomerInfo] = useState({});

  const ratings = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 15 },
    { stars: 3, percentage: 10 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 },
  ];

  const media = [
    { id: 1, src: ServiceDetail, alt: "Review Video", type: "video" },
  ];

  const [likedReviews, setLikedReviews] = useState(
    Array(feedbacks.length).fill(false)
  );

  // Khai báo trạng thái cho chỉ số video hiện tại, mỗi phần tử tương ứng với một feedback
  const [currentVideoIndex, setCurrentVideoIndex] = useState(
    Array(feedbacks.length).fill(null)
  );

  // Khai báo trạng thái cho chỉ số hình ảnh hiện tại, mỗi phần tử tương ứng với một feedback
  const [currentImageIndex, setCurrentImageIndex] = useState(
    Array(feedbacks.length).fill(null)
  );

  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setCurrentVideoIndex(Array(feedbacks.length).fill(null));
        setCurrentImageIndex(Array(feedbacks.length).fill(null));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [feedbacks.length]);

  // Hàm xử lý khi nhấp vào video
  const handleVideoClick = (reviewIndex, id) => {
    // Cập nhật chỉ số video hiện tại cho feedback được chọn
    const updatedVideoIndex = currentVideoIndex.map(
      (videoId, i) => (i === reviewIndex ? (videoId === id ? null : id) : null) // Đặt tất cả các video khác về null
    );
    setCurrentVideoIndex(updatedVideoIndex);

    // Đặt lại chỉ số hình ảnh hiện tại cho feedback được chọn
    const updatedImageIndex = currentImageIndex.map(() => null); // Đặt tất cả các hình ảnh về null
    setCurrentImageIndex(updatedImageIndex);
  };

  // Hàm xử lý khi nhấp vào hình ảnh
  const handleImageClick = (reviewIndex, index) => {
    // Cập nhật chỉ số hình ảnh hiện tại cho feedback được chọn
    const updatedImageIndex = currentImageIndex.map(
      (imageId, i) =>
        i === reviewIndex ? (imageId === index ? null : index) : null // Đặt tất cả các hình ảnh khác về null
    );
    setCurrentImageIndex(updatedImageIndex);

    // Đặt lại chỉ số video hiện tại cho feedback được ch��n
    const updatedVideoIndex = currentVideoIndex.map(() => null); // Đặt tất cả các video về null
    setCurrentVideoIndex(updatedVideoIndex);
  };

  // Định nghĩa hàm handleLikeClick
  const handleLikeClick = (reviewIndex) => {
    // Cập nhật trng thái likedReviews cho review được chọn
    const updatedLikedReviews = likedReviews.map((liked, i) =>
      i === reviewIndex ? !liked : liked
    );
    setLikedReviews(updatedLikedReviews);
  };

  const renderStars = (percentage) => {
    const totalStars = 5;
    const filledStars = (percentage / 100) * totalStars;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [feedbackData, serviceData] = await Promise.all([
          getServiceFeedback(id),
          getServiceById(id)
        ]);
        
        const validFeedbacks = feedbackData.filter(feedback => 
          feedback.isValidContent === true && 
          feedback.isValidAsset === true && 
          feedback.status !== 'SUSPENDED'
        );
        
        // Lấy thông tin khách hàng cho mỗi feedback
        const customerData = {};
        await Promise.all(
          validFeedbacks.map(async (feedback) => {
            try {
              const response = await getAccountById(feedback.order.accountId);
              customerData[feedback.id] = {
                fullName: response.data.fullName,
                imageUrl: response.data.imageUrl
              };
            } catch (error) {
              console.error("Lỗi khi lấy thông tin khách hàng:", error);
              customerData[feedback.id] = {
                fullName: "Khách hàng",
                imageUrl: ShopAvatar // Sử dụng ảnh mặc định nếu không lấy được
              };
            }
          })
        );
        
        setCustomerInfo(customerData);
        setFeedbacks(validFeedbacks);
        setServiceRating(serviceData.rating);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <div ref={containerRef} className="p-6 bg-white rounded-lg shadow-md mt-10">
      <div>
        <h2 className="text-2xl font-semibold text-[#344054]">Đánh giá </h2>

        {/* Progress Bar Section */}
        <div className="flex-start flex h-2.5 w-full overflow-hidden rounded-full bg-blue-gray-50 font-sans text-xs font-medium mt-2">
          <div className="flex h-full w-[10%] items-center justify-center overflow-hidden break-all rounded-full bg-[#164C96] text-white"></div>
        </div>
      </div>
      <div className="flex flex-col mt-7">
        <h3 className="text-xl font-medium text-[#344054]">
          Phản hồi của khách hàng
        </h3>

        <div className="flex flex-row mr-5 mt-5">
          <div className="flex flex-col ml-4 w-1/3 bg-[#F9FAFB] justify-center items-center">
            <span className="text-6xl font-bold text-[#164C96] mb-4">
              {serviceRating.toFixed(1)}
            </span>
            <div className="flex ml-2 mb-4">
              {[...Array(5)].map((_, index) => {
                const fillPercentage = Math.max(
                  0,
                  Math.min(100, (serviceRating - index) * 100) // Giả sử rating là 4.8
                );
                const totalStars = 5; // Định nghĩa totalStars tại đây
                const filledStars = (serviceRating / 5) * totalStars; // Định nghĩa filledStars tại đây

                if (index < Math.floor(filledStars)) {
                  // Ngôi sao đầy
                  return (
                    <FontAwesomeIcon
                      key={index}
                      icon={solidStar}
                      style={{ color: "gold", marginRight: "4px" }}
                    />
                  );
                } else if (
                  index === Math.floor(filledStars) &&
                  filledStars % 1 !== 0
                ) {
                  // Ngôi sao nửa
                  return (
                    <FontAwesomeIcon
                      key={index}
                      icon={solidStarHalf}
                      style={{ color: "gold", marginRight: "4px" }}
                    />
                  );
                } else {
                  // Ngôi sao trống
                  return (
                    <FontAwesomeIcon
                      key={index}
                      icon={regularStar}
                      style={{ color: "gold", marginRight: "4px" }}
                    />
                  );
                }
              })}
            </div>
            <span className="ml-2 mb-4 text-[#4F547B]">Service Rating</span>
          </div>
          <div className="flex flex-col w-2/3 ml-10 bg-[#F9FAFB] px-7 py-3">
            {ratings.map((rating) => {
              const totalStars = 5; // Định nghĩa totalStars tại đây
              const filledStars = (rating.percentage / 100) * totalStars; // Định nghĩa filledStars tại đây

              return (
                <div key={rating.stars} className="flex items-center my-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${rating.percentage}%` }}
                    />
                  </div>
                  <div className="flex ml-2 items-center">
                    {[...Array(5)].map((_, index) => {
                      const starPercentage = (rating.percentage / 100) * 5; // Chuyển đổi phần trăm thành số sao
                      const fillPercentage = Math.max(
                        0,
                        Math.min(100, (starPercentage - index) * 100)
                      );
                      // Giới hạn fillPercentage trong khoảng 0 đến 100 cho từng ngôi sao

                      return (
                        <div
                          key={index}
                          className="relative inline-block w-4 h-4"
                          style={{ marginRight: "4px" }}
                        >
                          <FaStar
                            style={{
                              position: "absolute",
                              color: "white",
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
                              color: "gold",
                              clipPath: `inset(0 ${Math.max(
                                0,
                                100 - fillPercentage
                              )}% 0 0)`,
                              width: "1em",
                              height: "1em",
                              zIndex: 2,
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div
                    className="text-base text-[#164C96] pl-4"
                    style={{ width: "40px", textAlign: "right" }}
                  >
                    {rating.percentage}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <h3 className="text-xl font-medium text-[#344054] mt-7 pb-5">
          Đánh giá
        </h3>
        {loading ? (
          <div>Đang tải...</div>
        ) : (
          feedbacks.map((feedback, reviewIndex) => (
            <div
              key={feedback.id}
              className="border-b pb-4 mb-4 flex items-start"
            >
              <img
                src={customerInfo[feedback.id]?.imageUrl || ShopAvatar}
                alt="Customer Avatar"
                className="rounded-full w-10 h-10 mr-4"
              />
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="font-semibold pr-10">
                    {customerInfo[feedback.id]?.fullName || "Khách hàng"}
                  </span>
                  <span className="text-gray-500 ml-2">
                    {new Date(feedback.createdTime).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="flex mb-2">
                  {[...Array(feedback.rating)].map((_, starIndex) => (
                    <FontAwesomeIcon
                      key={starIndex}
                      icon={solidStar}
                      className="text-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-gray-700">{feedback.content}</p>
                <div className="mt-6">
                  <div className="grid md:grid-cols-8 gap-4">
                    {/* Render Images */}
                    {feedback.assetUrls.map((asset, imageIndex) => (
                      <div key={asset.id} className="relative">
                        <img
                          src={asset.url}
                          alt={`Feedback ${imageIndex + 1}`}
                          className={`w-32 h-32 object-cover cursor-pointer rounded ${
                            currentImageIndex[reviewIndex] === imageIndex
                              ? "border-2 border-[#3A4980]"
                              : ""
                          }`}
                          onClick={() =>
                            handleImageClick(reviewIndex, imageIndex)
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex mt-5 items-center">
                    <button
                      onClick={() => handleLikeClick(reviewIndex)}
                      className="flex items-center"
                      style={{
                        color: likedReviews[reviewIndex]
                          ? "#3B82F6"
                          : "#667085",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={
                          likedReviews[reviewIndex]
                            ? solidThumbsUp
                            : regularThumbsUp
                        }
                        className="mr-2"
                      />
                      Thích
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <button className="text-[#3A4980] font-semibold mt-4">
          Xem tất cả
        </button>
      </div>
    </div>
  );
};

export default FeedbackService;
