import React, { useState, useEffect } from "react";
import { Modal, message } from "antd";
import {
  updateOrderDetail,
  getProcessesByServiceId,
  getOrderDetailById,
} from "../../../api/order";
import ComUpImg from "../../../Components/ComUpImg/ComUpImg";
import { firebaseImgs } from "../../../upImgFirebase/firebaseImgs";

const UpdateOrderDetailModal = ({
  visible,
  onClose,
  orderDetailId,
  fetchOrderData,
  serviceId,
}) => {
  const [processState, setProcessState] = useState("");
  const [assetUrls, setAssetUrls] = useState([{ url: "", type: "image" }]);
  const [processes, setProcesses] = useState([]);
  const [images, setImages] = useState([]);

  //   console.log("Service ID nhận được trong modal:", serviceId);

  useEffect(() => {
    if (visible) {
      const fetchProcesses = async () => {
        try {
          const data = await getProcessesByServiceId(serviceId);
          setProcesses(data.data.items);
        } catch (error) {
          message.error("Không thể lấy trạng thái dịch vụ!");
        }
      };

      const fetchOrderDetail = async () => {
        try {
          const orderDetail = await getOrderDetailById(orderDetailId);
          if (orderDetail && orderDetail.data) {
            setProcessState(orderDetail.data.processState);
            const fetchedAssetUrls = orderDetail.data.assetUrls || [];
            console.log("Dữ liệu assetUrls nhận được:", fetchedAssetUrls);
            if (fetchedAssetUrls.length > 0) {
              setAssetUrls(fetchedAssetUrls);
            } else {
              message.warning("Không có hình ảnh nào được tìm thấy!");
            }
            setImages(orderDetail.data.images || []);
          } else {
            message.error("Không có dữ liệu chi tiết đơn hàng!");
          }
        } catch (error) {
          message.error("Không thể lấy chi tiết đơn hàng!");
        }
      };

      fetchProcesses();
      fetchOrderDetail();
    }
  }, [visible, serviceId, orderDetailId]);

  const handleUpdateDetail = async () => {
    try {
      if (!Array.isArray(images) || images.length === 0) {
        throw new Error("Hình ảnh không hợp lệ!");
      }

      const imageUrls = await firebaseImgs(images);
      if (!imageUrls || imageUrls.length === 0) {
        throw new Error("Không có URL hình ảnh nào được tạo ra!");
      }

      const updatedAssetUrls = [
        ...assetUrls,
        ...imageUrls.map((url) => ({ url, type: "image" })),
      ];

      console.log("Dữ liệu gửi đi cho updateOrderDetail:", {
        orderDetailId,
        processState,
        updatedAssetUrls,
      });

      await updateOrderDetail(orderDetailId, processState, updatedAssetUrls);
      message.success("Cập nhật chi tiết đơn hàng thành công!");
      onClose();
      fetchOrderData();
    } catch (error) {
      console.error("Lỗi khi cập nhật chi tiết đơn hàng:", error);
      message.error("Cập nhật chi tiết đơn hàng thất bại!");
    }
  };

  const onChangeImages = (data) => {
    if (Array.isArray(data)) {
      const newImages = data.map((file) => file.originFileObj);
      setImages(newImages);
    } else {
      console.error("Dữ liệu hình ảnh không hợp lệ:", data);
      setImages([]);
    }
  };

  return (
    <Modal
      title={<span className="text-[#002278]">Cập nhật chi tiết đơn hàng</span>}
      visible={visible}
      onOk={handleUpdateDetail}
      onCancel={onClose}
    >
      <div>
        <div className="mb-4">
          <label className="mb-2">Trạng thái xử lý dịch vụ:</label>
          <select
            value={processState}
            onChange={(e) => setProcessState(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Chọn trạng thái</option>
            {processes.map((process) => (
              <option key={process.id} value={process.process}>
                {process.process}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <label>Hình ảnh của giày trước và sau khi làm dịch vụ:</label>
          <div className="flex flex-wrap">
            <div className="ml-4 flex flex-wrap">
              {assetUrls.map((asset) =>
                asset.url ? (
                  <img
                    key={asset.id}
                    src={asset.url}
                    alt={`Asset ${asset.id}`}
                    className="w-auto h-auto mb-2 max-w-[100px] max-h-[100px] mr-2"
                  />
                ) : (
                  <p key={asset.id} className="text-red-500">
                    Không có URL hình ảnh!
                  </p>
                )
              )}
            </div>
            <ComUpImg onChange={onChangeImages} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateOrderDetailModal;
