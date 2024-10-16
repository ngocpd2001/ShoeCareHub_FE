import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import ServiceGrid from "../../Components/ServiceGrid/ServiceGrid";
import Marquee from "react-fast-marquee";
import ShoeSlide1 from "../../assets/images/cleanShow.webp";
import ShoeSlide2 from "../../assets/images/brushing.webp";

const CARD_WIDTH = 280; // Fixed width for each card
const CARD_HEIGHT = 360;
const CARD_GAP = 16; // Gap between cards

const Carousels = ({ title, items, type }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = React.useRef(null);

  const scroll = (direction) => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = CARD_WIDTH + CARD_GAP;
    const maxScroll = container.scrollWidth - container.clientWidth;

    let newPosition =
      scrollPosition + (direction === "left" ? -scrollAmount : scrollAmount);
    newPosition = Math.max(0, Math.min(newPosition, maxScroll));

    container.scrollTo({ left: newPosition, behavior: "smooth" });
    setScrollPosition(newPosition);
  };

  return (
    <div className="mb-8 rounded-md shadow-lg p-8 border-[#D9D9D9] border bg-white">
      <div className="flex justify-between items-center ">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <a href="#" className="text-blue-600 hover:underline">
          Xem tất cả
        </a>
      </div>
      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10"
          disabled={scrollPosition === 0}
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div
          ref={containerRef}
          className="flex space-x-2 overflow-x-hidden scroll-smooth pt-1"
          style={{ width: "100%", overflowX: "hidden" }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-none m-2 "
              style={{ width: `${CARD_WIDTH}px`, height: `${CARD_HEIGHT}px` }}
            >
              <div
                className="bg-white rounded-lg shadow-md pt-8 px-6 transition-transform transform hover:scale-105 border border-[#a4a4a4]"
                style={{ width: "260px", height: "350px" }}
              >
                {type === "service" ? (
                  <ServiceCard item={item} />
                ) : (
                  <SupplierCard item={item} />
                )}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

const ServiceCard = ({ item }) => (
  <>
    <div className="mb-2 h-35 relative bg-gray-200 rounded-md flex items-center justify-center">
      <img
        src="https://down-vn.img.susercontent.com/file/dee1682bb885c7465b94e1f064221127"
        className="text-gray-400 h-40 w-full object-cover"
        alt={item.name}
      />
    </div>
    <div className="absolute top-2 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
      -{item.discount}%
    </div>
    <h3 className="font-semibold mb-1 mt-3">{item.name}</h3>
    <div className="flex items-center mb-1">
      <span className="text-yellow-400 mr-1">{item.rating}</span>
      <Star className="w-4 h-4 fill-current text-yellow-400" />
    </div>
    <div className="text-gray-500 line-through text-sm">
      {item.originalPrice.toLocaleString()}đ
    </div>
    <div className="text-red-500 font-bold">
      {item.discountedPrice.toLocaleString()}đ
    </div>
    <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
      Đặt Ngay
    </button>
  </>
);

const SupplierCard = ({ item }) => (
  <>
    <div className="mb-2 h-40 bg-gray-200 rounded-md flex items-center justify-center py-2">
      <img
        src="https://down-vn.img.susercontent.com/file/dee1682bb885c7465b94e1f064221127"
        className="text-gray-400 h-40 w-full object-cover"
        alt={item.name}
      />
    </div>
    <h3 className="font-semibold mb-1">{item.name}</h3>
    <div className="flex items-center mb-1">
      <span className="text-yellow-400 mr-1">{item.rating}</span>
      <Star className="w-4 h-4 fill-current text-yellow-400" />
    </div>
    <div className="text-sm text-gray-600">
      Đã bán {item.orderCount.toLocaleString()} trong năm
    </div>
    <button className="mt-2 w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors">
      Chi Tiết
    </button>
  </>
);

export default function CarouselsSection() {
  const services = [
    {
      id: 1,
      name: "Tên Dịch Vụ",
      rating: "5.0",
      originalPrice: 1000000,
      discountedPrice: 800000,
      discount: 20,
    },
    {
      id: 2,
      name: "Tên Dịch Vụ",
      rating: "5.0",
      originalPrice: 1000000,
      discountedPrice: 800000,
      discount: 20,
    },
    {
      id: 3,
      name: "Tên Dịch Vụ",
      rating: "5.0",
      originalPrice: 1000000,
      discountedPrice: 800000,
      discount: 20,
    },
    {
      id: 4,
      name: "Tên Dịch Vụ",
      rating: "5.0",
      originalPrice: 1000000,
      discountedPrice: 800000,
      discount: 20,
    },
    {
      id: 5,
      name: "Tên Dịch Vụ",
      rating: "5.0",
      originalPrice: 1000000,
      discountedPrice: 800000,
      discount: 20,
    },
    {
      id: 6,
      name: "Tên Dịch Vụ",
      rating: "5.0",
      originalPrice: 1000000,
      discountedPrice: 800000,
      discount: 20,
    },
  ];

  const [dataImg, setDataImg] = useState([
    {
      img: ShoeSlide1,
    },
    {
      img: ShoeSlide2,
    },
    {
      img: ShoeSlide1,
    },
  ]);

  const suppliers = [
    { id: 1, name: "Tên Nhà Cung Cấp", rating: "5.0", orderCount: 1000 },
    { id: 2, name: "Tên Nhà Cung Cấp", rating: "5.0", orderCount: 1000 },
    { id: 3, name: "Tên Nhà Cung Cấp", rating: "5.0", orderCount: 1000 },
    { id: 4, name: "Tên Nhà Cung Cấp", rating: "5.0", orderCount: 1000 },
    { id: 5, name: "Tên Nhà Cung Cấp", rating: "5.0", orderCount: 1000 },
    { id: 6, name: "Tên Nhà Cung Cấp", rating: "5.0", orderCount: 1000 },
  ];

  return (
    <div className="bg-[#F9F9F9]">
      {/* Using Marquee for auto-scrolling images */}
      <div className="h-[25vh]">
        <Marquee
          pauseOnHover={true}
          speed={50}
          gradient={true}
          gradientWidth={50}
          autoFill={true}
          loop={0}
        >
          {dataImg.map((value, index) => (
            <div className="flex justify-center items-center mx-4" key={index}>
              <img
                className="object-cover h-[25vh] w-[20vw] rounded-md"
                alt={index}
                src={value.img}
              />
            </div>
          ))}
        </Marquee>
      </div>

      <div className="container mx-auto md:px-1 mt-4 max-w-[1250px] ">
        <Carousels
          title="Dịch vụ đang được giảm giá"
          items={services}
          type="service"
        />
        <Carousels
          title="Nhà cung cấp tiêu biểu"
          items={suppliers}
          type="supplier"
        />
        <ServiceGrid />
      </div>
    </div>
  );
}
