import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import InformationShop from "../../Components/ComService/InformationShop";
import ServiceCard from "../../Components/ComService/ServiceCard";
import ServiceGrid from "../../Components/ComService/ServiceGrid";
import ImageSlider from "../../Components/ComService/ImageSlider";

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
    "https://thietkehaithanh.com/wp-content/uploads/2021/12/Shoes-Web-Ads-Banne1r-thietkehaithanh.jpg",
    "https://thietkehaithanh.com/wp-content/uploads/2021/11/banner-giay-thietkehaithanh-800x304.jpg",
    "https://bizweb.dktcdn.net/100/431/113/themes/826533/assets/feature_banner_0.jpg?1723989150803",
  ];

  const banner2 = [
    "https://lh5.googleusercontent.com/zkoUEknMozZORzHz3rGzcod3J4BXaEpLpgJnYwrjsX70KIdKXGVdWFF0oSf5QtySekMZYi5O4Qo-c7YQPf0DpZ1dZymdhGhIZBQpCO6NspbybXE_D_WjSAIgQLp8IkCJya-fV6_7LNhkYMFyKuG5OV4",
    "https://drake.vn/image/catalog/H%C3%ACnh%20content/c%C3%A1ch%20clear%20gi%C3%A0y%20Vans/cach-clean-giay-vans-22.jpg",
    "https://mcdn.coolmate.me/image/December2022/cua-hang-ve-sinh-giay_744.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXWpWDCoP7GaavYF1CpO9g-nYR84BakdPwtRneBZuvW6PdZuXSwOpUpzbEizd8YTDartw&usqp=CAU",
    "https://mcdn.coolmate.me/image/September2024/mceclip9_3.png",
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
        <div className="container mx-auto">
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

          <ImageSlider images={images} />

          <div className="grid grid-cols-5 gap-4 mx-auto py-8">
            {/* Phần banner cùng với tiêu đề chiếm 3 cột */}
            <div className="col-span-3 relative h-[450px] flex items-center justify-center">
              <img
                src={banner2[0]}
                alt="Shoe"
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
              <span className="absolute top-2 left-2 bg-[#FF6F61] text-white text-lg font-bold rounded w-20 h-8 text-center">
                HOT
              </span>
              <div className="absolute bottom-0 left-0 text-white flex justify-between bg-[#1E2832] w-full p-2">
                <h2 className="text-xl font-semibold">Manto</h2>
                <p className="text-gray-200">86 Services</p>
              </div>
            </div>

            {/* Phần dịch vụ chiếm 2 cột với gap 2 */}
            <div className="col-span-2 grid grid-cols-2 gap-2 h-[450px] overflow-hidden">
              {banner2.slice(1).map((image, index) => (
                <div key={index} className="relative h-full">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg shadow"
                  />
                  <div className="absolute bottom-0 left-0 text-white bg-black bg-opacity-50 rounded px-2 py-1 w-full">
                    <p className="text-sm text-center">Image {index + 2}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="items-center bg-blue-400 my-8 p-5">
            <h1 className="text-2xl font-bold text-[#002278] text-center pb-5">
              EXPLORE NEW AND POPULAR STYLES
            </h1>
            <div className="grid grid-cols-3">
              {/* Hình ảnh đầu tiên */}
              <div className="h-[70%] flex justify-center items-center">
                <img
                  src={banner2[0]}
                  alt="Shoe Cleaning"
                  className="rounded-lg w-full h-full object-cover"
                />
              </div>

              {/* Khuyến mãi */}
              <div className="flex flex-col items-center mx-5 justify-center">
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

              {/* Phần hình ảnh bổ sung */}
              <div className="grid grid-cols-1 gap-y-4">
                <div className="h-48">
                  {" "}
                  {/* Điều chỉnh chiều cao tại đây */}
                  <img
                    src={banner2[0]} // Có thể sử dụng một ảnh khác nếu có
                    alt="Shoe Cleaning"
                    className="rounded-lg w-full h-full object-cover"
                  />
                </div>
                <div className="h-48">
                  {" "}
                  {/* Điều chỉnh chiều cao tại đây */}
                  <img
                    src={banner2[1]}
                    alt="Shoe Display"
                    className="rounded-lg w-full h-full object-cover"
                  />
                </div>
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
