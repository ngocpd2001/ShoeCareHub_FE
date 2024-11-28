import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./CartItem.css";
// import { updateCartItemQuantity, deleteCartItem } from "../../api/cart";
import { Image } from "antd";
import { getMaterialById } from "../../api/material";

const CartItem = ({
  service,
  userId,
  onRemove,
  onSelect,
  material,
  materialPrice,
}) => {
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const price =
      service.promotion && service.promotion.newPrice
        ? service.promotion.newPrice + materialPrice
        : service.price + materialPrice;

    setTotalPrice(price);
  }, [service, materialPrice]);

  useEffect(() => {
    if (service.materialId) {
      const fetchMaterialData = async () => {
        try {
          const materialData = await getMaterialById(service.materialId);
          // Xử lý dữ liệu phụ kiện ở đây
        } catch (error) {
          console.error("Lỗi khi lấy thông tin phụ kiện:", error);
        }
      };
      fetchMaterialData();
    }
  }, [service.materialId]);

  const handleRemoveClick = () => {
    onRemove(service.id);
  };

  return (
    <div className="grid grid-cols-3 items-center p-4 border-b">
      <div className="flex items-center col-span-1">
        <input
          type="checkbox"
          checked={service.selected}
          onChange={() => onSelect(service.id)}
          className="mr-2"
        />
        <div className="w-12 h-12 flex items-center justify-center overflow-hidden mr-4">
          {service.image ? (
            <Image.PreviewGroup
              preview={{
                onChange: (current, prev) =>
                  console.log(`Switched from preview ${prev} to ${current}`),
              }}
            >
              <Image
                src={service.image}
                alt={service.name}
                className="object-cover w-full h-full"
                fallback="data:image/png;base64,..."
                preview={{
                  mask: "Xem ảnh",
                  urls: [service.image],
                }}
              />
            </Image.PreviewGroup>
          ) : (
            <div className="w-12 h-12 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span>{service.name}</span>
          {service.material && (
            <div className="flex flex-col">
              <span className="text-sm text-gray-800">
                Phụ kiện: {service.material}
              </span>
              {materialPrice > 0 && (
                <div className="text-sm text-gray-600">
                  Giá phụ kiện: {materialPrice.toLocaleString()} đ
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="text-center item-center col-span-1 flex justify-center">
        <div className="flex flex-col">
          {service.promotion && service.promotion.newPrice ? (
            <>
              <div className="text-[#002278] font-bold max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
                {service.promotion.newPrice.toLocaleString()} đ
              </div>
              <div className="line-through text-gray-500 max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
                {service.price.toLocaleString()} đ
              </div>
            </>
          ) : (
            <div className="text-[#002278] font-bold max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
              {service.price.toLocaleString()} đ
            </div>
          )}
        </div>
      </div>

      <div className="col-span-1 flex flex-row items-center justify-center">
        <span className="w-[70%] text-center max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
          {totalPrice.toLocaleString() + " đ"}
        </span>

        <button onClick={handleRemoveClick} className="text-[#002278] w-[30%]">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
