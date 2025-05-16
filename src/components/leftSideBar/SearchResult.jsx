import { useState, useEffect } from "react";

const SearchResult = ({ keyword = "", isInvalid = false, users = [], messages = [] }) => {
    if (isInvalid) {
        return (
            <div className="search-result">
                <p style={{ color: "red", textAlign: "center", padding: "10px" }}>
                    Từ khóa không hợp lệ!
                </p>
            </div>
        );
    }

    return (
        <div className="search-result">
            <div className="search-user">
                <div className="category">Người dùng</div>
                <div className="items-list">
                    {users.length === 0 && <p>Không tìm thấy người dùng</p>}
                    {users.map((user) => (
                        <div className="items" key={user.id}>
                            <img src={user.avatar || "/img/avatar.jpg"} alt="avatar" className="avatar" />
                            <div className="texts">
                                <span>{user.name}</span>
                                {/*<p>{user.email}</p>*/}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="search-message">
                <div className="category">Tin nhắn</div>
                <div className="items-list">
                    {messages.length === 0 && <p>Không tìm thấy tin nhắn</p>}
                    {messages.map((msg) => (
                        <div className="items" key={msg.id}>
                            <img src={msg.avatar || "/img/avatar.jpg"} alt="avatar" className="avatar" />
                            <div className="texts">
                                <span>{msg.senderName}</span>
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
