import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const CartItem = ({ product, onQuantityChange, onRemove, onToggleSelect }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={product.selected}
          onChange={() => onToggleSelect(product.id)}
          className="mr-4"
        />
        <img
          src={product.image}
          alt={product.name}
          className="w-18 h-18 mr-4"
        />
        <span>{product.name}</span>
      </div>

      {/* Price display logic */}
      <div className="text-right">
        {product.discountedPrice ? (
          <>
            <div className="text-[#002278] font-bold">
              {product.discountedPrice.toLocaleString()} đ
            </div>
            <div className="line-through text-gray-500">
              {product.originalPrice.toLocaleString()} đ
            </div>
          </>
        ) : (
          <div className="text-[#002278] font-bold">
            {product.originalPrice.toLocaleString()} đ
          </div>
        )}
      </div>

      <div className="flex flex-row items-center justify-center border-[#002278] border-2 w-26 h-7">
        <button
          onClick={() => onQuantityChange(product.id, -1)}
          className="flex items-center justify-center w-10 h-full border-r-2 border-[#002278] text-lg"
        >
          -
        </button>
        <span className="flex items-center justify-center w-10 h-full border-r-2 border-[#002278] text-xl">
          {product.quantity}
        </span>
        <button
          onClick={() => onQuantityChange(product.id, 1)}
          className="flex items-center justify-center w-10 h-full text-lg"
        >
          +
        </button>
      </div>

      <span>
        {((product.discountedPrice || product.originalPrice) * product.quantity).toLocaleString()}{" "} đ
      </span>

      <button onClick={() => onRemove(product.id)} className="text-[#002278]">
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
};

export default CartItem;
