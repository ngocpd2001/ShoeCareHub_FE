import React, { useState } from "react";
import { Star } from "lucide-react";
import ComUpImg from "./../ComUpImg/ComUpImg";
import { firebaseImgs } from "../../upImgFirebase/firebaseImgs";
import { postData } from "../../api/api";
import { Image } from "antd";

const ServiceViewReviewForm = ({ data, onClose }) => {
  const [reviews, setReviews] = useState(
    data?.orderDetails?.map((item) => ({
      id: item?.id,
      rating: item.feedback.rating,
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
                alert("Đánh giá đã được gửi thành công!");
                onClose(); // Đóng modal
                setLoading(false);
              }
            })
            .catch((error) => {
              console.error("Lỗi :", error);
              alert("Bạn đã đánh giá rồi");
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
  console.log(data);
  //  const onChange1 = (data) => {
  //    const selectedImages = data;
  //    const newImages = selectedImages.map((file) => file.originFileObj);
  //    setImages1(newImages);
  //  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Xem đánh giá</h1>
      {data?.orderDetails &&
        data?.orderDetails.map((value) => (
          <div key={value?.id} className="mb-10 border-b">
            <div className="flex justify-between">
              <div className="flex items-center mb-4">
                <img
                  src={
                    value?.service?.assetUrls &&
                    value?.service?.assetUrls[0]?.url
                  }
                  alt={value?.service?.name}
                  className="w-24 h-24 object-cover mr-4 border"
                />
                <p className="font-semibold">{value?.service?.name}</p>
              </div>
              {value?.feedback?.status === "ACTIVE" && (
                <p className="text-blue-600">Đã duyệt</p>
              )}
              {value?.feedback?.status === "PENDING" && (
                <p className="text-blue-600">Chờ duyệt</p>
              )}
              {value?.feedback?.status === "SUSPENDED" && (
                <p className="text-red-600">Từ chối</p>
              )}
            </div>
            <div className="mb-4">
              <p className="mb-2">Chất lượng dịch vụ</p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    // onClick={() => handleRatingChange(value?.id, star)}
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
              value={value?.feedback?.content}
            ></textarea>
            <p className="text-paragraph font-bold">Hình ảnh</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className=" h-24 flex items-center justify-center overflow-hidden">
                <Image.PreviewGroup>
                  {value?.feedback?.assetUrls?.map(
                    (item, index) =>
                      item.type === "image" && (
                        <div className="flex h-24 gap-4">
                          <Image
                            key={index}
                            maskClassName="object-cover w-24 h-24 object-cover object-center flex items-center justify-center"
                            className=" w-24 h-24 object-center flex items-center justify-center"
                            src={item.url}
                            style={{
                              width: "6rem",
                              height: "6rem",
                              padding: 4,
                            }}
                            alt={`image-${index}`}
                            preview={{ mask: "Xem ảnh" }}
                          />
                        </div>
                      )
                  )}
                </Image.PreviewGroup>
              </div>
            </div>
                {value?.feedback?.status === "SUSPENDED" && (
                  <p className="text-red-600 p-8">Đánh giá bị từ chối vì vi phạm tiêu chuẩn nội dung.</p>
                )}
          </div>
        ))}
    </div>
  );
};

export default ServiceViewReviewForm;
