import React, { useState } from 'react';  
import { sendMessage } from '../../api/chat';  
import { SendOutlined } from '@ant-design/icons'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { firebaseImgs } from '../../upImgFirebase/firebaseImgs';

const  ChatInput = ({ roomId, onMessageSent, messages, setMessages, setHasAttachments }) => {  
    const [content, setContent] = useState('');  
    const [isUploading, setIsUploading] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const senderId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null;

    const handleSend = async (imageUrl = '') => {  
        let messageContent = content.trim();
        messageContent = messageContent.replace(/\n/g, ''); // Loại bỏ ký tự xuống dòng
        if (messageContent === '' && !imageUrl) return;  

        try {
            const newMessage = {
                senderId,
                content: messageContent,
                imageUrls: imageUrl ? [imageUrl] : [],
                isImage: !!imageUrl,
                timestamp: new Date().toISOString()
            };
            
            // Log dữ liệu gửi đi
            console.log("Dữ liệu gửi đi:", {
                roomId,
                senderId,
                content: imageUrl || messageContent,
                hasImage: !!imageUrl
            });

            await sendMessage(roomId, senderId, messageContent, imageUrl ? [imageUrl] : [], !!imageUrl);  
            setContent('');  
            setMessages(prevMessages => [...prevMessages, newMessage]); // Cập nhật danh sách tin nhắn
            if (onMessageSent) onMessageSent();
        } catch (error) {
            console.error("Lỗi khi gửi tin nhắn:", error);
        }
    };  
 

    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        setIsUploading(true);
        try {
            const uploadedUrls = await firebaseImgs(files);
            const newAttachments = uploadedUrls.map(url => ({ url, type: "IMAGE" }));
            setAttachments(prev => [...prev, ...newAttachments]);
            setHasAttachments(true);
            for (const url of uploadedUrls) {
                await handleSend(url);
            }
        } catch (error) {
            console.error("Lỗi khi upload ảnh:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const removeAttachment = (index) => {
        setAttachments(prev => {
            const updatedAttachments = prev.filter((_, i) => i !== index);
            if (updatedAttachments.length === 0) {
                setHasAttachments(false);
            }
            return updatedAttachments;
        });
    };

    return (  
        <div className="flex flex-col items-center justify-center border rounded-xl py-2 px-4 h-auto bg-white w-[90%] mx-auto hover:border-[#002286] mb-10">  

            {/* Preview Attachments */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-4 mb-2 w-full">
                {attachments.map((attachment, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={attachment.url}
                      alt={`Attachment ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    />
                    <button
                      onClick={() => removeAttachment(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center w-full">
                <label className="mr-4 text-2xl cursor-pointer">
                    <FontAwesomeIcon icon={faImage} />
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        className="hidden"
                    />
                </label>
                <textarea  
                    className="flex-grow border-none outline-none text-lg resize-none overflow-y-auto"  
                    placeholder="Nhập nội dung..."  
                    value={content}  
                    onChange={(e) => setContent(e.target.value)}  
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    rows="1" 
                />  
                <button onClick={() => handleSend()} className="text-green-500 ml-4 text-2xl" disabled={isUploading}>  
                    {isUploading ? "Đang tải..." : <SendOutlined />}  
                </button>  
            </div>
        </div>  
    );  
};  

export default ChatInput;