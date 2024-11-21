import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faLink,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCategoryTicket, createTicket } from "../../api/ticket";
import { getCategoryTicketById } from "../../api/categoryTicket";
import { getAccountById } from "../../api/user";
import { useNotification } from "../../Notification/Notification";
import { firebaseImgs } from "../../upImgFirebase/firebaseImgs";

const CreateTicket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCategoryId = location.state?.selectedCategory?.id;
  const [categories, setCategories] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(
    selectedCategoryId || ""
  );
  const [categoryName, setCategoryName] = useState("");
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
  });
  const [attachments, setAttachments] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const { notificationApi } = useNotification();

  useEffect(() => {
    fetchCategories();
    fetchUserInfo();
    if (selectedCategoryId) {
      fetchCategoryName(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const fetchCategories = async () => {
    try {
      const response = await getCategoryTicket();
      if (response.status === "success") {
        setCategories(response.data);
      } else {
        console.error("Lỗi khi lấy danh sách category:", response.message);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách category:", error);
    }
  };

  const fetchCategoryName = async (id) => {
    try {
      const response = await getCategoryTicketById(id);
      if (response.status === "success") {
        setCategoryName(response.data.name);
        setSelectedDepartment(id);
      } else {
        console.error("Lỗi khi lấy thông tin loại phiếu:", response.message);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin loại phiếu:", error);
    }
  };

  const handleDepartmentChange = async (e) => {
    const newId = e.target.value;
    setSelectedDepartment(newId);
    if (newId) {
      await fetchCategoryName(newId);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const fetchUserInfo = async () => {
    try {
      // Lấy thông tin user từ localStorage
      const userStr = localStorage.getItem("user");
      console.log("User string from localStorage:", userStr);

      if (!userStr) {
        console.error("Không tìm thấy thông tin người dùng");
        return;
      }

      // Parse JSON string thành object
      const userData = JSON.parse(userStr);
      console.log("Parsed user data:", userData);

      // Lấy id từ user data
      const userId = userData.id;
      console.log("User ID:", userId);

      if (!userId) {
        console.error("Không tìm thấy ID người dùng");
        return;
      }

      const response = await getAccountById(userId);
      console.log("API response:", response);

      // Cập nhật state với thông tin từ userData
      setUserInfo({
        fullName: userData.fullName || "",
        email: userData.email || "",
      });
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  useEffect(() => {
    console.log("All localStorage keys:", Object.keys(localStorage));
  }, []);

  const handleCancel = () => {
    navigate("/user/ticket"); // Điều hướng về trang TicketScreen
  };

  const handleAddLink = () => {
    try {
      if (
        linkInput.startsWith("data:image/") ||
        linkInput.startsWith("data:video/")
      ) {
        setAttachments((prev) => [
          ...prev,
          {
            url: linkInput,
            type: linkInput.startsWith("data:image/") ? "IMAGE" : "VIDEO",
          },
        ]);
        setLinkInput("");
        setShowLinkInput(false);
        return;
      }

      const url = new URL(linkInput);
      const isImage = /\.(jpg|jpeg|png|gif)$/i.test(url.pathname);
      const isVideo = /\.(mp4|mov|avi)$/i.test(url.pathname);

      if (!isImage && !isVideo) {
        notificationApi(
          "error",
          "Lỗi",
          "Link phải là đường dẫn trực tiếp đến file ảnh hoặc video"
        );
        return;
      }

      setAttachments((prev) => [
        ...prev,
        {
          url: linkInput,
          type: isImage ? "IMAGE" : "VIDEO",
        },
      ]);
      setLinkInput("");
      setShowLinkInput(false);
    } catch (error) {
      notificationApi("error", "Lỗi", "Vui lòng nhập link hợp lệ");
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

    const validFiles = files.filter(
      (file) =>
        allowedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      notificationApi(
        "warning",
        "Cảnh báo",
        "Chỉ chấp nhận file ảnh (JPG, PNG, GIF) và dung lượng dưới 10MB"
      );
    }

    const newAttachments = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      type: "IMAGE",
      file: file,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Validate form
      if (!title.trim()) {
        notificationApi("error", "Lỗi", "Vui lòng nhập tiêu đề");
        return;
      }
      if (!selectedDepartment) {
        notificationApi("error", "Lỗi", "Vui lòng chọn bộ phận");
        return;
      }
      if (!content.trim()) {
        notificationApi("error", "Lỗi", "Vui lòng nhập nội dung");
        return;
      }

      // Lọc ra các attachment có file để upload lên Firebase
      const attachmentsWithFiles = attachments.filter((att) => att.file);
      const files = attachmentsWithFiles.map((att) => att.file);

      // Upload files lên Firebase
      let assets = [];

      if (files.length > 0) {
        const uploadedUrls = await firebaseImgs(files);
        assets = uploadedUrls.map((url) => ({
          url: url,
          type: url.includes("mp4") ? "VIDEO" : "IMAGE",
        }));
      }

      // Thêm các attachment từ URL trực tiếp
      const urlOnlyAttachments = attachments
        .filter((att) => !att.file)
        .map((att) => ({
          url: att.url,
          type: att.type,
        }));

      assets = [...assets, ...urlOnlyAttachments];

      const ticketData = {
        categoryId: parseInt(selectedDepartment),
        title: title.trim(),
        content: content.trim(),
        assets: assets,
      };

      const response = await createTicket(ticketData);

      if (response.status === "success") {
        notificationApi("success", "Thành công", "Tạo yêu cầu thành công!");
        setTitle("");
        setContent("");
        setSelectedDepartment("");
        setAttachments([]);
        navigate("/user/ticket");
      } else {
        notificationApi(
          "error",
          "Lỗi",
          response.message || "Có lỗi xảy ra khi tạo yêu cầu"
        );
      }
    } catch (error) {
      console.error("Lỗi khi tạo yêu cầu:", error);
      notificationApi(
        "error",
        "Lỗi",
        "Có lỗi xảy ra khi tạo yêu cầu. Vui lòng thử lại!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-[#002278] text-white p-4 rounded-lg flex items-center gap-3 mb-6">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="cursor-pointer"
          onClick={handleBackClick}
        />
        <h1 className="text-xl font-semibold">Tạo khiếu nại</h1>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Request Creator Section */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Người tạo khiếu nại</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Họ tên</label>
              <input
                type="text"
                value={userInfo.fullName}
                readOnly
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002278] bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Email</label>
              <input
                type="email"
                value={userInfo.email}
                readOnly
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002278] bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Request Details Section */}
        <div>
          <h2 className="text-lg font-medium mb-4">Chi tiết khiếu nại</h2>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">Tiêu đề</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002278]"
            />
          </div>

          {/* Department */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">Bộ phận</label>
            <select
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002278]"
              value={selectedDepartment}
              onChange={handleDepartmentChange}
            >
              <option value="">Chọn bộ phận</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">Nội dung</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung"
              className="w-full border rounded-md px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-[#002278]"
            />
          </div>

          {/* Notice Box */}
          <div className="bg-orange-50 border border-orange-100 rounded-md p-4 mb-6">
            <p className="text-orange-800">
              ShoeCare Hub rất cần quý khách gửi kèm{" "}
              <span className="font-semibold">
                hình ảnh liên quan đến vấn đề khiếu nại
              </span>
              , để ShoeCare Hub nhanh chóng hiểu rõ vấn đề và hỗ trợ quý khách
              xử lý nhanh nhất có thể.
            </p>
            <p className="text-orange-800 mt-2">Cảm ơn quý khách.</p>
          </div>

          {/* File Upload Section */}
          <div className="mb-6">
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
            </div>

            {/* Link Input */}
            {showLinkInput && (
              <div className="flex gap-2 mb-4">
                <input
                  type="url"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="Nhập link ảnh hoặc video"
                  className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002278]"
                />
                <button
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
                <h3 className="text-sm font-medium text-gray-700">
                  Tệp đính kèm:
                </h3>
                <div className="flex flex-wrap gap-4">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="relative group">
                      {attachment.type === "IMAGE" ? (
                        <img
                          src={attachment.url}
                          alt={`Attachment ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      ) : (
                        <video
                          src={attachment.url}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                      <button
                        onClick={() => removeAttachment(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end">
            <div className="flex gap-3">
              <button
                className="text-gray-600 border px-4 py-2 rounded-md hover:bg-gray-50"
                onClick={handleCancel}
              >
                Huỷ bỏ
              </button>
              <button
                className="bg-[#3498db] text-white px-6 py-2 rounded-md hover:bg-[#2980b9] disabled:opacity-50"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang gửi..." : "Gửi khiếu nại"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
