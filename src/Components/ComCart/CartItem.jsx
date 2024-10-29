import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./CartItem.css";
import { getServiceById } from "../../api/service";

const CartItem = ({
  service = {},
  onQuantityChange,
  onRemove,
  onToggleSelect,
  // updateServiceQuantity,
  // fetchServiceDetails,
}) => {
  const [inputValue, setInputValue] = useState(service.quantity || 0);

  useEffect(() => {
    if (service.quantity !== undefined) {
      setInputValue(service.quantity);
    }
  }, [service.quantity]);

  if (!service.id) {
    return null;
  }

  const price = service && service.price ? service.price.toLocaleString("vi-VN") : "N/A";

  const handleQuantityChange = (e) => {
    const updatedQuantity = parseInt(e.target.value, 10);
    if (!isNaN(updatedQuantity) && updatedQuantity >= 0) {
      onQuantityChange(service.id, updatedQuantity - service.quantity);
      setInputValue(updatedQuantity);
    } else {
      setInputValue(0);
    }
  };

  const handleIncrease = () => {
    const newQuantity = inputValue + 1;
    console.log("Tăng số lượng:", newQuantity);
    onQuantityChange(service.id, 1);
    setInputValue(newQuantity);
  };
  
  const handleDecrease = () => {
    if (inputValue > 0) {
      const newQuantity = inputValue - 1;
      console.log("Giảm số lượng:", newQuantity);
      onQuantityChange(service.id, -1);
      setInputValue(newQuantity);
    }
  };

  const handleRemove = () => {
    setInputValue("");
    onRemove(service.id);
  };

  return (
    <div className="grid grid-cols-4 items-center p-4 border-b">
      <div className="flex items-center col-span-1">
        <input
          type="checkbox"
          checked={service.selected}
          onChange={() => onToggleSelect(service.id)}
          className="mr-4"
        />
        <img
          src={service.image}
          alt={service.name}
          className="w-12 h-12 mr-4"
        />
        <span className="max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
          {service.name}
        </span>
      </div>

      <div className="text-center col-span-1">
        {service.promotion && service.promotion.newPrice ? (
          <>
            <div className="text-[#002278] font-bold max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
              {(service.promotion.newPrice || 0).toLocaleString()} đ
            </div>
            <div className="line-through text-gray-500 max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
              {(service.price || 0).toLocaleString()} đ
            </div>
          </>
        ) : (
          <div className="text-[#002278] font-bold max-w-xs break-words whitespace-normal overflow-hidden overflow-ellipsis">
            {price}đ
          </div>
        )}
      </div>

      <div className="col-span-1 flex items-center justify-center">
        <div className="flex flex-row items-center justify-center border-[#002278] border-2 w-26 h-7">
          <button
            onClick={handleDecrease}
            className="flex items-center justify-center w-10 h-full border-r-2 border-[#002278] text-lg"
            disabled={inputValue <= 0}
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
            ((service.promotion && service.promotion.newPrice) || service.price || 0) *
            service.quantity
          ).toLocaleString()}{" "}
          đ
        </span>

        <button onClick={() => onRemove(service.id)} className="text-[#002278] w-[30%]">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
