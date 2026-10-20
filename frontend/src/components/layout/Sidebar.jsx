import React from 'react';
import {
  DashboardOutlined,
  UserOutlined,
  BankOutlined,
  BellOutlined,
  FolderOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  Divider,
  Tooltip,
  theme
} from 'antd';

const { Sider } = Layout;

const menuItems = [
  { key: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
  { key: 'account', path: '/account', label: 'Account', icon: <UserOutlined /> },
  { key: 'companies', path: '/companies-management', label: 'Companies Management', icon: <BankOutlined /> },
  { key: 'notifications', path: '/notifications', label: 'Notifications', icon: <BellOutlined />, badge: 5 },
  { key: 'reports', path: '/reports', label: 'Reports', icon: <FolderOutlined /> },
 // { key: 'settings', path: '/settings', label: 'Settings', icon: <SettingOutlined /> },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const selectedKey = menuItems.find(item => location.pathname.startsWith(item.path))?.key || '';

  return (
    <Sider
      width={250}
      collapsedWidth={80}
      collapsed={collapsed}
      trigger={null}
      style={{
        background: colorBgContainer,
        boxShadow: '2px 0 8px rgba(29, 35, 41, 0.05)',
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 64, // height of the navbar
        bottom: 0,
        zIndex: 1000
      }}
      className="border-r border-gray-200"
    >
      <div className="flex flex-col h-full">
        {/* Collapse Toggle */}
        <div className="flex justify-end p-4">
          <Tooltip title={collapsed ? 'Expand' : 'Collapse'} placement="right">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px' }}
            />
          </Tooltip>
        </div>

        <Divider className="my-0" />

        {/* Menu */}
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ borderRight: 0, flex: 1 }}
          className="px-2"
        >
          {menuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.path}>
                {!collapsed ? item.label : (
                  <Tooltip title={item.label} placement="right">
                    <span>{item.label}</span>
                  </Tooltip>
                )}
                {item.badge && !collapsed && (
                  <span className="ml-auto bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            </Menu.Item>
          ))}
        </Menu>

        {/* Bottom Space */}
        <div className="p-4"></div>
      </div>
    </Sider>
  );
};

export default Sidebar;
