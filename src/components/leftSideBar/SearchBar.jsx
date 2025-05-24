import { useState, useRef, useEffect } from "react";
import SearchResult from "./SearchResult";
import callApi from "../../service/callApi";
const SearchBar = ({ onChange, onUserSelect, onRoomSelect }) => {
    const [value, setValue] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [isInvalid, setIsInvalid] = useState(false);
    const wrapperRef = useRef(null);
    const [searchResults, setSearchResults] = useState(null);


    const handleChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        setIsInvalid(false); // reset khi gõ lại
        if (onChange) onChange(newValue);
        if (!showResult) setShowResult(true);
    };

    const handleFocus = () => {
        setShowResult(true);
    };

    const handleClear = () => {
        setValue("");
        setIsInvalid(false);
        if (onChange) onChange("");
        setShowResult(false);
    };

    const handleKeyDown = async(e) => {

        if (e.key === "Enter") {
// 4.3 Kiểm tra tính hợp lệ của từ khóa (từ khóa không được rỗng hoặc chỉ chứa khoảng trắng).
            if (value.trim() === "") {
                setIsInvalid(true);  // đánh dấu là từ khóa không hợp lệ
                setShowResult(true); // vẫn hiện box thông báo
            } else {
                setIsInvalid(false);

                try {
//4.4 Gửi tin nhắn tìm kiếm lên hệ thống.
                    const data = await callApi.searchService.searchByKeyword(value.trim());
                    setShowResult(true);
                    setSearchResults(data.data);
                } catch (error) {
                    console.error(error);
                    setSearchResults(null);
                    setIsInvalid(true);
                    setShowResult(true);
                }
            }
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowResult(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
        <div className="search" style={{position: "relative"}} ref={wrapperRef}>
            <div className="searchBar">
                <i className="fa-solid fa-magnifying-glass fa-lg" style={{color: '#cc0f22'}}></i>
                <input
                    type="text"
                    placeholder="Gõ tìm kiếm"
                    style={{color: 'black'}}
                    value={value}
                    onChange={handleChange}
//4.1 Người dùng nhấn vào giao diện thanh tìm kiếm gần góc trái bên trên của trang.
                    onFocus={handleFocus}
//4.2 Người dùng nhập từ khóa vào thanh tìm kiếm và nhấn Enter.
                    onKeyDown={handleKeyDown}
                />
                {value && (
                    <i
                        className="fa-solid fa-xmark"
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            color: "#666"
                        }}
                        onClick={handleClear}
                    ></i>
                )}
            </div>

            {showResult && (
                <div className="search-result-wrapper">
                <SearchResult
                    keyword={value}
                    isInvalid={isInvalid}
                    users={searchResults?.users || []}
                    messages={searchResults?.messages || []}
                    onUserSelect={onUserSelect}
                    onRoomSelect={onRoomSelect}
                />
                </div>
            )}
        </div>
    );
};

export default SearchBar;
