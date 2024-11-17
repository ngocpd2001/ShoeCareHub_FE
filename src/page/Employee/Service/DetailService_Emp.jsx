import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Breadcrumb, Image } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getServiceById } from "../../../api/service";

// Hàm để lấy URL ảnh
const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.REACT_APP_API_URL}/${path}`;
};

export default function DetailService_Emp() {
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const data = await getServiceById(id);
        console.log("Service data:", data); // Debug dữ liệu
        setService(data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết dịch vụ:", error);
      }
    };

    if (id) {
      fetchServiceDetail();
    }
  }, [id]);

  if (!service) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="p-6">
      {/* Phần tiêu đề */}
      <div className="pb-4 px-4">
        <h2 className="text-xl font-semibold text-blue-800">Chi tiết dịch vụ</h2>
        <Breadcrumb
          separator=">"
          items={[
            { title: "Cửa hàng" },
            { title: <Link to="/employee/service">Dịch vụ</Link> },
            { title: "Chi tiết dịch vụ" },
          ]}
        />
      </div>

      {/* Nội dung chính */}
      <div className="bg-white rounded-lg border p-8">
        <div className="flex gap-8">
          {/* Cột trái */}
          <div className="flex-1 space-y-6">
            <div className="space-y-5">
              {/* Tên dịch vụ */}
              <div className="flex flex-col">
                <span className="text-gray-600 text-lg mb-2">Tên dịch vụ</span>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full text-lg"
                  value={service.name}
                  disabled
                />
              </div>

              {/* Danh mục - Thêm mới */}
              <div className="flex flex-col">
                <span className="text-gray-600 text-lg mb-2">Danh mục</span>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full text-lg"
                  value={service.category?.name || "Không có"}
                  disabled
                />
              </div>

              {/* Giá dịch vụ */}
              <div className="flex flex-col">
                <span className="text-gray-600 text-lg mb-2">Giá</span>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full text-lg"
                  value={`${service.price.toLocaleString('vi-VN')}đ`}
                  disabled
                />
              </div>

              {/* Thống kê (Rating, Số đơn, Đánh giá) */}
              <div className="flex flex-col">
                <span className="text-gray-600 text-lg mb-2">Thống kê</span>
                <div className="flex gap-6">
                  {/* Rating */}
                  <div className="flex-1 flex items-center bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <span className="ml-2 text-lg font-medium">{service.rating}/5 </span>
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </div>
                  </div>

                  {/* Số đơn */}
                  <div className="flex-1 bg-green-50 p-3 rounded-lg">
                    <div className="text-lg font-medium">
                      {service.orderedNum.toLocaleString('vi-VN')}
                      <span className="text-sm font-normal ml-2">đơn</span>
                    </div>
                  </div>

                  {/* Lượt đánh giá */}
                  <div className="flex-1 bg-purple-50 p-3 rounded-lg">
                    <div className="text-lg font-medium">
                      {service.feedbackedNum.toLocaleString('vi-VN')}
                      <span className="text-sm font-normal ml-2">đánh giá</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trạng thái */}
              <div className="flex flex-col">
                <span className="text-gray-600 text-lg mb-2">Trạng thái</span>
                <div className={`inline-flex px-4 py-2 rounded-md text-lg font-medium ${
                  service.status === "Ngưng Hoạt Động" 
                    ? "bg-red-100 text-red-800"
                    : service.status === "Hoạt Động"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {service.status}
                </div>
              </div>

              {/* Mô tả */}
              <div className="flex flex-col">
                <span className="text-gray-600 text-lg mb-2">Mô tả</span>
                <textarea
                  className="border rounded-md p-2 w-full text-lg min-h-[100px]"
                  value={service.description}
                  disabled
                />
              </div>

              {/* Ngày tạo - Cập nhật */}
              <div className="flex flex-col">
                <span className="text-gray-600 text-lg mb-2">Ngày tạo</span>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full text-lg"
                  value={new Date(service.createTime).toLocaleDateString("vi-VN")}
                  disabled
                />
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() => navigate("/employee/service")}
                className="px-6 py-2 text-lg bg-blue-900 text-white rounded hover:bg-blue-800"
              >
                Quay lại
              </button>
            </div>
          </div>

          {/* Cột phải - Hình ảnh */}
          <div className="w-1/3">
            <h3 className="text-xl font-semibold mb-4">Ảnh dịch vụ</h3>
            <div className="w-full h-[400px] rounded-lg overflow-hidden bg-white border">
              {service.assetUrls && service.assetUrls.length > 0 ? (
                <Image
                  src={service.assetUrls[selectedImage].url}
                  alt="Ảnh dịch vụ"
                  className="w-full h-full object-cover"
                  fallback="data:image/png;base64,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"
                  preview={{
                    mask: "Xem ảnh",
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Không có ảnh</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
