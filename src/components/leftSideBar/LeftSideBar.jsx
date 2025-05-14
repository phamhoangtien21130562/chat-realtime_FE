import '../../assets/style/leftSideBar.css'
import ChatList from "./ChatList";
// import UserInfo from "./UserInfo";

const LeftSideBar = ({ userInfoComponent }) => {
    return(
        <div className='leftSideBar'>
            {userInfoComponent}
            <ChatList/>
        </div>
    )
}
export default LeftSideBar