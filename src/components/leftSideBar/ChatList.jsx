import {useEffect, useState} from 'react';
import SearchBar from './SearchBar';
import callApi from "../../service/callApi";
import '../../assets/style/chatList.css'

const ChatList = ({currentUserId, onRoomSelect}) => {
    const [rooms, setRooms] = useState([]);

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

    return (
        <div className="chatList">
            <SearchBar/>
            {/*3.3a: nếu không có cuộc trò truyện nào thì:
            Hệ thống hiển thị thông báo “Bạn chưa có cuộc trò chuyện nào.”*/}
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
