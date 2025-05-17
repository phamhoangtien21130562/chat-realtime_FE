import { useState, useRef, useEffect } from "react";
import SearchResult from "./SearchResult";

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

    const handleFocus = () => {
        setShowResult(true);
    };

    const handleClear = () => {
        setValue("");
        setIsInvalid(false);
        if (onChange) onChange("");
        setShowResult(false);
    };
//4.1 Kiểm tra từ khóa hợp lệ isInvalid()
// 4.3A1 Từ khóa không hợp lệ!
    const handleKeyDown = async(e) => {

        if (e.key === "Enter") {
            if (value.trim() === "") {
                setIsInvalid(true);  // đánh dấu là từ khóa không hợp lệ
                setShowResult(true); // vẫn hiện box thông báo
            } else {
                setIsInvalid(false);
                // Thực hiện tìm kiếm nếu cần
                try {
                    const response = await fetch('http://localhost:8080/api/search', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ keyword: value.trim() }),
                    });


                    if (!response.ok) {
                        throw new Error('Lỗi khi tìm kiếm');
                    }

                    const data = await response.json();
                    // Gửi dữ liệu kết quả về cho SearchResult hiển thị
                    setShowResult(true);
                    setSearchResults(data.data);  // bạn cần tạo state searchResults để lưu kết quả
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
