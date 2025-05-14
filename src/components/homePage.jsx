import '../assets/style/homePage.css'
import LeftSideBar from "./leftSideBar/LeftSideBar";
import MainChat from "./mainChat/MainChat";
import RightSideBar from "./rightSideBar/RightSideBar";
import { useEffect, useState } from 'react';
import axios from 'axios';
import UserInfo from "./leftSideBar/UserInfo";

const HomePage = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        if (userId) {
            axios.get(`http://localhost:8080/api/user?id=${userId}`, { withCredentials: true })
                .then(res => {
                    setUser(res.data.data);
                })
                .catch(() => setUser(null));
        }
    }, []);

    return (
        <div className="App">
            <LeftSideBar userInfoComponent={<UserInfo avatar={user?.avatar} name={user?.name} />} />
            <MainChat avatar={user?.avatar} name={user?.name} />
            {/*<RightSideBar/>*/}
        </div>
    )
}
export default HomePage