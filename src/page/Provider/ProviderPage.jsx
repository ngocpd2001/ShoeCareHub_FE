import React, { useEffect, useState } from "react";
import { getAllBusiness } from "../../api/businesses";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProviderCard = ({ provider, navigate }) => (
  <div className="bg-white rounded-lg shadow-md p-4 transition-transform transform hover:scale-105 border border-[#a4a4a4]">
    <div className="mb-2 h-40 bg-gray-200 rounded-md flex items-center justify-center">
      <img
        src={provider.imageUrl}
        className="text-gray-400 h-40 w-full object-cover"
        alt={provider.name}
      />
    </div>
    <h3 className="font-semibold mb-1 mt-3 truncate">{provider.name}</h3>
    <div className="flex items-center mb-1">
      <span className="text-yellow-400 mr-1">{provider.rating}</span>
      <Star className="w-4 h-4 fill-current text-yellow-400" />
      <div className="text-end w-full text-sm text-gray-600">
        Có {provider.toTalServiceNum} dịch vụ
      </div>
    </div>
    <div className="text-end text-gray-950">
      Đã làm {provider.totalOrder} dịch vụ
    </div>
    <button
      onClick={() => navigate(`/provider-landingpage/${provider.id}`)}
      className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
    >
      Chi Tiết
    </button>
  </div>
);

export default function ProviderPageComponent() {
  const [providers, setProviders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllBusiness(false, 10, 1)
      .then((data) => {
        setProviders(data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Nhà cung cấp tiêu biểu</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {providers.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} navigate={navigate} />
        ))}
      </div>
    </div>
  );
} 