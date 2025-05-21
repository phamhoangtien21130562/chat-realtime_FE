import '../../assets/style/mainChat.css'
import EmojiPicker from "emoji-picker-react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import {useEffect, useRef, useState} from "react";
import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';
import callApi from "../../service/callApi";

const MainChat = ({avatar, name, currentUserId, roomId, recipientId}) => {
    const [openEmoji, setOpenEmoji] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [avt, setAnotherAvt] = useState(null); //Avatar của người còn lại trong cuộc hội thoại
    const [recipientName, setName] = useState(""); //tên của người còn lại
    const endRef = useRef(null);

    useEffect(() => {
            console.log("roomId: ", roomId);
            console.log("recipientId: ", recipientId);
        }
    )
    // Connect to WebSocket when component mounts
    useEffect(() => {
        connect();
        // Load message history
        loadMessages();

        return () => {
            // Disconnect when component unmounts
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, [recipientId]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        endRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    const connect = () => {
        // Use full URL to backend WebSocket endpoint (adjust the port if needed)
        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws/websocket', // CHÍNH XÁC là ws://
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
        });

        client.onConnect = () => {
            setConnected(true);

            // Subscribe to personal queue for messages
            client.subscribe(`/user/${currentUserId}/queue/messages`, onMessageReceived);

            console.log("Connected to WebSocket");
        };

        client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };

        client.activate();
        setStompClient(client);
    };

    const onMessageReceived = (payload) => {
        const notification = JSON.parse(payload.body);

        if (notification.senderId === recipientId || notification.senderId === currentUserId) {
            setMessages(prevMessages => [...prevMessages, {
                id: notification.id,
                senderId: notification.senderId,
                recipientId: notification.recipientId,
                content: notification.content,
                timestamp: notification.timestamp
            }]);
        }
    };

    // const loadMessages = async () => {
    //     try {
    //         // Use full URL to backend API (adjust the port if needed)
    //         const response = await fetch('http://localhost:8080/messages');
    //         const allMessages = await response.json();
    //
    //         // Only show messages between current user and selected recipient
    //         const conversationMessages = allMessages.filter(
    //             msg => (msg.senderId === currentUserId && msg.recipientId === recipientId) ||
    //                   (msg.senderId === recipientId && msg.recipientId === currentUserId)
    //         );
    //
    //         setMessages(conversationMessages);
    //     } catch (error) {
    //         console.error("Error loading messages:", error);
    //     }
    // };
    /**
     * Usecase 3: Lịch sử trò chuyện
     * U3.2: Hiển thị tin nhắn cũ
     * load messages dựa trên chatId
     * chatId được truyền từ ChatList khi người dùng click vào 1 đoạn hội thoại bất kì
     */
    const loadMessages = async () => {
        if (!roomId) {
            setMessages([]); // reset nếu không có roomId
            console.log("Chưa chọn phòng chat");
            return;
        } else {
            try {
                const data = await callApi.messageService.getMessagesByChatId(roomId);
                const recipientData = (await callApi.userService.getUserById(recipientId))?.data;
                const anotherAvt = recipientData.avatar || "/img/avatar.jpg";
                setName(recipientData.name)
                setAnotherAvt(anotherAvt)
                console.log("data người nhận:", recipientData);
                setMessages(data);
            } catch (error) {
                console.error("Error loading messages:", error);
            }
        }
    };


    const sendMessage = () => {
        if (messageText.trim() && stompClient && connected) {
            const message = {
                senderId: currentUserId,
                recipientId: recipientId,
                content: messageText,
                timestamp: new Date()
            };

            stompClient.publish({
                destination: '/app/chat',
                body: JSON.stringify(message)
            });

            setMessageText("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const showEmoji = e => {
        setMessageText(prev => prev + e.emoji);
        setOpenEmoji(false);
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';

        const date = new Date(timestamp);
        const now = new Date();

        // For today's messages, show time only
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        }

        // For older messages, show date and time
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    };

    useEffect(() => {
        console.log("useEffect chạy với recipientId:", recipientId);
        if (recipientId) {
            loadMessages();
        }
    }, [recipientId]);

    return (
        <div className='mainChat'>
            {roomId === null ? (
                <p className="noConversation">Hãy chọn một cuộc trò chuyện</p>
            ) : (
                <>
                    {/* Header */}
                    <div className="topChat">
                        <div className="user">
                            <img src={avt || "/img/avatar.jpg"} alt="avatar" className="avatar"/>
                            <div className="texts">
                                <span>{recipientName || 'User'}</span>
                                <p>{connected ? 'Online' : 'Connecting...'}</p>
                            </div>
                        </div>
                        <div className="icon">
                            <i className="fa-solid fa-circle-info fa-xl" style={{color: '#333333'}}></i>
                        </div>
                    </div>

                    {/* Tin nhắn */}
                    <div className="centerChat">
                        {messages.length === 0 ? (
                            <p className="noConversation">Hãy bắt đầu trò chuyện</p>
                        ) : (
                            messages.map((msg, index) => {
                                const isOwn = msg.senderId === currentUserId;
                                return (
                                    <div className={`messages ${isOwn ? "own" : ""}`} key={index}>
                                        {!isOwn && <img src={avt} alt="avatar" className="avatar"/>}
                                        <div className="texts">
                                            <p className="content">{msg.content}</p>
                                            <span>{formatTimestamp(msg.timestamp)}</span>
                                        </div>
                                    </div>
                                );
                            }))}
                        <div ref={endRef}></div>
                    </div>

                    {/* Nhập tin nhắn */}
                    <div className="bottomChat">
                        <input
                            type="text"
                            placeholder="Nhập tin nhắn"
                            value={messageText}
                            onChange={e => setMessageText(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <div className="emoji">
                            <i
                                className="fa-regular fa-face-smile fa-xl"
                                onClick={() => setOpenEmoji((prev) => !prev)}
                            ></i>
                            {openEmoji && (
                                <div className="emojiPicker">
                                    <EmojiPicker onEmojiClick={showEmoji}/>
                                </div>
                            )}
                        </div>
                        <button className="sendButton" onClick={sendMessage}>Gửi</button>
                    </div>
                </>
            )}
        </div>
    );

};

export default MainChat;