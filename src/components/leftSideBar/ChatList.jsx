import {useEffect, useState, useRef } from 'react';
import SearchBar from './SearchBar';
import callApi from "../../service/callApi";
import '../../assets/style/chatList.css'
import { Client } from "@stomp/stompjs";

const ChatList = ({currentUserId, onRoomSelect}) => {
    const [rooms, setRooms] = useState([]);
    const stompClientRef = useRef(null);

    useEffect(() => {
        if (!currentUserId) return;

        /**
         * UC3.1:Hiển thị danh sách cuộc trò chuyện
         * Lấy ra danh sách room view:
         * trong đó mỗi item sẽ lấy ra tên người dùng, avatar, tin nhắn cuối cùng, thời gian*/
        const fetchRooms = async () => {
            try {
                const roomsData = await callApi.roomService.getRoomsByUserId(currentUserId);

                const roomViews = await Promise.all(
                    roomsData.map(async (room) => {
                        const recipient = await callApi.userService.getUserById(room.recipientId);
                        const recipientData = recipient?.data;
                        console.log(recipient)
                        return {
                            roomId: room.chatId,
                            participantName: recipientData?.name || "Unknown",
                            avatarUrl: recipientData?.avatar || "/img/avatar.jpg",
                            lastMessageContent: room.lastMessage?.content || "",
                            participantId: room.recipientId,
                            timestamp: room.lastMessage?.timestamp || ""
                        };
                    })
                );
                console.log(roomViews);
                setRooms(roomViews);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách phòng:", err);
            }
        };

        fetchRooms();
    }, [currentUserId]);

    // Khởi tạo kết nối WebSocket
    useEffect(() => {
        if (!currentUserId) return;

        const stompClient = new Client({
            brokerURL: 'wss://sorfware-message.onrender.com/ws/websocket',
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
        });

        stompClient.onConnect = () => {
            stompClient.subscribe(`/user/${currentUserId}/queue/rooms`, (message) => {
                const msg = JSON.parse(message.body);
                handleIncomingMessage(msg);
            });
            console.log("Connected to WebSocket in ChatList");
        };

        stompClient.onStompError = (frame) => {
            console.error('Broker error:', frame.headers['message']);
            console.error('Details:', frame.body);
        };

        stompClient.activate();
        stompClientRef.current = stompClient;

        return () => {
            stompClient.deactivate();
        };
    }, [currentUserId]);

    const handleIncomingMessage = (msg) => {
        setRooms((prevRooms) => {
            const index = prevRooms.findIndex(
                (room) =>
                    room.participantId === msg.senderId || room.participantId === msg.recipientId
            );

            const newTimestamp = msg.timestamp;
            const newContent = msg.content;
            const isFromSender = msg.senderId !== currentUserId;
            const otherId = isFromSender ? msg.senderId : msg.recipientId;

            if (index !== -1) {
                const updatedRoom = {
                    ...prevRooms[index],
                    lastMessageContent: newContent,
                    timestamp: newTimestamp,
                };
                const newRooms = [...prevRooms];
                newRooms.splice(index, 1);
                return [updatedRoom, ...newRooms];
            } else {
                callApi.userService.getUserById(otherId).then((res) => {
                    const userData = res?.data;
                    setRooms((roomsAfter) => [
                        {
                            roomId: msg.chatId || `new-${Date.now()}`,
                            participantName: userData.name,
                            avatarUrl: userData.avatar || '/img/avatar.jpg',
                            lastMessageContent: msg.content,
                            participantId: otherId,
                            timestamp: msg.timestamp,
                        },
                        ...roomsAfter,
                    ]);
                });

                return prevRooms;
            }
        });
    };

    const handleUserSelect = async (user) => {
        // 1. Lấy danh sách phòng chat của currentUserId
        const roomsData = await callApi.roomService.getRoomsByUserId(currentUserId);
        // 2. Tìm phòng với user.id
        const room = roomsData.find(r => r.recipientId === user.id || r.senderId === user.id);
        let chatId;
        if (room) {
            chatId = room.chatId;
        } else {
            // Nếu chưa có phòng, tự tạo chatId theo chuẩn backend
            chatId = `${currentUserId}_${user.id}`;
            // Khi gửi tin nhắn đầu tiên, backend sẽ tạo phòng này
        }
        onRoomSelect(chatId, user.id);
    };

    return (
        <div className="chatList">
            <SearchBar onUserSelect={handleUserSelect}/>
            {/*3.3a: nếu không có cuộc trò truyện nào thì:
            Hệ thống hiển thị thông báo "Bạn chưa có cuộc trò chuyện nào."*/}
            {rooms.length === 0 ? (
                <p className="noConversation">Bạn chưa có cuộc trò chuyện nào</p>
                ) :
                (rooms.map((room, index) => (
                <div className="items" key={room.participantId || index}
                     onClick={() => onRoomSelect(room.roomId, room.participantId)} //khi click vào thì truyền roomid và recipientId vào mainchat
                >
                    <img src={room.avatarUrl} alt="avatar" className="avatar"/>
                    <div className="content">
                        <div className="header">
                            <span className="name">{room.participantName}</span>
                            <span className="timestamp">
                                {room.timestamp ? new Date(room.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                }) : ''}
                            </span>
                        </div>
                        <p className="lastMessage">{room.lastMessageContent}</p>
                    </div>
                </div>
            )))}
        </div>
    );
};

export default ChatList;
