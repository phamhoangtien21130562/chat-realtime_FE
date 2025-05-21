import { useState, useRef, useEffect } from "react";
import SearchResult from "./SearchResult";
import callApi from "../service/callApi";
const SearchBar = ({ onChange }) => {
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
//4.1.1 Nhấn vào thanh tìm kiếm
//4.2.1 Nhấn vào thanh tìm kiếm
    const handleFocus = () => {
        setShowResult(true);
    };

    const handleClear = () => {
        setValue("");
        setIsInvalid(false);
        if (onChange) onChange("");
        setShowResult(false);
    };
//4.1.2 Nhập từ khóa vào thanh tìm kiếm và nhấn Enter
//4.2.2 Nhập từ khóa vào thanh tìm kiếm và nhấn Enter
//4.1.3 Kiểm tra từ khóa hợp lệ isInvalid()
//4.2.3 Kiểm tra từ khóa hợp lệ isInvalid()
    const handleKeyDown = async(e) => {

        if (e.key === "Enter") {
            if (value.trim() === "") {
                setIsInvalid(true);  // đánh dấu là từ khóa không hợp lệ
                setShowResult(true); // vẫn hiện box thông báo
            } else {
                setIsInvalid(false);
//4.1.4 Gửi tin nhắn tìm kiếm lên hệ thống
//4.2.4 Gửi tin nhắn tìm kiếm lên hệ thống
                try {
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
                    onFocus={handleFocus}
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
                />
                </div>
            )}
        </div>
    );
};

export default SearchBar;
