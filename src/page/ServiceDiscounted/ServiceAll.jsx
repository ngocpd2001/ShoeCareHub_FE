import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import ServiceGrid from "./ServiceGrid";
import Marquee from "react-fast-marquee";
import ShoeSlide1 from "../../assets/images/cleanShow.webp";
import ShoeSlide2 from "../../assets/images/suaChua.webp";
import ShoeSlide3 from "../../assets/images/sonGiay.webp";
import ShoeSlide4 from "../../assets/images/giatgiay.webp";
import ShoeSlide5 from "../../assets/images/vaGiay.webp";
import { getData } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { getAllBusiness } from "../../api/businesses";

export default function ServiceAll() {
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
    getData("/services?PageIndex=1&PageSize=99")
      .then((data) => {
        console.log(data?.data?.data?.items);
        const discountedServices = data?.data?.data?.items.filter(
          (service) => service.promotion !== null
        );
        setServices(discountedServices);
      })
      .catch((error) => {
        console.log(error);
      });

    getAllBusiness()
      .then((data) => {
        setBusiness(data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
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
        <ServiceGrid name={"Tất cả dịch vụ"} api={`services`} />
      </div>
    </div>
  );
}
