import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { getData } from "../../api/api";
import { Link, useNavigate } from "react-router-dom";

const ServiceCard = ({ item, navigate }) => (
  <div
    onClick={(e) => {
      e.stopPropagation();
      navigate(`/servicedetail/${item.id}`);
    }}
    className="bg-white cursor-pointer rounded-lg shadow-md p-4 relative transition-transform transform hover:scale-105 border border-[#a4a4a4]"
  >
    <div className="mb-2 h-40 bg-gray-200 rounded-md flex items-center justify-center">
      <img
        src={item?.assetUrls && item?.assetUrls[0]?.url}
        className="text-gray-400 h-40 w-full object-cover"
        alt={item.name}
      />
    </div>
    {item?.promotion?.newPrice && (
      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
        -{item?.promotion?.saleOff}%
      </div>
    )}
    <h3 className="font-semibold mb-1 mt-3 truncate">{item.name}</h3>
    <div className=" ">
      <div className="flex items-center justify-between ">
        <h1 className="truncate max-w-[70%]"> {item.businessName}</h1>

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
      <>
        <div className="text-gray-500 line-through text-sm">
          {item.price.toLocaleString()}đ
        </div>
        <div className="text-red-500 font-bold">
          {item.promotion.newPrice.toLocaleString()}đ
        </div>
      </>
    ) : (
      <>
        <div className="h-[24px]"></div>
        <div className="text-red-500 font-bold">
          {item.price.toLocaleString()}đ
        </div>
      </>
    )}
    {/* <button
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/servicedetail/${item.id}`);
      }}
      className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
    >
      Chi tiết 3
    </button> */}
  </div>
);

export default function ServiceGrid() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getData("services?PageIndex=1&PageSize=12")
      .then((data) => {
        console.log(data?.data?.data?.items);

        setServices(data?.data?.data?.items);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div className=" container mx-auto px-4 py-8 rounded-md shadow-lg p-8 border-[#D9D9D9] border bg-white">
      <h2 className="text-2xl font-bold mb-6">Tất cả dịch vụ</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
        {services.map((service) => (
          <ServiceCard key={service.id} item={service} navigate={navigate} />
        ))}
      </div>
      <div className="text-center mt-8">
        <Link
          to="/service"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          XEM THÊM
        </Link>
      </div>
    </div>
  );
}
