import React, { useState } from "react";
import { Star, X, ZoomIn } from "lucide-react";
import { Breadcrumb } from "antd";
import { Link, useNavigate } from "react-router-dom";
import ComButton from "../../../Components/ComButton/ComButton";

export default function DetailService() {
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const images = [
    "https://www.chuphinhsanpham.vn/wp-content/uploads/2021/06/chup-hinh-giay-dincox-shoes-c-photo-studio-5.jpg",
    "https://www.chuphinhsanpham.vn/wp-content/uploads/2021/06/chup-hinh-giay-dincox-shoes-c-photo-studio-4.jpg",
    "https://www.chuphinhsanpham.vn/wp-content/uploads/2021/06/chup-hinh-giay-dincox-shoes-c-photo-studio-5.jpg",
    "https://www.chuphinhsanpham.vn/wp-content/uploads/2021/06/chup-hinh-giay-dincox-shoes-c-photo-studio-5.jpg",
  ];
  return (
    <div>
      <div className="flex justify-between items-end pb-2 px-4 ">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Chi tiết dịch vụ
        </h2>
        <Breadcrumb
          items={[
            {
              title: "Cửa hàng",
            },
            {
              title: <Link to="/owner/service">Dịch vụ</Link>,
            },
            {
              title: "Chi tiết dịch vụ",
            },
          ]}
        />
        <div>
          <ComButton onClick={() => navigate("/owner/service/create")}>
            Cập nhật dịch vụ
          </ComButton>
        </div>
      </div>
      <div className=" mx-auto p-4 bg-white shadow-lg rounded-lg mt-2">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <div className="relative aspect-square mb-4">
              <img
                src={images[selectedImage]}
                alt={`Shoe cleaning image ${selectedImage + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md"
                onClick={() => setIsModalOpen(true)}
              >
                <ZoomIn className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto p-2">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Shoe cleaning image ${index + 1}`}
                  className={`w-24 h-24 object-cover rounded-md cursor-pointer ${
                    selectedImage === index ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>
          <div className="md:w-1/2">
            <h1 className="text-2xl font-bold mb-2">Vệ sinh đặc biệt</h1>
            <div className="flex justify-between gap-2 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">4.5/5</span>
                </div>
                <span className="text-sm text-gray-500">Đánh giá: 25</span>
                <span className="text-sm text-gray-500">Đã hoàn thành: 36</span>
              </div>
              <div className="flex items-center gap-2 mb-4 justify-end ">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Hoạt động
                </span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-4">150.000đ</div>
            <p className=" mb-1">Chi tiết:</p>
            <p className="text-gray-600 mb-4">
              Bộ dụng cụ vệ sinh giày đặc biệt, giúp làm sạch và bảo quản giày
              của bạn một cách hiệu quả. Bao gồm bàn chải chuyên dụng và các phụ
              kiện khác để đảm bảo giày luôn sạch sẽ và bền đẹp.
            </p>

            {/* <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Thêm vào giỏ hàng
            </button> */}
            <p className="text-sm text-gray-500 mt-4">Ngày tạo: 14/12/2023</p>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99]">
            <div className="relative max-w-3xl max-h-[90vh] overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={`Enlarged shoe cleaning image ${selectedImage + 1}`}
                className="max-w-full max-h-full object-contain"
              />
              <button
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}