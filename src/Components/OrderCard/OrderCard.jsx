import React from "react";
import { MessageSquare, Store } from "lucide-react";
import ComModal from "./../ComModal/ComModal";
import { useModalState } from "./../../hooks/useModalState";
import ServiceReviewForm from "./ServiceReviewForm";
import { Link } from "react-router-dom";

const CartItem = ({ item }) => (
  <div className="flex items-center py-4 border-b">
    <img
      src={item?.service?.assetUrls && item?.service?.assetUrls[0]?.url}
      alt={item.name}
      className="w-20 h-20 object-cover mr-4"
    />
    <div className="flex-grow">
      <h3 className="font-medium">{item?.service?.name}</h3>
      <p className="text-sm text-gray-500">x{item.quantity}</p>
    </div>
    <div className="text-right">
      <p className="text-sm text-gray-500 line-through">
        {item?.service?.price.toLocaleString()}đ
      </p>
      <p className="font-bold text-blue-600">{item.price.toLocaleString()}đ</p>
    </div>
  </div>
);

export default function OrderCard({ order }) {
  const modalFeedback = useModalState();

  const cartItems = [
    {
      id: 1,
      name: "Dịch vụ giặt giày siêu sạch222",
      quantity: 1,
      price: 123000,
      originalPrice: 200000,
      image:
        "https://bizweb.dktcdn.net/100/431/113/files/san-pham-ve-sinh-giay-sneaker.jpg?v=1628575452717",
    },
    {
      id: 2,
      name: "Dịch vụ giặt giày siêu sạch",
      quantity: 1,
      price: 123000,
      originalPrice: 200000,
      image:
        "https://bizweb.dktcdn.net/100/431/113/files/san-pham-ve-sinh-giay-sneaker.jpg?v=1628575452717",
    },
  ];

  console.log(order);
  

  return (
    <div className=" mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-[#7F7F7F]">
      <div className="p-4 bg-white flex  justify-between items-center border-b border-black">
        <div className="flex items-center ">
          <h2 className="text-lg font-bold mr-4">
            {order.orderDetails && order.orderDetails[0].branch.name}
          </h2>
          <button className="bg-[#002278] text-white px-3 py-1 rounded-md text-sm flex items-center mr-2">
            <MessageSquare size={16} className="mr-1" />
            Chat
          </button>
          <Link
            to={`/branch/${
              order?.orderDetails && order?.orderDetails[0].branch.businessId
            }`}
            className="bg-white text-[#4e4e4e] border border-[#555555] px-3 py-1 rounded-md text-sm flex items-center"
          >
            <Store size={16} className="mr-1" />
            Xem shop
          </Link>
        </div>
        <div className="flex gap-1">
          <span className=" font-medium text-center">Chi tiết</span>
          <span className=" font-medium">|</span>
          <span className="text-blue-800 font-medium text-center">
            {order.status}
          </span>
        </div>
      </div>
      <div className="p-4">
        {order?.orderDetails &&
          order?.orderDetails.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
      </div>
      <div className="p-4 bg-white  border-t border-[#7F7F7F]">
        <div className="flex justify-end  gap-2 items-center mb-4 ">
          <span className="font-medium">Phí giao:</span>
          <span className="font-bold text-[#002278] text-xl">
            {order?.deliveredFee?.toLocaleString()}đ
          </span>
        </div>
        <div className="flex justify-end  gap-2 items-center mb-4 ">
          <span className="font-medium">Phí dịch vụ:</span>
          <span className="font-bold text-[#002278] text-xl">
            {order?.orderPrice?.toLocaleString()}đ
          </span>
        </div>
        <div className="flex justify-end  gap-2 items-center mb-4 ">
          <span className="font-medium">Thành tiền:</span>
          <span className="font-bold text-[#002278] text-xl">
            {order?.totalPrice?.toLocaleString()}đ
          </span>
        </div>
        <div className="flex justify-end gap-2">
          <button className="bg-[#002278] text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Mua lại
          </button>
          <button
            onClick={modalFeedback.handleOpen}
            className="bg-white text-[#002278] border border-[#002278] px-6 py-2 rounded-md hover:bg-blue-50 transition-colors"
          >
            Đánh giá
          </button>
        </div>
      </div>
      <ComModal
        isOpen={modalFeedback?.isModalOpen}
        onClose={modalFeedback?.handleClose}
        width={700}
      >
        <ServiceReviewForm data={order} onClose={modalFeedback?.handleClose} />
      </ComModal>
    </div>
  );
}
