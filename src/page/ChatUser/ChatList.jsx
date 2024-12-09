import React, { useEffect, useState } from 'react';
import { getMessages } from '../../api/chat'; 

const ChatList = ({ roomId, hasAttachments }) => {
    const [messages, setMessages] = useState([]); 
    const accountId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null;

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString();
    };

    const splitMessage = (message, maxWords) => {
        const words = message.split(' ');
        const chunks = [];
        for (let i = 0; i < words.length; i += maxWords) {
            chunks.push(words.slice(i, i + maxWords).join(' '));
        }
        return chunks;
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await getMessages(roomId); 
                console.log(response.data); 
                if (response.status === "success") {
                    setMessages(response.data); 
                }
            } catch (error) {
                console.error('Lỗi khi lấy thông tin chat:', JSON.stringify(error));
                console.error('Đã xảy ra lỗi:', JSON.stringify(error));
            }
        };

        fetchMessages(); 
    }, [roomId]); 

    return (
        <div className={`overflow-auto ${hasAttachments ? 'h-[650px]' : 'h-[750px]'}`}>
            {messages.length === 0 ? (
                <div className="text-center text-gray-500">
                    Không có tin nhắn nào trong phòng này.
                </div>
            ) : (
                messages.map((message, index) => {
                    const showDate = index === 0 || formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp);
                    return (
                        <div key={index}>
                            {showDate && (
                                <div className="flex justify-center my-2 mb-4">
                                    <div className="bg-green-400 text-white px-3 py-1 rounded-full">
                                        {formatDate(message.timestamp)}
                                    </div>
                                </div>
                            )}
                            <div className={`my-2 mb-3 p-2 rounded-2xl ${message.senderId === accountId ? 'bg-[#3D70B8] text-right w-fit ml-auto' : 'bg-pink-200 text-left w-fit mr-auto'}`}>
                                <div className="whitespace-pre-wrap text-left">
                                    {splitMessage(message.content, 15).map((chunk, i) => (
                                        <div key={i}>{chunk}</div>
                                    ))}
                                </div>
                                {message.imageUrl && (
                                    <img src={message.imageUrl} alt="Message Attachment" className="max-w-full h-auto mt-2" />
                                )}
                                <div className={`text-sm ${message.senderId === accountId ? 'text-white' : 'text-black'} text-gray-500`}>
                                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ChatList;