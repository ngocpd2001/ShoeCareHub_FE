import React, { useEffect, useState } from "react";
import { Upload, message } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";

const ComUpImgOne = ({
  onChange,
  numberImg,
  listType,
  multiple,
  inputId,
  required,
  label,
  imgUrl,
  reset,
}) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(imgUrl);
  const maxImages = numberImg || 5;

  useEffect(() => {
    if (imgUrl) {
      setImageUrl(imgUrl);
    } else {
      setImageUrl("");
    }
  }, [imgUrl]);

  useEffect(() => {
    if (reset) {
      setImageUrl("");
    }
  }, [reset]);

  const isImageFile = (file) => {
    const acceptedFormats = [".jpeg", ".jpg", ".png", ".gif", ".webp"];
    const fileExtension = file.name.toLowerCase();

    if (!acceptedFormats.some((format) => fileExtension.endsWith(format))) {
      message.error("Chỉ cho phép chọn các tệp hình ảnh.");
      return false;
    }

    return true;
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleFileChange = (fileList) => {
    getBase64(fileList.file.originFileObj, (url) => {
      setLoading(false);
      setImageUrl(url);
    });
    onChange(fileList.file.originFileObj);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Hình ảnh</div>
    </button>
  );

  return (
    <>
      <div>
        {label && (
          <div className="mb-4 flex justify-between">
            <label htmlFor={inputId} className="text-paragraph font-bold">
              {label}
              {required && (
                <span className="text-paragraph font-bold text-error-7 text-red-500">
                  *
                </span>
              )}
            </label>
          </div>
        )}
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.gif,.webp"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="avatar"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
              }}
            />
          ) : (
            uploadButton
          )}
        </Upload>
      </div>
    </>
  );
};

export default ComUpImgOne;
