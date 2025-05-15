import '../assets/style/homePage.css';
import LeftSideBar from "./leftSideBar/LeftSideBar";
import MainChat from "./mainChat/MainChat";
import RightSideBar from "./rightSideBar/RightSideBar";
import { useEffect, useState } from 'react';
import UserInfo from "./leftSideBar/UserInfo";
import callApi from '../service/callApi';

const HomePage = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = sessionStorage.getItem('userId');
            if (userId) {
                try {
                    const response = await callApi.userService.getUserById(userId);
                    setUser(response.data);
                } catch (error) {
                    setUser(null);
                }
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="App">
            <LeftSideBar userInfoComponent={<UserInfo avatar={user?.avatar} name={user?.name} />} />
            <MainChat avatar={user?.avatar} name={user?.name} />
            {/*<RightSideBar/>*/}
        </div>
    );
};

export default HomePage;