import React, { useEffect, useState } from "react";
import CartItem from "../ComCart/CartItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import { getBranchByBranchId } from "../../api/branch";

const ShopCart = ({
  shop,
  userId,
  onQuantityChange,
  onRemove,
  onSelectAll,
  onSelect,
}) => {
  const [branchData, setBranchData] = useState(null);
  // console.log("Shop", shop);
  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        const data = await getBranchByBranchId(shop.branchId);
        setBranchData(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thương hiệu:", error);
      }
    };

    if (shop.branchId) {
      fetchBranchData();
    }
  }, [shop.branchId]);
  return (
    <div className="mb-6 border rounded-lg bg-white">
      {branchData && (
        <div className="grid grid-cols-2 gap-4 py-3 border-b bg-[#F9F1E7] px-[31px]">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={shop.services.every(service => service.selected)}
              onChange={() => onSelectAll(shop.branchId)}
              className="mr-2"
            />
            <FontAwesomeIcon icon={faStore} className="text-[#002278] mr-3" />
            <h2 className="text-xl font-medium text-[#002278] mr-2 max-w-sm break-words whitespace-normal overflow-hidden overflow-ellipsis">
              {branchData.name}
            </h2>
            <FontAwesomeIcon
              icon={faMessage}
              className="text-[#002278] bg-[#F9F1E7]"
            />
          </div>

          <div className="flex items-center justify-end">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="text-[#002278] bg-[#F9F1E7] mr-3"
            />
            <h2 className="text-lg text-[#002278] max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
              {branchData.address}
            </h2>
          </div>
        </div>
      )}

      <div className="px-4">
        {shop.services.map(service => (
          <CartItem
            key={service.id}
            service={service}
            userId={userId}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default ShopCart;
