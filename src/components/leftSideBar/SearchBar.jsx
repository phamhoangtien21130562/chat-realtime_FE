import { useState, useRef, useEffect } from "react";
import SearchResult from "./SearchResult";

const SearchBar = ({ onChange }) => {
    const [value, setValue] = useState("");
    const [showResult, setShowResult] = useState(false);
    const wrapperRef = useRef(null); // dùng để kiểm tra click bên ngoài

    const handleChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        if (onChange) onChange(newValue);
        if (!showResult) setShowResult(true);
    };

    const handleFocus = () => {
        setShowResult(true);
    };

    const handleClear = () => {
        setValue("");
        if (onChange) onChange("");
        setShowResult(false);
    };

    // Ẩn khi click bên ngoài
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
        <div className="search" style={{ position: "relative" }} ref={wrapperRef}>
            <div className="searchBar">
                <i className="fa-solid fa-magnifying-glass fa-lg" style={{ color: '#cc0f22' }}></i>
                <input
                    type="text"
                    placeholder="Gõ tìm kiếm"
                    style={{ color: 'black' }}
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
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

            {showResult && <SearchResult keyword={value} />}
        </div>
    );
};

export default SearchBar;
