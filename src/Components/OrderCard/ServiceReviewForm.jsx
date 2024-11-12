import React, { useState } from "react";
import { Star } from "lucide-react";
import ComUpImg from "./../ComUpImg/ComUpImg";
import { firebaseImgs } from "../../upImgFirebase/firebaseImgs";
import { postData } from "../../api/api";
import { message } from "antd";

const ServiceReviewForm = ({ data, onClose, reloadData }) => {
  const [reviews, setReviews] = useState(
    data?.orderDetails?.map((item) => ({
      id: item?.id,
      rating: 5,
      review: "",
      images: [],
    })) || []
  );
  const [loading, setLoading] = useState(false);
  // Hàm thay đổi rating cho từng dịch vụ
  const handleRatingChange = (id, newRating) => {
    setReviews((prevReviews) =>
      prevReviews.map((item) =>
        item.id === id ? { ...item, rating: newRating } : item
      )
    );
  };

  // Hàm thay đổi review cho từng dịch vụ
  const handleReviewChange = (id, newReview) => {
    setReviews((prevReviews) =>
      prevReviews.map((item) =>
        item.id === id ? { ...item, review: newReview } : item
      )
    );
  };

  // Hàm xử lý khi nhấn nút Đánh giá
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true); // Bắt đầu quá trình tải
    console.log("Dữ liệu đánh giá:", reviews);
    reviews.forEach((e, index) => {
      firebaseImgs(e.images)
        .then((uploadedUrls) => {
          const assetUrls = uploadedUrls.map((url) => {
            const isImage = url.includes("mp4"); // Điều kiện giả định để kiểm tra xem có phải là hình ảnh
            return {
              url: url,
              isImage: !isImage,
              type: isImage ? "video" : "image",
            };
          });

          postData(`/feedbacks`, {
            orderItemId: e.id,
            rating: e.rating,
            content: e.review,
            status: "string",
            assetUrls: assetUrls,
          })
            .then((response) => {
              console.log("data :", response);

              if (reviews.length === index + 1) {
                reloadData();
                message.success(`Đánh giá thành công `);
                onClose(); // Đóng modal
                setLoading(false);
              }
            })
            .catch((error) => {
              console.error("Lỗi :", error);
              message.error(`Đánh giá không thành công`);
              reloadData();
              setLoading(false);
            });
          console.log(1111, {
            orderItemId: e.id,
            rating: e.rating,
            content: e.review,
            status: "string",
            assetUrls: assetUrls,
          });
        })
        .catch((error) => {
          console.error("Lỗi :", error);
        });
    });
  };
  console.log(data?.orderDetails[0].feedback);
  //  const onChange1 = (data) => {
  //    const selectedImages = data;
  //    const newImages = selectedImages.map((file) => file.originFileObj);
  //    setImages1(newImages);
  //  };
  const handleImageChange = (id, data) => {
    const selectedImages = data;
    const newImages = selectedImages.map((file) => file.originFileObj);

    // Cập nhật mảng hình ảnh cho từng dịch vụ
    setReviews((prevReviews) =>
      prevReviews.map((item) =>
        item.id === id ? { ...item, images: newImages } : item
      )
    );
  };
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Đánh Giá Dịch Vụ</h1>
      {data?.orderDetails &&
        data?.orderDetails.map((value) => (
          <div key={value?.id} className="mb-10 border-b">
            <div className="flex items-center mb-4">
              <img
                src={
                  value?.service?.assetUrls && value?.service?.assetUrls[0]?.url
                }
                alt={value?.service?.name}
                className="w-24 h-24 object-cover mr-4 border"
              />
              <p className="font-semibold">{value?.service?.name}</p>
            </div>
            <div className="mb-4">
              <p className="mb-2">Chất lượng dịch vụ</p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    onClick={() => handleRatingChange(value?.id, star)}
                    className={`cursor-pointer ${
                      star <=
                      reviews.find((item) => item.id === value?.id)?.rating
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
              value={
                reviews.find((item) => item.id === value?.id)?.review || ""
              }
              onChange={(e) => handleReviewChange(value?.id, e.target.value)}
            ></textarea>
            <p className="text-paragraph font-bold">Hình ảnh</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <ComUpImg
                onChange={(data) => handleImageChange(value?.id, data)}
                numberImg={5}
              />
            </div>
          </div>
        ))}

      <div className="flex justify-end">
        <button
          className={`bg-[#002278] text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Đang gửi đánh giá..." : "Đánh giá"}
        </button>
      </div>
    </div>
  );
};

export default ServiceReviewForm;
