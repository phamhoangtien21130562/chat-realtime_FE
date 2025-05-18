import '../../assets/style/chatList.css'
import {useEffect, useRef, useState} from "react";
import SearchBar from './SearchBar';
import axios from 'axios';

const ChatList = ({currentUserId}) => {
    const [rooms, setRooms] = useState([]);

    // Hàm gọi API để lấy user theo id
    const getUserById = async (id) => {
        try {
            const res = await axios.get(`/api/user`, {
                params: {id},
                withCredentials: true,
            });
            return res.data?.data;
        } catch (err) {
            console.error("Lỗi khi lấy user:", err);
            return null;
        }
    };

    // Gọi API lấy danh sách phòng chat
    useEffect(() => {
        if (!currentUserId) return;

        const fetchRooms = async () => {
            try {
                const res = await axios.get(`/api/rooms/${currentUserId}`, {
                    withCredentials: true
                });
                const rawRooms = res.data;

                // Lấy thông tin người còn lại trong mỗi phòng
                const enrichedRooms = await Promise.all(
                    rawRooms.map(async (room) => {
                        const otherUserId = room.senderId === currentUserId
                            ? room.recipientId
                            : room.senderId;

                        const userData = await getUserById(otherUserId);

                        return {
                            ...room,
                            participantName: userData?.name || "Unknown",
                            avatarUrl: userData?.avatarUrl || "/img/avatar.jpg"
                        };
                    })
                );

                setRooms(enrichedRooms);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách phòng:", err);
            }
        };

        fetchRooms();
    }, [currentUserId]);


    useEffect(() => {
        console.log("currentUserId:", currentUserId);
    }, [currentUserId]);

    useEffect(() => {
        console.log("Danh sách rooms:", rooms);
    }, [rooms]);

    // if (!userId) {
    //     return <div>Vui lòng đăng nhập</div>;
    // }

    return (
        <div className='chatList'>
            <SearchBar/>
            {rooms.map((room, index) => (
                <div className="items" key={room.id || index}>
                    <img src={room.avatarUrl} alt="avatar" className="avatar"/>
                    <div className="texts">
                        <span>{room.participantName}</span>
                        <p>{room.lastMessage?.content || "..."}</p>
                    </div>
                </div>
            ))}


            {/*<div className="items">*/}
            {/*    <img src="/img/avatar.jpg" alt="avatar" className="avatar"/>*/}
            {/*    <div className="texts">*/}
            {/*        <span>OzuSus</span>*/}
            {/*        <p>Hello World</p>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
};
export default ChatList

