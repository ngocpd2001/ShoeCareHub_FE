import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faUpload, faLink } from "@fortawesome/free-solid-svg-icons";
import { createChildTicket } from "../../api/ticket";
import { Image, notification } from "antd";
import { firebaseImgs } from "../../upImgFirebase/firebaseImgs";

const ReplyTicketModal = ({ ticketId, onClose, onSuccess }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [linkInput, setLinkInput] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [title, setTitle] = useState("");

  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    
    const validFiles = files.filter(file => 
      allowedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      notification.warning({
        message: "Cảnh báo",
        description: "Chỉ chấp nhận file ảnh (JPG, PNG, GIF) và dung lượng dưới 10MB",
      });
    }

    const newAttachments = validFiles.map(file => ({
      url: URL.createObjectURL(file),
      type: 'IMAGE',
      file: file
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const handleAddLink = () => {
    try {
      const url = new URL(linkInput);
      const isImage = /\.(jpg|jpeg|png|gif)$/i.test(url.pathname);
      const isVideo = /\.(mpmov|avi)$/i.test(url.pathname);

      setAttachments(prev => [...prev, {
        url: linkInput,
        type: isImage ? 'IMAGE' : 'VIDEO'
      }]);
      setLinkInput('');
      setShowLinkInput(false);
    } catch (error) {
      console.error("Link không hợp lệ");
    }
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let assets = [];
      const files = attachments
        .filter(att => att.file)
        .map(att => att.file);

      if (files.length > 0) {
        const uploadedUrls = await firebaseImgs(files);
        assets = uploadedUrls.map(url => ({
          url: url,
          type: url.includes('mp4') ? 'VIDEO' : 'IMAGE'
        }));
      }

      // Tạo payload JSON thay vì FormData
      const payload = {
        title: title,
        content: content,
        assets: assets
      };

      // Gọi API với payload JSON
      await createChildTicket(ticketId, payload);
      
      notification.success({
        message: "Thành công",
        description: "Đã gửi phản hồi thành công",
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Chi tiết lỗi:", error);
      notification.error({
        message: "Lỗi",
        description: error.response?.data?.message || "Không thể gửi phản hồi",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl my-8">
        <div className="bg-[#002278] text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-semibold">Phản hồi khiếu nại</h2>
          <button onClick={onClose} className="hover:opacity-80">
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* <div className="mb-4">
            <label className="block text-gray-700 mb-2">Tiêu đề phản hồi</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg p-3"
              placeholder="Nhập tiêu đề phản hồi"
              required
            />
          </div> */}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nội dung phản hồi</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded-lg p-3 min-h-[150px]"
              required
            />
          </div>

          {/* File Upload Section */}
          <div className="mb-4">
            <div className="flex gap-3 mb-4">
              <label className="text-[#002278] border border-[#002278] px-4 py-2 rounded-md hover:bg-[#002278] hover:text-white flex items-center gap-2 cursor-pointer">
                <FontAwesomeIcon icon={faUpload} />
                <span>Tải lên ảnh</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {/* <button
                type="button"
                className="text-[#002278] border border-[#002278] px-4 py-2 rounded-md hover:bg-[#002278] hover:text-white flex items-center gap-2"
                onClick={() => setShowLinkInput(!showLinkInput)}
              >
                <FontAwesomeIcon icon={faLink} />
                <span>Thêm link</span>
              </button> */}
            </div>

            {/* Link Input */}
            {showLinkInput && (
              <div className="flex gap-2 mb-4">
                <input
                  type="url"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="Nhập link ảnh hoặc video"
                  className="flex-1 border rounded-md px-3 py-2"
                />
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="bg-[#002278] text-white px-4 py-2 rounded-md hover:bg-opacity-90"
                >
                  Thêm
                </button>
              </div>
            )}

            {/* Preview Attachments */}
            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-medium text-gray-700">Ảnh đính kèm:</h3>
                <div className="flex flex-wrap gap-4">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="relative group w-24 h-24">
                      <Image
                        src={attachment.url}
                        alt={`Attachment ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#002278] text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
            >
              {loading ? "Đang gửi..." : "Gửi phản hồi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReplyTicketModal;
