import React from "react";
import CartItem from "../ComCart/CartItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore } from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-regular-svg-icons";

const ShopCart = ({
  shop,
  onQuantityChange,
  onRemove,
  onToggleSelectAll,
  onToggleSelect,
}) => {
  return (
    <div className="mb-6 border rounded-lg bg-white">
      <div className="flex items-center py-3 border-b bg-[#F9F1E7] px-[31px]">
        <input
          type="checkbox"
          checked={shop.products.every((product) => product.selected)}
          onChange={(e) => onToggleSelectAll(shop.shopName, e.target.checked)}
          className="mr-4"
        />
        <FontAwesomeIcon icon={faStore} className="text-[#002278] mr-3" />
        <h2 className="text-xl font-bold text-[#002278] mr-2">
          {shop.shopName}
        </h2>
        <FontAwesomeIcon
          icon={faMessage}
          className="text-[#002278] bg-[#F9F1E7]"
        />
      </div>
      <div className="px-4">
        {shop.products.map((product) => (
          <CartItem
            key={product.id}
            product={product}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
            onToggleSelect={onToggleSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default ShopCart;
