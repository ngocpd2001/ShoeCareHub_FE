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

  useEffect(() => {  
    if (visible) {  
      setImages([]);  
      setAssetUrls([{ url: "", type: "image" }]);  

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
            if (fetchedAssetUrls.length > 0) {  
              setAssetUrls(fetchedAssetUrls);  
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
    } else {  
      setImages([]);  
      setAssetUrls([{ url: "", type: "image" }]);  
    }  
  }, [visible, serviceId, orderDetailId]);  

  const handleUpdateDetail = async () => {  
    try {  
      const imageUrls = images.length > 0 ? await firebaseImgs(images) : [];  
      const updatedAssetUrls = [  
        ...assetUrls.filter((asset) => asset.url),  
        ...imageUrls.map((url) => ({ url, type: "image" })),  
      ];  

      // Reset images state after upload  
      if (imageUrls.length > 0) {  
        setImages([]); // Reset images state  
        // Thêm dòng này để xóa hình ảnh trong ComUpImg
        onChangeImages([]); // Gọi hàm onChangeImages với mảng rỗng
      }  

      await updateOrderDetail(orderDetailId, processState, updatedAssetUrls);
      message.success("Cập nhật chi tiết đơn hàng thành công!");
      onClose();
      fetchOrderData();
      
      // Đặt lại trạng thái hình ảnh và assetUrls
      setImages([]);
      setAssetUrls([{ url: "", type: "image" }]); // Đặt lại về giá trị mặc định
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

  const handleImageDelete = (index) => {  
    const newAssetUrls = assetUrls.filter((_, i) => i !== index);  
    setAssetUrls(newAssetUrls);  
    handleImageDelete(index); 
  };  

  return (  
    <Modal  
      title={<span className="text-[#002278]">Cập nhật chi tiết đơn hàng</span>}  
      visible={visible}  
      onOk={handleUpdateDetail}  
      onCancel={() => {  
        setImages([]);  
        setAssetUrls([{ url: "", type: "image" }]);  
        onClose();  
      }}  
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
            {Array.isArray(processes) && processes.map((process) => (  
              <option key={process.id} value={process.process}>  
                {process.process}  
              </option>  
            ))}  
          </select>  
        </div>  
        <div className="mt-4">
        <label>Hình ảnh của giày trước và sau khi làm dịch vụ:</label>
        <div className="flex gap-4 flex-wrap">
          {images.length > 0 && images.map((asset, index) => (
            asset.url ? (
              <div key={index} className="relative w-[84px]">
                <img
                  src={asset.url}
                  alt={`Asset ${index + 1}`}
                  className="w-full h-[84px] object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-0 right-0 text-red-500 bg-white rounded-full p-1"
                >
                  Xóa
                </button>
              </div>
            ) : null
          ))}

          {images.length === 0 && <div>Chưa có hình ảnh nào.</div>}

          <ComUpImg onChange={onChangeImages} onDelete={handleDeleteImage} />
        </div>
      </div>
      </div>  
    </Modal>  
  );  
};  

export default UpdateOrderDetailModal;