import React from "react";
import { Star } from "lucide-react";

const ServiceCard = ({ item }) => (
  <div className="bg-white rounded-lg shadow-md p-4 relative transition-transform transform hover:scale-105 border border-[#a4a4a4]">
    <div className="mb-2 h-40 bg-gray-200 rounded-md flex items-center justify-center">
      <img
        src="https://down-vn.img.susercontent.com/file/dee1682bb885c7465b94e1f064221127"
        className="text-gray-400 h-40 w-full object-cover"
        alt={item.name}
      />
    </div>
    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
      -{item.discount}%
    </div>
    <h3 className="font-semibold mb-1">{item.name}</h3>
    <div className="flex items-center mb-1">
      <span className="text-yellow-400 mr-1">{item.rating}</span>
      <Star className="w-4 h-4 fill-current text-yellow-400" />
    </div>
    <div className="text-gray-500 line-through text-sm">
      {item.price.toLocaleString()}đ
    </div>
    <div className="text-red-500 font-bold">
      {item.discountedPrice.toLocaleString()}đ
    </div>
    <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
      Đặt Ngay
    </button>
  </div>
);

export default function ServiceGrid() {
  const services = [
    {
      id: 1,
      name: "Tên Dịch Vụ",
      rating: 4.5,
      price: 1000000,
      discountedPrice: 800000,
      discount: 20,
    },
    {
      id: 2,
      name: "Tên Dịch Vụ",
      rating: 4.5,
      price: 1000000,
      discountedPrice: 800000,
      discount: 20,
    },
    {
      id: 3,
      name: "Tên Dịch Vụ",
      rating: 4.5,
      price: 1000000,
      discountedPrice: 800000,
      discount: 20,
    },
    {
      id: 4,
      name: "Tên Dịch Vụ",
      rating: 4.5,
      price: 1000000,
      discountedPrice: 800000,
      discount: 20,
    },
    {
      id: 5,
      name: "Tên Dịch Vụ",
      rating: 4.5,
      price: 1000000,
      discountedPrice: 800000,
      discount: 20,
    },
    {
      id: 6,
      name: "Tên Dịch Vụ",
      rating: 4.5,
      price: 1000000,
      discountedPrice: 800000,
      discount: 20,
    },
    {
      id: 7,
      name: "Tên Dịch Vụ",
      rating: 4.5,
      price: 1000000,
      discountedPrice: 800000,
      discount: 20,
    },
    {
      id: 8,
      name: "Tên Dịch Vụ",
      rating: 4.5,
      price: 1000000,
      discountedPrice: 800000,
      discount: 20,
    },
  ];

  return (
    <div className=" container mx-auto px-4 py-8 rounded-md shadow-lg p-8 border-[#D9D9D9] border bg-white">
      <h2 className="text-2xl font-bold mb-6">Dành riêng cho bạn</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
        {services.map((service) => (
          <ServiceCard key={service.id} item={service} />
        ))}
      </div>
      <div className="text-center mt-8">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
          XEM THÊM
        </button>
      </div>
    </div>
  );
}
