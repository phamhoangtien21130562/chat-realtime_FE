import '../../assets/style/leftSideBar.css'
import ChatList from "./ChatList";
// import UserInfo from "./UserInfo";

const LeftSideBar = ({ userInfoComponent , currentUserId, onRoomSelect}) => {
    return(
        <div className='leftSideBar'>
            {userInfoComponent}
            <ChatList currentUserId={currentUserId}
                      onRoomSelect={onRoomSelect}
            />
        </div>
    )
}
export default LeftSideBar