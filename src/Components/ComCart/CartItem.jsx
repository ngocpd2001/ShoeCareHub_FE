import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./CartItem.css";
import { updateCartItemQuantity, deleteCartItem } from "../../api/cart";

const CartItem = ({ service, userId, onQuantityChange, onRemove, onToggleSelect }) => {
  // console.log("Service", service);

  const [inputValue, setInputValue] = useState(service.quantity || 0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const price = service.promotion && service.promotion.newPrice ? service.promotion.newPrice : service.price;
    setTotalPrice(price * inputValue);
  }, [inputValue, service]);

  const handleQuantityChange = async (e) => {
    const updatedQuantity = parseInt(e.target.value, 10);
    console.log('userId:', userId, 'serviceId:', service.id, 'quantity:', updatedQuantity);
    if (!userId) {
      console.error('User ID is undefined for service:', service);
      return;
    }
    if (!isNaN(updatedQuantity) && updatedQuantity >= 0) {
      try {
        await updateCartItemQuantity(service.id, updatedQuantity);
        onQuantityChange(service.id, updatedQuantity - service.quantity);
        setInputValue(updatedQuantity);
        service.quantity = updatedQuantity;
      } catch (error) {
        console.error('Có lỗi xảy ra khi cập nhật số lượng:', error);
      }
    } else {
      setInputValue(e.target.value);
    }
  };

  const handleIncrease = async () => {  
    console.log('userId:', userId, 'serviceId:', service.id, 'quantity:', inputValue + 1);  
    if (!userId) {  
      console.error('User ID is undefined for service:', service);  
      return;  
    }  
    try {  
      await updateCartItemQuantity(service.id, inputValue + 1);  
      setInputValue(inputValue + 1);
      service.quantity = inputValue + 1;
    } catch (error) {  
      console.error('Có lỗi xảy ra:', error);  
    }  
  };

  const handleDecrease = async () => {
    console.log('userId:', userId, 'serviceId:', service.id, 'quantity:', inputValue - 1);
    if (!userId) {
      console.error('User ID is undefined for service:', service);
      return;
    }
    if (inputValue > 1) {
      const newQuantity = inputValue - 1;
      try {
        await updateCartItemQuantity(service.id, newQuantity);
        setInputValue(newQuantity);
        service.quantity = newQuantity;
      } catch (error) {
        console.error('Có lỗi xảy ra:', error);
      }
    }
  };

  const handleRemove = async () => {
    try {
      await deleteCartItem(service.id);
      setInputValue("");
      onRemove(service.id);
    } catch (error) {
      console.error('Có lỗi xảy ra khi xóa mục:', error);
    }
  };

  // Kiểm tra giá trị userId
  // console.log("User ID trong CartItem:", userId);

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
            onFocus={() => setInputValue("")}
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
          {totalPrice.toLocaleString()}{" "} đ
        </span>

        <button onClick={handleRemove} className="text-[#002278] w-[30%]">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
