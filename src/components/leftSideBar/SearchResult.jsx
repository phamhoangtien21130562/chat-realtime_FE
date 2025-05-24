import { useState, useEffect } from "react";
import callApi from "../../service/callApi";
const SearchResult = ({ keyword = "", isInvalid = false, users = [], messages = [] }) => {
    const [enhancedMessages, setEnhancedMessages] = useState([]);
    const currentUserId = sessionStorage.getItem('userId');

    useEffect(() => {
        const fetchSenders = async () => {
            const senderMap = {};
            const updatedMessages = await Promise.all(
                messages.map(async (msg) => {
                    if (senderMap[msg.senderId]) {
                        return {
                            ...msg,
                            senderName: senderMap[msg.senderId].name,
                            avatar: senderMap[msg.senderId].avatar,
                        };
                    }

                    try {
                        const res = await callApi.userService.getUserById(msg.senderId);
                        const user = res.data; // ✅ Lấy data ở đây
                        senderMap[msg.senderId] = user;

                        return {
                            ...msg,
                            senderName: user.name || "Không xác định",
                            avatar: user.avatar,
                        };
                    } catch (err) {
                        console.error("Lỗi lấy thông tin sender:", err);
                        return {
                            ...msg,
                            senderName: "Không xác định",
                            avatar: null,
                        };
                    }
                })
            );
            setEnhancedMessages(updatedMessages);
        };

        if (messages.length > 0) {
            fetchSenders();
        }
    }, [messages]);
// 4.3A1.   Hiển thị thông báo: ”Từ khóa không hợp lệ!”.
    if (isInvalid) {
        return (
            <div className="search-result">
                <p style={{ color: "red", textAlign: "center", padding: "10px" }}>
                    Từ khóa không hợp lệ!
                </p>
            </div>
        );
    }
// 4.8 Hệ thống hiển thị kết quả.
    return (
        <div className="search-result">
{/*4.8.1 Danh sách người dùng.*/}
            <div className="search-user">
                <div className="category">Người dùng</div>
                <div className="items-list">
{/*4.7A1.   Hệ thống hiển thị thông báo “Không tìm thấy người dùng”.*/}
                    {users.length === 0 && <p>Không tìm thấy người dùng</p>}
                    {users.map((user) => (
                        <div className="items" key={user.id}>
                            <img src={user.avatar || "/img/avatar.jpg"} alt="avatar" className="avatar" />
                            <div className="texts">
                                <strong>{user.name}</strong>
                                {/*<p>{user.email}</p>*/}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
{/*4.8.2Danh sách tin nhắn.*/}
            <div className="search-message">
                <div className="category">Tin nhắn</div>
                <div className="items-list">
{/*4.7A2.   Hệ thống hiển thị thông báo “Không tìm thấy tin nhắn”.*/}
                    {enhancedMessages.length === 0 && <p>Không tìm thấy tin nhắn</p>}
                    {enhancedMessages
                        .filter((msg) => msg.chatId === currentUserId || msg.senderId === currentUserId)
                        .map((msg) => (
                        <div className="items" key={msg.id}>
                            <img src={msg.avatar || "/img/avatar.jpg"} alt="avatar" className="avatar" />
                            <div className="texts">
                                <strong>{msg.senderName}</strong>
                                <p>{msg.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export default SearchResult;
