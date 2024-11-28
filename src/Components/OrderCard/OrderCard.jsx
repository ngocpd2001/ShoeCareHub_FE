import React from "react";
import { MessageSquare, Store } from "lucide-react";
import ComModal from "./../ComModal/ComModal";
import { useModalState } from "./../../hooks/useModalState";
import ServiceReviewForm from "./ServiceReviewForm";
import { Link, useNavigate } from "react-router-dom";
import ServiceViewReviewForm from "./ServiceViewReviewForm";
import { useStorage } from "../../hooks/useLocalStorage";
import { isWithin7Days } from "../../utils/dateUtils";
import confirm from "antd/es/modal/confirm";
import { message, Modal, Steps } from "antd";
import { putData } from "../../api/api";
import StepsDetail from "./StepsDetail";
import StepsDetailProcess from "./StepsDetailProcess";

const CartItem = ({ item }) => {
  const modalDetailProcess = useModalState();
  return (
    <div className="flex items-center py-4 border-b">
      <ComModal
        isOpen={modalDetailProcess?.isModalOpen}
        onClose={modalDetailProcess?.handleClose}
        width={700}
      >
        <StepsDetailProcess orderCode={item} />
      </ComModal>
      <Link to={`/servicedetail/${item?.service?.id}`}>
        <img
          src={item?.service?.assetUrls && item?.service?.assetUrls[0]?.url}
          alt={item.name}
          className="w-20 h-20 object-cover mr-4"
        />
      </Link>
      <div className="flex-grow">
        <Link
          to={`/servicedetail/${item?.service?.id}`}
          className="font-medium"
        >
          {item?.service?.name}
        </Link>
        {/* <p className="text-sm text-gray-500">{item.quantity}</p> */}
        <p className="text-sm text-gray-500 max-w-50 truncate">
          {item?.service?.description}
        </p>
      </div>
      <div className="text-right">
        <button
          onClick={modalDetailProcess.handleOpen}
          className="text-blue-600 mb-4"
        >
          Chi tiết
        </button>
        <p className="text-sm text-gray-500 line-through">
          {item?.service?.price.toLocaleString()}đ
        </p>
        <p className="font-bold text-blue-600">
          {item.price.toLocaleString()}đ
        </p>
      </div>
    </div>
  );
};

export default function OrderCard({ order, reloadData }) {
  const [user, setUser] = useStorage("user", null);
  const modalFeedback = useModalState();
  const modalDetail = useModalState();

  const modalViewFeedback = useModalState();
  const modalCanceled = useModalState();
  const navigate = useNavigate();

  console.log(123, order);
  const showConfirm = () => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn hủy đơn hàng không?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Đồng ý",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        putData(`/orders`, `${order.id}/status?status=CANCELED`)
          .then((data) => {
            message.success(`Hủy đơn hàng thành công `);
            reloadData();
          })
          .catch((error) => {
            console.log(error);
            message.error(
              `Huỷ đơn hàng không thành công vui lòng kiểm tra lại`
            );
          });
      },
      onCancel() {
        console.log("Hủy thao tác");
      },
    });
  };
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
            to={`/provider-landingpage/${
              order?.orderDetails && order?.orderDetails[0].branch.businessId
            }`}
            className="bg-white text-[#4e4e4e] border border-[#555555] px-3 py-1 rounded-md text-sm flex items-center mr-2"
          >
            <Store size={16} className="mr-1" />
            Xem shop
          </Link>
          {order.status === "Hoàn thành" &&
            isWithin7Days(order.finishedTime) && (
              <button
                onClick={() =>
                  navigate("/user/create-ticket-order", {
                    state: { orderId: order.id },
                  })
                }
                className="bg-red-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
              >
                Khiếu nại
              </button>
            )}
        </div>
        <div className="flex gap-1">
          {order?.shippingCode && (
            <button
              onClick={modalDetail.handleOpen}
              className=" font-medium text-center"
            >
              Chi tiết
            </button>
          )}
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
        {order.status === "Đang chờ" && (
          <div className="flex justify-end gap-2">
            <button
              onClick={showConfirm}
              className="bg-red-700 text-white border border-[#000] px-6 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Hủy đơn hàng
            </button>
          </div>
        )}
        {order.status === "Hoàn thành" && (
          <div className="flex justify-end gap-2">
            {/* <button className="bg-[#002278] text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Đặt lại
            </button> */}
            {order?.orderDetails && order?.orderDetails[0]?.feedback ? (
              <button
                onClick={modalViewFeedback.handleOpen}
                className="bg-white text-[#002278] border border-[#002278] px-6 py-2 rounded-md hover:bg-blue-50 transition-colors"
              >
                Xem đánh giá
              </button>
            ) : (
              <button
                onClick={modalFeedback.handleOpen}
                className="bg-white text-[#002278] border border-[#002278] px-6 py-2 rounded-md hover:bg-blue-50 transition-colors"
              >
                Đánh giá
              </button>
            )}
          </div>
        )}
      </div>

      <ComModal
        isOpen={modalDetail?.isModalOpen}
        onClose={modalDetail?.handleClose}
        width={700}
      >
        <StepsDetail orderCode={order?.shippingCode} />
      </ComModal>

      <ComModal
        isOpen={modalFeedback?.isModalOpen}
        onClose={modalFeedback?.handleClose}
        width={700}
      >
        <ServiceReviewForm
          data={order}
          onClose={modalFeedback?.handleClose}
          reloadData={reloadData}
        />
      </ComModal>

      <ComModal
        isOpen={modalViewFeedback?.isModalOpen}
        onClose={modalViewFeedback?.handleClose}
        width={700}
      >
        <ServiceViewReviewForm
          data={order}
          onClose={modalViewFeedback?.handleClose}
        />
      </ComModal>
    </div>
  );
}
