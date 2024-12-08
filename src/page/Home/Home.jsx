import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import ServiceGrid from "../../Components/ServiceGrid/ServiceGrid";
import Marquee from "react-fast-marquee";
import ShoeSlide1 from "../../assets/images/cleanShow.webp";
import ShoeSlide2 from "../../assets/images/suaChua.webp";
import ShoeSlide3 from "../../assets/images/sonGiay.webp";
import ShoeSlide4 from "../../assets/images/giatgiay.webp";
import ShoeSlide5 from "../../assets/images/vaGiay.webp";
import { getData } from "../../api/api";
import { Link, useNavigate } from "react-router-dom";
import { getAllBusiness } from "../../api/businesses";

const CARD_WIDTH = 280; // Fixed width for each card
const CARD_HEIGHT = 315;
const CARD_WIDTH_SHOP = 280; // Fixed width for each card
const CARD_HEIGHT_SHOP = 360;
const CARD_GAP = 16; // Gap between cards

const Carousels = ({ title, items, type, goto }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = React.useRef(null);
  const navigate = useNavigate();

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
        <Link to={`/${goto}`} className="text-blue-600 hover:underline">
          Xem tất cả
        </Link>
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
          {items.map((item, index) => {
            return type === "service" ? (
              <ServiceCardWrapper key={item.id}>
                <ServiceCard item={item} navigate={navigate} />
              </ServiceCardWrapper>
            ) : (
              <SupplierCardWrapper key={item.id} number={index + 1}>
                <SupplierCard
                  item={item}
                  navigate={navigate}
                  number={index + 1}
                />
              </SupplierCardWrapper>
            );
          })}
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
const ServiceCardWrapper = ({ children }) => {
  const wrapperStyle = {
    width: `${CARD_WIDTH}px`,
    height: `${CARD_HEIGHT}px`,
  };

  return (
    <div className="flex-none m-2" style={wrapperStyle}>
      <div
        className="bg-white rounded-lg shadow-md pt-4 px-6 transition-transform transform hover:scale-105 border border-[#a4a4a4]"
        style={{ width: "260px", height: "310px" }}
      >
        {children}
      </div>
    </div>
  );
};
const SupplierCardWrapper = ({ children, number }) => {
  const wrapperStyle = {
    width: `${CARD_WIDTH_SHOP + 60}px`, // Tăng chiều rộng lên 20px
    height: `${CARD_HEIGHT_SHOP + 70}px`, // Tăng chiều cao lên 20px
    boxSizing: "border-box", // Đảm bảo viền không làm thay đổi kích thước tổng thể
  };

  // Xác định màu và độ dày viền dựa trên thứ hạng
  const borderClass =
    number === 1
      ? "border-4 border-yellow-400" // Viền vàng, dày hơn
      : number === 2
      ? "border-4 border-gray-400" // Viền bạc, dày hơn
      : number === 3
      ? "border-4 border-orange-500" // Viền đồng, dày hơn
      : "border border-[#a4a4a4]"; // Viền mặc định cho các mục khác

  return (
    <div className="flex-none m-2" style={wrapperStyle}>
      <div
        className={`bg-white rounded-lg shadow-md pt-4 px-6 transition-transform transform hover:scale-105 ${borderClass}`}
        style={{
          width: "320px", // Tăng chiều rộng nội dung bên trong
          height: "420px", // Tăng chiều cao nội dung bên trong
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    </div>
  );
};

const ServiceCard = ({ item, navigate }) => (
  <div
    onClick={() => navigate(`/servicedetail/${item.id}`)}
    className="cursor-pointer"
  >
    <div className="mb-2 h-35 relative bg-gray-200  rounded-md flex items-center justify-center">
      <img
        src={item?.assetUrls && item?.assetUrls[0]?.url}
        className="text-gray-400 h-35 w-full object-cover"
        alt={item.name}
      />
    </div>
    <div className="absolute top-2 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
      -{item?.promotion?.saleOff}%
    </div>
    <h3 className="font-semibold mb-1 mt-3 truncate">{item.name}</h3>
    <div className=" ">
      <div className="flex items-center justify-between ">
        <h1 className="truncate max-w-[70%]"> {item.businessName} </h1>

        {item.businessRank === 1 && (
          <div className="h-8 w-8 ">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/shoecarehub-4dca3.firebasestorage.app/o/images%2F8b0fc7da-2f8a-4c28-8e9f-d6ee30aebac9.png?alt=media&token=2f191e70-4da5-4f87-8e28-849ccd40114e"
              className="text-gray-400 h-8 w-8"
              alt={1}
            />
          </div>
        )}
        {item.businessRank === 2 && (
          <div className="h-8 w-8 ">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/shoecarehub-4dca3.firebasestorage.app/o/images%2F74af8a62-9456-4727-bc5c-8865697d1d26.png?alt=media&token=0eccbf46-8664-45de-b9bc-7c93026ab573"
              className="text-gray-400 h-8 w-8"
              alt={2}
            />
          </div>
        )}
        {item.businessRank === 3 && (
          <div className="h-8 w-8 ">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/shoecarehub-4dca3.firebasestorage.app/o/images%2F5a161334-89be-4996-b733-7b37c8a70173.png?alt=media&token=82f15bf0-b238-4bb5-9a69-d94fc77b1d2a"
              className="text-gray-400 h-8 w-8"
              alt={3}
            />
          </div>
        )}
        {item.businessRank >= 4 && item.businessRank <= 10 && (
          <div className="h-8 w-8 ">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/shoecarehub-4dca3.firebasestorage.app/o/images%2Fdd527b36-9abd-4e5e-84bc-d7549b00692b.png?alt=media&token=7701f7f2-4e60-434c-b93e-e881d3fdc0bd"
              className="text-gray-400 h-8 w-8"
              alt={3}
            />
          </div>
        )}
      </div>
    </div>
    <div className="flex items-center mb-1">
      <span className="text-yellow-400 mr-1">{item.rating}</span>
      <Star className="w-4 h-4 fill-current text-yellow-400" />
    </div>
    {item.promotion && item.promotion.newPrice ? (
      // Nếu có giảm giá
      <>
        <div className="text-gray-500 line-through text-sm">
          {item.price.toLocaleString()}đ
        </div>
        <div className="text-red-500 font-bold">
          {item.promotion.newPrice.toLocaleString()}đ
        </div>
      </>
    ) : (
      // Nếu không có giảm giá
      <>
        <div className="h-[24px]"></div>
        <div className="text-red-500 font-bold">
          {item.price.toLocaleString()}đ
        </div>
      </>
    )}
    {/* <button
      onClick={() => navigate(`/servicedetail/${item.id}`)}
      className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
    >
      Chi tiết 1
    </button> */}
  </div>
);

const SupplierCard = ({ item, navigate, number }) => (
  <div>
    <div className="relative w-full h-full">
      <img
        src={item.imageUrl}
        className="text-gray-400 object-cover rounded-md"
        alt={item.name}
        style={{
          height: "240px", // Tăng chiều cao ảnh thêm 20px
          width: "300px", // Tăng chiều rộng ảnh thêm 20px
        }}
      />
      {/* Hiển thị số thứ hạng nếu là Top 1, 2, hoặc 3 */}
      {number === 1 && (
        <div className="absolute -top-6 -right-16 text-white font-bold py-1 px-2 rounded-full">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/shoecarehub-4dca3.firebasestorage.app/o/images%2F8b0fc7da-2f8a-4c28-8e9f-d6ee30aebac9.png?alt=media&token=2f191e70-4da5-4f87-8e28-849ccd40114e"
            className="text-gray-400 h-28 w-full"
            alt={1}
          />
        </div>
      )}
      {number === 2 && (
        <div className="absolute -top-6 -right-16 text-white font-bold py-1 px-2 rounded-full">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/shoecarehub-4dca3.firebasestorage.app/o/images%2F74af8a62-9456-4727-bc5c-8865697d1d26.png?alt=media&token=0eccbf46-8664-45de-b9bc-7c93026ab573"
            className="text-gray-400 h-28 w-full"
            alt={2}
          />
        </div>
      )}
      {number === 3 && (
        <div className="absolute -top-6 -right-16 text-white font-bold py-1 px-2 rounded-full">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/shoecarehub-4dca3.firebasestorage.app/o/images%2F5a161334-89be-4996-b733-7b37c8a70173.png?alt=media&token=82f15bf0-b238-4bb5-9a69-d94fc77b1d2a"
            className="text-gray-400 h-28 w-full"
            alt={3}
          />
        </div>
      )}
    </div>
    <h3 className="font-semibold mb-1 mt-3 truncate">{item.name}</h3>
    <div className="flex items-center mb-1">
      <span className="text-yellow-400 mr-1">{item.rating}</span>
      <Star className="w-4 h-4 fill-current text-yellow-400" />
      <div className="text-end w-full text-sm text-gray-600">
        Có {item.toTalServiceNum} dịch vụ
      </div>
    </div>
    <div className="text-end text-gray-950">
      Đã làm {item.totalOrder} dịch vụ
    </div>
    <button
      onClick={() => navigate(`/provider-landingpage/${item.id}`)}
      className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
    >
      Chi Tiết
    </button>
  </div>
);

export default function CarouselsSection() {
  const [services, setServices] = useState([]);
  const [business, setBusiness] = useState([]);

  // Đảm bảo rằng dataImg được khai báo và khởi tạo
  const dataImg = [
    {
      img: ShoeSlide1,
    },
    {
      img: ShoeSlide2,
    },
    {
      img: ShoeSlide3,
    },
    {
      img: ShoeSlide4,
    },
    {
      img: ShoeSlide5,
    },
  ];

  useEffect(() => {
    getData("/services/discounted?PageIndex=1&PageSize=99")
      .then((data) => {
        console.log(123, data?.data?.data?.items);
        const discountedServices = data?.data?.data?.items;
        // .filter(
        //   (service) => service.promotion !== null
        // );
        setServices(discountedServices);
      })
      .catch((error) => {
        console.log(error);
      });

    getData("/leaderboards/by-month")
      .then((data) => {
        console.log(22222, data?.data.data);
        setBusiness(data?.data?.data?.businesses || []);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
          goto="service-discounted"
        />
        <Carousels
          title="Nhà cung cấp tiêu biểu"
          items={business}
          type="supplier"
          goto="provider"
        />
        <ServiceGrid />
      </div>
    </div>
  );
}
