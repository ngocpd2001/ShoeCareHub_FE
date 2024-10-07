import { notification } from "antd";
import React, { useContext } from "react";

// Tạo context để chứa API notification
const NotificationContext = React.createContext();

// Custom hook để sử dụng API notification
export const useNotification = () => useContext(NotificationContext);

// Provider để cung cấp API notification cho các thành phần con
export const NotificationProvider = ({ children }) => {
  // Sử dụng hook useNotification của antd để nhận API notification
  const [api, contextHolder] = notification.useNotification();
  function capitalizeFirstLetter(string) {
    const trimmedString = string.trim();
    return trimmedString.charAt(0).toUpperCase() + trimmedString.slice(1);
  }
  // Tạo một hàm wrapper để thông báo
  const notificationApi = (type, message, description) => {
    api[type]({
      message: capitalizeFirstLetter(message),
      description: capitalizeFirstLetter(description),
    });
  };

  // Cung cấp notificationApi thông qua context
  return (
    <NotificationContext.Provider value={{ notificationApi }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};
// export const ShowNotification = async (type, message, description) => {
//   try {
//     const api = useNotification();
//     await api[type]({
//       message: message,
//       description: description,
//     });
//   } catch (error) {
//     throw error;
//   }
// };
