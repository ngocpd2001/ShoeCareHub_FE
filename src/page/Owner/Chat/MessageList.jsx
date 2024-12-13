import React, { useEffect, useState } from "react";
import { getMessages } from "../../../api/chat";
import { onValue, ref } from "firebase/database";
import { realtimedb } from "../../../configs/firebase";

const MessageList = ({ roomId, hasAttachments }) => {
  const [messages, setMessages] = useState([]);
  const accountId = localStorage.getItem("user")
    ? JSON?.parse(localStorage.getItem("user")).id
    : null;

  const formatDate = (Timestamp) => {
    return new Date(Timestamp)?.toLocaleDateString();
  };

  const splitMessage = (message, maxWords) => {
    const words = message?.split(" ");
    const chunks = [];
    for (let i = 0; i < words?.length; i += maxWords) {
      chunks?.push(words?.slice(i, i + maxWords)?.join(" "));
    }
    return chunks;
  };

  useEffect(() => {
    const dataRef = ref(realtimedb, `/messages/${roomId}`);
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      try {
        const arrayData = Object.values(data);
        console.log(333333, arrayData);
        arrayData.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
        // arrayData.reverse();
        setMessages(arrayData);
      } catch (error) {
        setMessages([]);
      }
    });
  }, [roomId]);

  return (
    <div
      className={`overflow-auto ${hasAttachments ? "h-[650px]" : "h-[750px]"}`}
    >
      {messages.length === 0 ? (
        <div className="text-center text-gray-500">
          Hãy bắt đầu cuộc trò chuyện...
        </div>
      ) : (
        messages.map((message, index) => {
          const showDate =
            index === 0 ||
            formatDate(messages[index - 1].Timestamp) !==
              formatDate(message.Timestamp);
          return (
            <div key={index}>
              {showDate && (
                <div className="flex justify-center my-2 mb-4">
                  <div className="bg-green-400 text-white px-3 py-1 rounded-full">
                    {formatDate(message.Timestamp)}
                  </div>
                </div>
              )}
              <div
                className={`my-2 mb-3 p-2 rounded-2xl ${
                  message.SenderId === accountId
                    ? "bg-[#3D70B8] text-white text-right w-fit ml-auto"
                    : "bg-white text-left w-fit mr-auto"
                }`}
              >
                {/* <div className="flex gap-2   items-center">
                  {message.ImageUrl && (
                    <img
                      src={message.ImageUrl}
                      alt="Message Attachment"
                      className="h-10 w-10 mt-2 rounded-full"
                    />
                  )}

                  <div className="text-lg">{message.FullName}</div>
                </div> */}
                <div className="whitespace-pre-wrap text-left">
                  {splitMessage(message.Content, 15).map((chunk, i) => (
                    <div key={i}>{chunk}</div>
                  ))}
                </div>
                <div
                  className={`text-sm ${
                    message.SenderId === accountId ? "text-black" : "text-gray-500"
                  }`}
                >
                  {new Date(message.Timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MessageList;
