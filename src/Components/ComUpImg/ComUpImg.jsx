import React, { useState } from 'react';
import { Modal, Upload, message } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
const ComUpImg = ({
  onChange,
  numberImg,
  listType,
  multiple,
  inputId,
  required,
  label,
}) => {
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
  const maxImages = numberImg || 15;
  const isImageFile = (file) => {
    const acceptedFormats = [".jpeg", ".jpg", ".png", ".gif", ".mp4"];
    const fileExtension = file.name.toLowerCase();

    if (!acceptedFormats.some((format) => fileExtension.endsWith(format))) {
      message.error("Chỉ cho phép chọn các tệp hình ảnh và video.");
      return false; // Ngăn tải lên nếu không phải là hình ảnh
    }

    return true;
  };

  const handleFileChange = ({ fileList }) => {
    const filteredFileList = fileList.filter((file) => isImageFile(file));
    if (filteredFileList.length > maxImages) {
      message.error(`Chỉ được chọn tối đa ${maxImages} ảnh.`);
      const firstFiveImages = filteredFileList.slice(0, maxImages);
      setFileList(firstFiveImages);
      onChange(firstFiveImages);
    } else {
      setFileList(filteredFileList);
      onChange(filteredFileList);
    }
  };
    const handlePreview = async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
      setPreviewOpen(true);
    };

    const getBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    const handleCancelPreview = () => setPreviewOpen(false);
  return (
    <>
      {label && (
        <div className="mb-4 flex justify-between">
          <label htmlFor={inputId} className="text-paragraph font-medium">
            {label}
            {required && (
              <span className="text-paragraph font-medium text-error-7 text-red-500">
                *
              </span>
            )}
          </label>
        </div>
      )}
      <Upload
        fileList={fileList}
        listType={listType || "picture-card"}
        onChange={handleFileChange}
        onPreview={handlePreview}
        beforeUpload={() => false} // Để tránh tải lên tự động
        accept=".jpg,.jpeg,.png,.gif," // Chỉ cho phép chọn các tệp hình ảnh
        multiple={multiple || true} // Cho phép chọn nhiều tệp
      >
        <PlusOutlined />
      </Upload>
      <Modal
        open={previewOpen}
        // title={previewTitle}
        footer={null}
        onCancel={handleCancelPreview}
      >
        <img className='mt-8' alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default ComUpImg;
