import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar, faPlay } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import {
  faThumbsUp as regularThumbsUp,
  faThumbsUp as solidThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import ShopAvatar from "../../assets/images/Provider/shop_avatar.jpg";
import ShoesDetailImage from "../../assets/images/Service/Shoes_detail.png";
import ServiceDetail from "../../assets/videos/Service/servicedetail.mp4";

const FeedbackService = () => {
  const ratings = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 15 },
    { stars: 3, percentage: 10 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 },
  ];

  const reviews = [
    {
      name: "Nicolas Cage",
      date: "3 Days ago",
      rating: 5,
      comment:
        "Great Product. There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.",
    },
    {
      name: "Sr. Robert Downey",
      date: "3 Days ago",
      rating: 5,
      comment:
        "The best product in Market. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
    },
  ];

  const media = [
    { id: 1, src: ShoesDetailImage, alt: "Review Image 1" },
    { id: 2, src: ShoesDetailImage, alt: "Review Image 2" },
    { id: 3, src: ShoesDetailImage, alt: "Review Image 3" },
    { id: 4, src: ShoesDetailImage, alt: "Review Image 1" },
    { id: 5, src: ShoesDetailImage, alt: "Review Image 2" },
    { id: 6, src: ShoesDetailImage, alt: "Review Image 3" },
    { id: 7, src: ServiceDetail, alt: "Review Video", type: "video" },
  ];

  const [likedReviews, setLikedReviews] = useState(
    Array(reviews.length).fill(false)
  );

  const handleLikeClick = (index) => {
    const updatedLikes = likedReviews.map((liked, i) =>
      i === index ? !liked : liked
    );
    setLikedReviews(updatedLikes); // Update the liked state
  };

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-10">
      <div>
        <h2 className="text-2xl font-semibold text-[#344054]">Đánh giá</h2>

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
            <span className="text-6xl font-bold text-[#164C96] mb-4 ">4.8</span>
            <div className="flex ml-2 mb-4">
              {[...Array(5)].map((_, index) => (
                <FontAwesomeIcon
                  key={index}
                  icon={solidStar}
                  className="text-yellow-500 ml-2"
                />
              ))}
            </div>
            <span className="ml-2 mb-4 text-[#4F547B]">Service Rating</span>
          </div>
          <div className="flex flex-col w-2/3 ml-10 bg-[#F9FAFB] px-7 py-3">
            {ratings.map((rating) => (
              <div key={rating.stars} className="flex items-center my-1">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${rating.percentage}%` }}
                  />
                </div>
                <div className="flex ml-2 items-center">
                  {[...Array(Math.floor(rating.stars))].map((_, index) => (
                    <FontAwesomeIcon
                      key={index}
                      icon={solidStar}
                      className="text-yellow-500 mx-1"
                    />
                  ))}
                  {rating.stars % 1 > 0 && (
                    <div className="relative">
                      <FontAwesomeIcon
                        icon={solidStar}
                        className="text-yellow-500 mx-1"
                      />
                      <div
                        className="absolute top-0 left-0 h-full bg-yellow-500"
                        style={{
                          width: `${(rating.stars % 1) * 100}%`,
                          clipPath: "inset(0 0 0 0)",
                        }}
                      />
                    </div>
                  )}
                  {[...Array(5 - Math.ceil(rating.stars))].map((_, index) => (
                    <FontAwesomeIcon
                      key={index}
                      icon={regularStar}
                      className="text-yellow-500 mx-1"
                    />
                  ))}
                </div>
                <div
                  className="text-base text-[#164C96] pl-4"
                  style={{ width: "40px", textAlign: "right" }}
                >
                  {rating.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <h3 className="text-xl font-medium text-[#344054] mt-7 pb-5 ">
          Đánh giá
        </h3>
        {reviews.map((review, index) => (
          <div key={index} className="border-b pb-4 mb-4 flex items-start">
            <img
              src={ShopAvatar}
              alt="ShopAvatar"
              className="rounded-full w-10 h-10 mr-4"
            />
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="font-semibold pr-10">{review.name}</span>
                <span className="text-gray-500 ml-2">{review.date}</span>
              </div>
              <div className="flex mb-2">
                {[...Array(review.rating)].map((_, starIndex) => (
                  <FontAwesomeIcon
                    key={starIndex}
                    icon={solidStar}
                    className="text-yellow-500"
                  />
                ))}
              </div>
              <p className="text-gray-700">{review.comment}</p>
              <div className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-8 gap-4">
                  {media.map((item, index) => (
                    <div key={item.id} className="relative">
                      {item.type === "video" ? (
                        <video
                          src={item.src}
                          className={`w-32 h-32 object-cover cursor-pointer rounded ${
                            index === currentMediaIndex
                              ? "border-2 border-[#3A4980]"
                              : ""
                          }`}
                          controls
                          onClick={() => setCurrentMediaIndex(index)}
                        />
                      ) : (
                        <img
                          src={item.src}
                          alt={item.alt}
                          className={`w-32 h-32 object-cover cursor-pointer rounded ${
                            index === currentMediaIndex
                              ? "border-2 border-[#3A4980]"
                              : ""
                          }`}
                          onClick={() => setCurrentMediaIndex(index)}
                        />
                      )}
                      {item.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FontAwesomeIcon
                            icon={faPlay}
                            className="text-white text-2xl"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex mt-5 items-center">
                  <button
                    onClick={() => handleLikeClick(index)}
                    className="flex items-center"
                    style={{
                      color: likedReviews[index] ? "#3B82F6" : "#667085",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={
                        likedReviews[index] ? solidThumbsUp : regularThumbsUp
                      }
                      className="mr-2"
                    />
                    Like
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button className="text-[#3A4980] font-semibold mt-4">
          Xem tất cả
        </button>
      </div>
    </div>
  );
};

export default FeedbackService;
