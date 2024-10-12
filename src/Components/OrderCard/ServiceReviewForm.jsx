import React, { useState } from "react";
import { Star, Camera } from "lucide-react";
import ComUpImg from "./../ComUpImg/ComUpImg";

const ServiceReviewForm = () => {
  const [rating, setRating] = useState(4);
  const [review, setReview] = useState("");


  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };



  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you would typically send the review data to a server
    alert("Đánh giá đã được gửi!");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Đánh Giá Dịch Vụ</h1>
      <div className="flex items-center mb-4">
        <img
          src="https://bizweb.dktcdn.net/100/431/113/files/san-pham-ve-sinh-giay-sneaker.jpg?v=1628575452717"
          alt="Dịch vụ vệ sinh giày"
          className="w-24 h-24 object-cover mr-4"
        />
        <p>Dịch vụ vệ sinh giày 3 in 1 siêu sạch</p>
      </div>
      <div className="mb-4">
        <p className="mb-2">Chất lượng dịch vụ</p>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={24}
              onClick={() => handleRatingChange(star)}
              className={`cursor-pointer ${
                star <= rating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
      <textarea
        className="w-full p-2 border rounded mb-4"
        rows="4"
        placeholder="Để lại chi tiết đánh giá dịch vụ"
        value={review}
        onChange={handleReviewChange}
      ></textarea>
      <p className="text-paragraph font-bold">Hình ảnh</p>
      <div className="flex flex-wrap gap-2 mb-4">
        <ComUpImg onChange={() => {}} numberImg={5} />
      </div>
      <div className="flex justify-end">
        <button
          className="bg-[#002278] text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          onClick={handleSubmit}
        >
          Đánh giá
        </button>
      </div>
    </div>
  );
};

export default ServiceReviewForm;
