const SearchResult = ({ friends = [], messages = [] }) => {
    return (
        <div className="search-result">
            <div className="search-user">
                <div className="category">Người dùng</div>
                <div className="items">
                    <img src="/img/avatar.jpg" alt="avatar" className="avatar"/>
                    <div className="texts">
                        <span>OzuSus</span>
                    </div>
                </div>
                <div className="items">
                    <img src="/img/avatar.jpg" alt="avatar" className="avatar"/>
                    <div className="texts">
                        <span>OzuSus</span>
                    </div>
                </div>

            </div>
            <div className="search-message">
                <div className="category">Tin nhắn</div>
                <div className="items">
                    <img src="/img/avatar.jpg" alt="avatar" className="avatar"/>
                    <div className="texts">
                        <span>OzuSus</span>
                        <p>Hello World</p>
                    </div>
                </div>
                <div className="items">
                    <img src="/img/avatar.jpg" alt="avatar" className="avatar"/>
                    <div className="texts">
                        <span>OzuSus</span>
                        <p>Hello World</p>
                    </div>
                </div>

            </div>


        </div>
    );
};

export default SearchResult;
