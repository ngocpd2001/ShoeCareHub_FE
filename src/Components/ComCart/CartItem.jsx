import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./CartItem.css";

const CartItem = ({
  product,
  onQuantityChange,
  onRemove,
  onToggleSelect,
  // updateProductQuantity,
}) => {
  const [inputValue, setInputValue] = useState(product.quantity); // State để lưu giá trị input

  const handleQuantityChange = (e) => {
    const updatedQuantity = parseInt(e.target.value, 10);
    if (!isNaN(updatedQuantity) && updatedQuantity >= 0) {
      onQuantityChange(product.id, updatedQuantity - product.quantity);
      setInputValue(updatedQuantity); // Cập nhật state với giá trị mới
    } else {
      setInputValue(""); // Xóa giá trị khi không hợp lệ
    }
  };

  const handleIncrease = () => {
    const newQuantity = inputValue + 1;
    onQuantityChange(product.id, 1);
    setInputValue(newQuantity); // Cập nhật state với giá trị mới
  };

  const handleDecrease = () => {
    if (inputValue > 0) {
      const newQuantity = inputValue - 1;
      onQuantityChange(product.id, -1);
      setInputValue(newQuantity); // Cập nhật state với giá trị mới
    }
  };

  const handleRemove = () => {
    setInputValue(""); // Xóa giá trị khi nhấn nút xóa
    onRemove(product.id);
  };

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
            onClick={handleDecrease}
            className="flex items-center justify-center w-10 h-full border-r-2 border-[#002278] text-lg"
          >
            -
          </button>
          <input
            type="number"
            value={inputValue}
            onChange={handleQuantityChange}
            className="w-10 h-full border-r-2 border-[#002278] text-lg text-center cart-item-input"
          />
          <button
            onClick={handleIncrease}
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

        <button onClick={handleRemove} className="text-[#002278] w-[30%]">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
