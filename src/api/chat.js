import { axiosInstances } from '../utils/axios';  

export const createRoom = async (accountId1, accountId2) => {
    try {
      const response = await axiosInstances.login.post('/chats/create-room', {
        accountId1,
        accountId2
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo phòng chat:', error);
      throw error;
    }
  };

export const sendMessage = async (roomId, senderId, content, imageUrls, isImage) => {
    try {
        const response = await axiosInstances.login.post('/chats/send-message', {
            roomId,
            senderId,
            content,
            imageUrls,
            isImage
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gửi tin nhắn:', error);
        throw error;
    }
};

export const getMessages = async (roomId) => {
    try {
        const response = await axiosInstances.login.get(`/chats/get-messages/${roomId}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin chat:', error);
        throw error;
    }
};

export const getRooms = async (accId) => {
    try {
        const response = await axiosInstances.login.get(`/chats/get-rooms/${accId}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin phòng chat:', error);
        throw error;
    }
};

  