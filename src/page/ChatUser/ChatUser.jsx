import React, { useEffect, useState } from 'react';
import { Drawer, Collapse } from 'antd';
import { getRooms, getMessages } from '../../api/chat';
import { getAccountById } from '../../api/user';
import ChatList from './ChatList';
import ChatInput from './ChatInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faRocketchat } from "@fortawesome/free-brands-svg-icons";

const { Panel } = Collapse;

const ChatUser = () => {
    const accountId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null;
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [userDetails, setUserDetails] = useState({});
    const [isFetching, setIsFetching] = useState(false);
    const [hasAttachments, setHasAttachments] = useState(false);

    useEffect(() => {
        if (!accountId) {
            console.error('Không tìm thấy accountId trong localStorage');
            return;
        }
              const fetchRooms = async () => {
            setIsFetching(true);
            const response = await getRooms(accountId);
            if (response.status === "success") {
                const roomData = response.data;
                const updatedRooms = await Promise.all(roomData.map(async room => {
                    const otherAccountId = room.accountId1 === accountId ? room.accountId2 : room.accountId1;

                    console.log(`Account ID của người dùng hiện tại: ${accountId}`);
                    console.log(`Account ID của người khác: ${otherAccountId}`);

                    const userResponse = await getAccountById(otherAccountId);
                    console.log('Dữ liệu người dùng:', JSON.stringify(userResponse));
                    const userInfo = userResponse.data;

                    const userName = userInfo ? userInfo.fullName : 'Người dùng không xác định';
                    const userImageUrl = userInfo ? userInfo.imageUrl : 'đường_dẫn_ảnh_mặc_định.jpg';

                    return {
                        id: room.id,
                        name: `${userName}`,
                        imageUrl: userImageUrl
                    };
                }));
                setRooms(updatedRooms);
            } else {
                setRooms([]);
            }
            setIsFetching(false);
        };
        fetchRooms();
    }, [accountId]);

    useEffect(() => {
        if (!selectedRoom || !accountId) {
            return;
        }
        const fetchMessages = async () => {
            setIsFetching(true);
            try {
                const response = await getMessages(selectedRoom.id);
                if (response.status === "success") {
                    setMessages(response.data);
                } else {
                    console.error('Lỗi khi lấy tin nhắn:', response.message);
                    setMessages([]);
                }
            } catch (error) {
                console.error('Đã xảy ra lỗi khi gọi API:', error);
                setMessages([]);
            } finally {
                setIsFetching(false);
            }
        };
        fetchMessages();
    }, [selectedRoom, accountId]);

    const handleMessageSent = async () => {
        if (selectedRoom) {
            try {
                const response = await getMessages(selectedRoom.id);
                if (response.status === "success") {
                    setMessages(response.data);
                } else {
                    console.error('Lỗi khi lấy tin nhắn:', response.message);
                }
            } catch (error) {
                console.error('Đã xảy ra lỗi khi gọi API:', error);
            }
        }
    };

    const filteredRooms = rooms.filter(room =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase())

    );


    return (
        <div className="flex flex-col h-full overflow-hidden">
            <Collapse defaultActiveKey={['1']} expandIconPosition="right">
                <Panel header="Danh sách phòng chat" key="1">
                    <div className="bg-white p-4 border-b border-gray-300">
                        <div className="relative mb-3">
                            <input
                                type="text"
                                placeholder="Tìm kiếm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border border-gray-300 rounded-full p-2 mb-2 w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                            />
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-3 text-gray-500" />
                        </div>
                        <ul className="overflow-auto h-[300px]">
                            {filteredRooms.map(room => (
                                <li key={room.id} onClick={() => setSelectedRoom(room)} className="cursor-pointer hover:bg-gray-200 p-2 mb-3 flex items-center">
                                    <img src={room.imageUrl} alt={room.name} className="inline-block w-8 h-8 rounded-full mr-2" />
                                    <span className="font-medium text-[#002278]">{room.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Panel>
            </Collapse>
            <div className="flex-1 px-4 overflow-hidden">
                {selectedRoom ? (
                    <div className="flex flex-col h-full">
                    <div className="bg-white p-2 rounded mb-4 flex items-center h-15">
                            <img src={selectedRoom.imageUrl} alt={selectedRoom.name} className="inline-block w-10 h-10 rounded-full mr-2" />
                            <h2 className="text-2xl font-semibold ml-2">{selectedRoom.name}</h2>
                        </div>
                        <ChatList roomId={selectedRoom.id} hasAttachments={hasAttachments} />
                        <ChatInput
                            roomId={selectedRoom.id}
                            onMessageSent={handleMessageSent}
                            messages={messages}
                            setMessages={setMessages}
                            setHasAttachments={setHasAttachments}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-2xl font-medium text-[#002278] mt-20">Chào mừng bạn đến với ShoeCareHub Chat</p>
                            <p className="text-xl font-medium text-[#002278]">Bắt đầu cuộc trò chuyện!</p>
                            <FontAwesomeIcon icon={faRocketchat} className="text-7xl text-[#002278] mt-2" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatUser;