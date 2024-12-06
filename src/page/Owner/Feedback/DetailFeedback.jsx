import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { getData, putData } from "../../../api/api";
import { useNotification } from "../../../Notification/Notification";
import ComButton from "../../../Components/ComButton/ComButton";
import { Dropdown, Menu, Button } from "antd";
import { EllipsisOutlined } from "@ant-design/icons"; // Import biểu tượng dấu ba chấm

export default function DetailFeedback({
  selectedFeedback,
  onClose,
  tableRef,
}) {
  const [userData, setUserData] = useState({});
  const [reply, setReply] = useState(""); // State to manage the reply
  const [hasReplied, setHasReplied] = useState(false); // Flag to check if a reply exists
  const [isEditing, setIsEditing] = useState(false); // Flag to check if editing mode is active
  const { notificationApi } = useNotification();

  // Fetch user data based on the feedback
  const getAPI = () => {
    getData(`/accounts/${selectedFeedback?.order?.accountId}`)
      .then((response) => {
        setUserData(response?.data?.data);
      })
      .catch((er) => {
        console.error("Error fetching items:", er);
      });
  };

  useEffect(() => {
    getAPI();
    // Check if feedback already has a reply
    if (selectedFeedback?.reply) {
      setHasReplied(true);
      setReply(selectedFeedback?.reply); // Load the current reply if exists
    }
  }, [selectedFeedback]);

  // Function to handle the reply submission
  const replyFeedback = () => {
    if (!reply.trim()) {
      notificationApi("error", "Lỗi", "Vui lòng nhập câu trả lời!");
      return;
    }

    putData(`/feedbacks/${selectedFeedback?.id}`, "reply", reply, {
      "Content-Type": "application/json", // Gửi dữ liệu dạng chuỗi thuần túy
    })
      .then((response) => {
        setHasReplied(true); // Mark as replied
        tableRef(); // Refresh the table or feedback list
        onClose(); // Close the modal or feedback view
        notificationApi("success", "Thành công", "Trả lời thành công!");
      })
      .catch((er) => {
        console.error("Error submitting reply:", er);
        notificationApi("error", "Lỗi", "Đã có lỗi xảy ra!");
      });
  };

  // Function to handle the reply edit (update existing reply)
  const editReplyFeedback = () => {
    if (!reply.trim()) {
      notificationApi("error", "Lỗi", "Vui lòng nhập câu trả lời!");
      return;
    }

    putData(`/feedbacks/${selectedFeedback?.id}`, "reply", reply, {
      "Content-Type": "application/json", // Gửi dữ liệu dạng chuỗi thuần túy
    })
      .then((response) => {
        setHasReplied(true); // Mark as replied
        setIsEditing(false); // Exit editing mode
        tableRef(); // Refresh the table or feedback list
        onClose(); // Close the modal or feedback view
        notificationApi(
          "success",
          "Thành công",
          "Cập nhật câu trả lời thành công!"
        );
      })
      .catch((er) => {
        console.error("Error submitting reply:", er);
        notificationApi("error", "Lỗi", "Đã có lỗi xảy ra!");
      });
  };

  // Menu for dropdown options (Edit)
  const menu = (
    <Menu>
      <Menu.Item key="edit" onClick={() => setIsEditing(true)}>
        Chỉnh sửa
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <div className="border-b pb-4 mb-4 flex items-start">
        <img
          src={userData.imageUrl}
          alt="Customer Avatar"
          className="rounded-full w-10 h-10 mr-4"
        />
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="font-semibold pr-10">{userData.fullName}</span>
            <span className="text-gray-500 ml-2">
              {new Date(selectedFeedback.createdTime).toLocaleDateString(
                "vi-VN"
              )}
            </span>
          </div>
          <div className="flex mb-2">
            {[...Array(selectedFeedback.rating)].map((_, starIndex) => (
              <FontAwesomeIcon
                key={starIndex}
                icon={solidStar}
                className="text-yellow-500"
              />
            ))}
          </div>
          <p className="text-gray-700">{selectedFeedback.content}</p>
          <div className="mt-6">
            <div className="grid md:grid-cols-8 gap-4">
              {/* Render Images */}
              {selectedFeedback.assetUrls.map((asset, imageIndex) => (
                <div key={asset.id} className="relative">
                  <img
                    src={asset.url}
                    alt={`Feedback ${imageIndex + 1}`}
                    className="w-32 h-32 object-cover cursor-pointer rounded border-2 border-[#3A4980]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reply Section */}
      <div>
        <span className="font-semibold pr-10">Trả lời</span>
        {/* If there is already a reply, show it */}
        {hasReplied ? (
          <div>
            {/* Show current reply and edit option */}
            {!isEditing ? (
              <div className="flex justify-between items-center mb-10">
                <p>{selectedFeedback.reply}</p>
                <Dropdown overlay={menu} trigger={["click"]}>
                  <Button
                    icon={<EllipsisOutlined />}
                    type="text"
                    className="ml-2"
                  />
                </Dropdown>
              </div>
            ) : (
              <div>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Nhập câu trả lời..."
                  className="w-full p-2 border rounded mb-4"
                />
                <ComButton onClick={editReplyFeedback} disabled={false}>
                  Cập nhật
                </ComButton>
                <button
                  onClick={() => setIsEditing(false)}
                  className="ml-2 text-gray-500 hover:underline"
                >
                  Hủy
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Nhập câu trả lời..."
              className="w-full p-2 border rounded mb-4 "
            />
            <ComButton
              className={`block w-full rounded border-[#E0E2E7] border-md bg-[#0F296D] text-center text-sm font-semibold text-white shadow-sm hover:bg-[#0F296D] ${
                hasReplied ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={replyFeedback}
              disabled={hasReplied}
            >
              Trả lời
            </ComButton>
          </div>
        )}
      </div>
    </div>
  );
}
