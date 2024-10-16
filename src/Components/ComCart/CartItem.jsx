import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const CartItem = ({ product, onQuantityChange, onRemove, onToggleSelect }) => {
  return (
    <div className="grid grid-cols-4 items-center p-4 border-b">
      <div className="flex items-center col-span-1">
        <input
          type="checkbox"
          checked={product.selected}
          onChange={() => onToggleSelect(product.id)}
          className="mr-4"
        />
        <img
          src={product.image}
          alt={product.name}
          className="w-12 h-12 mr-4"
        />
        <span className="max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
          {product.name}
        </span>
      </div>

      <div className="text-center col-span-1">
        {product.discountedPrice ? (
          <>
            <div className="text-[#002278] font-bold max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
              {product.discountedPrice.toLocaleString()} đ
            </div>
            <div className="line-through text-gray-500 max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
              {product.originalPrice.toLocaleString()} đ
            </div>
          </>
        ) : (
          <div className="text-[#002278] font-bold max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
            {product.originalPrice.toLocaleString()} đ
          </div>
        )}
      </div>

      <div className="col-span-1 flex items-center justify-center">
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
          {/* <input
            type="number"
            value={product.quantity}
            onChange={(e) => onQuantityChange(product.id, e.target.value)} 
            className="flex items-center justify-center w-10 h-full border-r-2 border-[#002278] text-xl text-center"
            min={1}
          /> */}
          <button
            onClick={() => onQuantityChange(product.id, 1)}
            className="flex items-center justify-center w-10 h-full text-lg"
          >
            +
          </button>
        </div>
      </div>
      
      <div className="col-span-1 flex flex-row items-center justify-center">
        <span className="w-[70%] text-center max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
          {(
            (product.discountedPrice || product.originalPrice) *
            product.quantity
          ).toLocaleString()}{" "}
          đ
        </span>

        <button
          onClick={() => onRemove(product.id)}
          className="text-[#002278] w-[30%]"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
