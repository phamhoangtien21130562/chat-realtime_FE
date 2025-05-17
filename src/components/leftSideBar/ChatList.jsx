import '../../assets/style/chatList.css'
import {useState} from "react";
import SearchBar from './SearchBar';

const ChatList = () => {
    const [addMode,setAddMode] = useState(false)
    return(
        <div className='chatList'>

            <SearchBar />
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
            <div className="items">
                <img src="/img/avatar.jpg" alt="avatar" className="avatar"/>
                <div className="texts">
                    <span>OzuSus</span>
                    <p>Hello World</p>
                </div>
            </div>
        </div>
    );
};
export default ChatList