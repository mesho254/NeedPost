import React, { useState } from 'react';
import { Menu, Dropdown, Avatar, Button, Drawer} from 'antd';
import { UserOutlined, MenuOutlined, LogoutOutlined } from '@ant-design/icons';
import Logo from '../assets/Logo.webp'
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';


const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const navigate  = useNavigate()
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavProfile = ()=> {
    navigate('/profile')
  }

  const NavHome = () => {
    navigate('/')
  }

  const handleNav = () => {
    navigate('/login')
  }

  const handleMenuClick = (e) => {
    console.log('Menu item clicked:', e.key);
  };

  const menu = (
    <Menu onClick={handleMenuClick} style={{padding:"13px"}}>
      <Menu.Item key="profile" onClick={NavProfile}><UserOutlined/> Profile</Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}><LogoutOutlined/> Logout</Menu.Item>
    </Menu>
  );

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <div className="navbar">
      <div className="navbar-logo"><img src={Logo} alt='Logo' style={{height:"50px", width:"50px"}}/></div>
      <div className="navbar-company">NeedsHub</div>
      <div className="navbar-menus">
        <Button type="text" className="menu-item" onClick={NavHome}>Home</Button>
        <Button type="text" className="menu-item">About</Button>
        <Button type="text" className="menu-item">Contact Us</Button>
      </div>
        {user ? (
      <div className="navbar-avatar">
        <div style={{display:"flex", alignItems:"center"}}>
            <p>{user.user && user.user.username}</p>
            <Dropdown overlay={menu} placement="bottomCenter">
            <Avatar icon={<UserOutlined />} size={50}/>
            </Dropdown>
        </div>
        </div>): (
          <Button onClick={() => handleNav('/login')} style={{ marginLeft: '10px' }}>Login</Button>
        )}
      <div className="navbar-menu-icon">
        <MenuOutlined onClick={showDrawer} />
      </div>
      <Drawer title="Menu" placement="right" onClose={onClose} visible={visible}>
        <Button type="text" className="drawer-item">Home</Button>
        <Button type="text" className="drawer-item">About</Button>
        <Button type="text" className="drawer-item">Contact Us</Button>
      </Drawer>
    </div>
  );
};

export default Navbar;
