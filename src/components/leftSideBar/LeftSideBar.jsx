import '../../assets/style/leftSideBar.css'
import ChatList from "./ChatList";
// import UserInfo from "./UserInfo";

const LeftSideBar = ({ userInfoComponent , currentUserId}) => {
    return(
        <div className='leftSideBar'>
            {userInfoComponent}
            <ChatList currentUserId={currentUserId} />
        </div>
    )
}
export default LeftSideBar