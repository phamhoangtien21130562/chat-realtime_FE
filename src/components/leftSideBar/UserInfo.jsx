import '../../assets/style/userInfo.css'

const UserInfo = ({ avatar, name }) => {
    return(
        <div className='userInfo'>
            <div className="user">
                {/*<img src="" alt=""/>*/}
                <img src={avatar || "/img/avatar.jpg"} alt="avatar" className="avatar"/>
                <h2>{name || 'User'}</h2>
            </div>
            <div className="icons">
                <i className="fa-solid fa-ellipsis fa-xl" style={{ color: '#333333' }}></i>
                {/*<img src="/img/video.png" alt=""/>*/}
                {/*<img src="/img/edit.png" alt=""/>*/}

            </div>
        </div>
    )
}
export default UserInfo