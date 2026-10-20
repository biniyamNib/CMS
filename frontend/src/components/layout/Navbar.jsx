import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LogoutOutlined,
  UserOutlined,
  LockOutlined,
  BellOutlined,
  SearchOutlined,
  MoonOutlined,
  SunOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { 
  Layout,
  Menu,
  Dropdown,
  Avatar,
  Badge,
  Input,
  Space,
  Button,
  Switch,
  message,
  Popover,
  Typography,
  theme,
  List
} from 'antd';
import { logout } from '../../slices/authSlice';
import { fetchAllNotifications } from '../../slices/notificationSlice';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const { currentUser } = useSelector((state) => state.users);
  const { notifications } = useSelector((state) => state.notifications);
  const {
    token: { colorBgContainer, colorPrimary },
  } = theme.useToken();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [searchVisible, setSearchVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    if (token && notificationVisible) {
      dispatch(fetchAllNotifications());
    }
  }, [dispatch, token, notificationVisible]);

  useEffect(() => {
    if (notifications) {
      setVisibleNotifications(notifications);
    }
  }, [notifications]);

  const handleLogout = () => {
    dispatch(logout());
    message.success('Logged out successfully');
    navigate('/login');
  };

  // const handleRemoveNotification = (notificationId, e) => {
  //   e.stopPropagation();
  //   setVisibleNotifications(prev => 
  //     prev.filter(n => n.NotificationId !== notificationId)
  //   );
  // };

  const unreadCount = visibleNotifications?.filter(n => !n.ReadStatus).length || 0;

  const defaultAvatar = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3';

  const profileMenu = (
    <Menu
      className="w-56"
      items={[
        {
          key: 'profile',
          label: (
            <div className="flex items-center px-4 py-2">
              <Avatar 
                src={currentUser?.profilePic || user?.profilePic || defaultAvatar} 
                size="large"
                className="mr-3"
              />
              <div>
                <div className="font-medium">{user?.username || 'User'}</div>
                <div className="text-gray-500 text-sm">{user?.email || 'N/A'}</div>
              </div>
            </div>
          ),
          style: { cursor: 'default', pointerEvents: 'none' }
        },
        {
          type: 'divider',
        },
        {
          key: 'my-profile',
          label: 'My Profile',
          icon: <UserOutlined />,
          onClick: () => navigate('/profile')
        },
        // {
        //   key: 'change-password',
        //   label: 'Change Password',
        //   icon: <LockOutlined />,
        //   onClick: () => navigate('/change-password')
        // },
        {
          type: 'divider',
        },
        {
          key: 'logout',
          label: 'Sign Out',
          icon: <LogoutOutlined />,
          danger: true,
          onClick: handleLogout
        }
      ]}
    />
  );

  const notificationsContent = (
    <div className="w-80 rounded-lg shadow-lg" style={{ background: colorBgContainer }}>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <Text strong className="text-base">Notifications</Text>
        <Button 
          type="text" 
          size="small" 
          onClick={() => {
            navigate('/notifications');
            setNotificationVisible(false);
          }}
          className="text-primary font-medium"
        >
          View All
        </Button>
      </div>
      
      {visibleNotifications?.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <BellOutlined className="text-3xl text-gray-300 mb-3" />
          <Text type="secondary" className="text-gray-500">No notifications available</Text>
        </div>
      ) : (
        <List
          className="max-h-96 overflow-y-auto"
          dataSource={visibleNotifications.slice(0, 5)}
          renderItem={(notification) => (
            <List.Item
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
              style={{ borderBottom: '1px solid #f5f5f5' }}
              onClick={() => {
                navigate('/notifications');
                setNotificationVisible(false);
              }}
            >
              <div className="flex items-start w-full">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-1">
                    <div className={`w-2 h-2 rounded-full mr-2 flex-shrink-0 ${notification.ReadStatus ? 'bg-gray-300' : 'bg-blue-500'}`}></div>
                    <Text 
                      ellipsis 
                      className={`block ${notification.ReadStatus ? 'text-gray-600' : 'font-medium text-gray-900'}`}
                    >
                      {notification.Message}
                    </Text>
                  </div>
                  <Text type="secondary" className="text-xs">
                    {new Date(notification.Timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </div>
                {/* <Button
                  type="text"
                  icon={<CloseOutlined className="text-gray-400 hover:text-gray-600" />}
                  size="small"
                  onClick={(e) => handleRemoveNotification(notification.NotificationId, e)}
                  className="ml-2 flex-shrink-0"
                /> */}
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <Header 
      style={{ 
        background: colorBgContainer,
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        padding: '0 24px',
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1000,
        height: 64
      }}
      className="flex items-center shadow-sm"
    >
      <div className="w-full flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="flex items-center">
          <Text strong className="text-xl" style={{ color: colorPrimary }}>
            CMS
          </Text>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search */}
          {searchVisible ? (
            <div className="flex items-center">
              <Input
                placeholder="Search..."
                prefix={<SearchOutlined className="text-gray-400" />}
                className="w-64"
                autoFocus
                suffix={
                  <CloseOutlined 
                    className="text-gray-400 cursor-pointer"
                    onClick={() => setSearchVisible(false)}
                  />
                }
              />
            </div>
          ) : (
            <Button
              type="text"
              icon={<SearchOutlined />}
              onClick={() => setSearchVisible(true)}
              className="flex items-center justify-center"
            />
          )}

          {token ? (
            <>
              {/* Dark Mode Toggle */}
              <Switch
                checkedChildren={<SunOutlined />}
                unCheckedChildren={<MoonOutlined />}
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />

              {/* Notifications */}
              <Popover 
                content={notificationsContent} 
                trigger="click"
                placement="bottomRight"
                open={notificationVisible}
                onOpenChange={(visible) => {
                  setNotificationVisible(visible);
                  if (!visible) {
                    setVisibleNotifications(notifications || []);
                  }
                }}
              >
                <Badge count={unreadCount} overflowCount={9}>
                  <Button
                    type="text"
                    icon={<BellOutlined />}
                    className="flex items-center justify-center"
                  />
                </Badge>
              </Popover>

              {/* User Profile */}
              <Dropdown 
                overlay={profileMenu} 
                trigger={['click']}
                placement="bottomRight"
              >
                <div className="cursor-pointer flex items-center gap-2">
                  <Avatar 
                    src={currentUser?.profilePic || user?.profilePic || defaultAvatar} 
                    size="default"
                  />
                  <Text>{user?.username || 'User'}</Text>
                </div>
              </Dropdown>
            </>
          ) : (
            <Space>
              <Button type="text" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button type="primary" onClick={() => navigate('/')}>
                Register
              </Button>
            </Space>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            type="text"
            icon={<SearchOutlined />}
            onClick={() => setSearchVisible(!searchVisible)}
          />

          {searchVisible && (
            <div className="absolute top-16 left-0 right-0 p-4 z-50" style={{ background: colorBgContainer }}>
              <Input
                placeholder="Search..."
                prefix={<SearchOutlined className="text-gray-400" />}
                className="w-full"
                autoFocus
                suffix={
                  <CloseOutlined 
                    className="text-gray-400 cursor-pointer"
                    onClick={() => setSearchVisible(false)}
                  />
                }
              />
            </div>
          )}

          {token && (
            <>
              <Switch
                checkedChildren={<SunOutlined />}
                unCheckedChildren={<MoonOutlined />}
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                size="small"
              />

              <Popover 
                content={notificationsContent} 
                trigger="click"
                placement="bottomRight"
                open={notificationVisible}
                onOpenChange={(visible) => {
                  setNotificationVisible(visible);
                  if (!visible) {
                    setVisibleNotifications(notifications || []);
                  }
                }}
              >
                <Badge count={unreadCount} dot={unreadCount > 0}>
                  <Button
                    type="text"
                    icon={<BellOutlined />}
                  />
                </Badge>
              </Popover>

              <Dropdown 
                overlay={profileMenu} 
                trigger={['click']}
                placement="bottomRight"
              >
                <Avatar 
                  src={currentUser?.profilePic || user?.profilePic || defaultAvatar} 
                  size="default"
                  className="cursor-pointer"
                />
              </Dropdown>
            </>
          )}
        </div>
      </div>
    </Header>
  );
};

export default Navbar;