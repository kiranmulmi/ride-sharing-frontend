import React, { useContext } from 'react';
import {
    HomeOutlined,
    UserOutlined,
    SettingOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
    Layout,
    Menu,
    Button
} from 'antd';

import { axiosPOST } from '../../helper/axios.helper';
import { UserContext } from '../../context';
import { ThemeConstant, UserConstant } from '../../constants';

const { Sider } = Layout;

const AppSidebar = () => {
    const navigate = useNavigate();
    function getItem(label, key, url, icon, children) {
        return {
            key,
            icon,
            children,
            label,
            onClick({ key, keyPath, domEvent }) { if (url) navigate(url) }
        };
    }
    const { user, setUser } = useContext(UserContext);
    const menuItems = [
        getItem('City', 'city', '/', <HomeOutlined />),
        getItem('History', 'request_history', '/history', <HistoryOutlined />),
        getItem('Setting', 'setting', '/setting', <SettingOutlined />),
        getItem(user.name, 'user', null, <UserOutlined />, [
            getItem('Profile', 'profile', '/user/profile'),
            getItem('Logout', 'logout', '/user/logout')
        ]),
    ]
    const handleToggleUserType = () => {
        let updatingUser = { ...user };
        updatingUser.type = user.type === UserConstant.userType.PASSENGER ? UserConstant.userType.RIDER : UserConstant.userType.PASSENGER;
        axiosPOST(`${process.env.REACT_APP_API_URL}/user/toggleUserType`, {
            id: user.id
        })
            .then((response) => {
                localStorage.setItem('access_token', response.data.data.accessToken);
                // localStorage.setItem('user', JSON.stringify(updatingUser));
                setUser(updatingUser);
                navigate('/');
            })
            .catch(err => {
                console.log(err)
            })
    }
    return (
        <Sider>
            <div className='sidebar-profile'>{ThemeConstant.APP_NAME}</div>
            <div className="logo" />

            <Menu theme="dark" selectable={false} mode="inline" items={menuItems} defaultOpenKeys={['user']} />
            <div className='sidebar-mode-btn'>
                <Button type="danger" size={'large'} block onClick={handleToggleUserType}>
                    {user.type === UserConstant.userType.PASSENGER ? 'Passenger Mode' : 'Driver Mode'}
                </Button>
            </div>
        </Sider>
    );
};

export default AppSidebar;
