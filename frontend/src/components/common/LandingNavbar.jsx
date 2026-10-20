import React, { useState } from 'react';
import { 
  Layout, 
  Menu, 
  Typography, 
  Button, 
  Space, 
  Avatar, 
  Drawer,
  Row,
  Col,
  Divider
} from 'antd';
import { 
  MenuOutlined, 
  CloseOutlined,
  BankOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  LoginOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const { Header } = Layout;
const { Title, Text } = Typography;

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { token } = useSelector(state => state.auth);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const menuItems = [
    {
      key: 'features',
      label: 'Features',
      onClick: () => navigate('/#features')
    },
    {
      key: 'solutions',
      label: 'Solutions',
      onClick: () => navigate('/#solutions')
    },
    {
      key: 'pricing',
      label: 'Pricing',
      onClick: () => navigate('/pricing')
    },
    {
      key: 'resources',
      label: 'Resources',
      onClick: () => navigate('/resources')
    }
  ];

  const mobileMenuItems = [
    {
      key: 'dashboard',
      icon: <AppstoreOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard')
    },
    {
      key: 'companies',
      icon: <BankOutlined />,
      label: 'Companies',
      onClick: () => navigate('/companies')
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Users',
      onClick: () => navigate('/users')
    },
    {
      key: 'team',
      icon: <TeamOutlined />,
      label: 'Team',
      onClick: () => navigate('/team')
    },
    {
      key: 'documents',
      icon: <FileTextOutlined />,
      label: 'Documents',
      onClick: () => navigate('/documents')
    },
    {
      key: 'licenses',
      icon: <SafetyCertificateOutlined />,
      label: 'Licenses',
      onClick: () => navigate('/licenses')
    },
    {
      key: 'divider',
      type: 'divider'
    },
    ...menuItems
  ];

  return (
    <Header style={{
      position: 'fixed',
      zIndex: 100,
      width: '100%',
      background: '#fff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      padding: '0 24px',
      height: '64px',
      lineHeight: '64px'
    }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Space size="middle">
            <Avatar 
              src="/logo.png" 
              size="large"
              style={{ 
                backgroundColor: '#1890ff',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            >
              {!token && <BankOutlined />}
            </Avatar>
            <Title 
              level={4} 
              style={{ 
                marginBottom: 0,
                cursor: 'pointer',
                display: 'inline-block'
              }}
              onClick={() => navigate('/')}
            >
              Company<span style={{ color: '#1890ff' }}>Sys</span>
            </Title>
          </Space>
        </Col>

        <Col xs={0} sm={0} md={24}>
          <Row justify="end" gutter={16}>
            <Col>
              <Menu
                mode="horizontal"
                items={menuItems}
                style={{ 
                  borderBottom: 'none',
                  lineHeight: '62px'
                }}
              />
            </Col>
            <Col>
              <Space>
                {token ? (
                  <Button type="primary" onClick={() => navigate('/dashboard')}>
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button onClick={() => navigate('/login')}>
                      Sign In
                    </Button>
                    <Button 
                      type="primary" 
                      onClick={() => navigate('/register')}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </Space>
            </Col>
          </Row>
        </Col>

        <Col md={0}>
          <Button 
            type="text" 
            icon={<MenuOutlined />} 
            onClick={showDrawer}
            style={{ fontSize: '16px' }}
          />
        </Col>
      </Row>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <Space>
            <Avatar 
              src="/logo.png" 
              size="default"
              style={{ 
                backgroundColor: '#1890ff'
              }}
            />
            <Title level={4} style={{ marginBottom: 0 }}>
              Company<span style={{ color: '#1890ff' }}>Sys</span>
            </Title>
          </Space>
        }
        placement="right"
        closable={false}
        onClose={onClose}
        open={visible}
        bodyStyle={{ padding: 0 }}
        headerStyle={{ padding: '16px 24px' }}
        extra={
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            onClick={onClose}
          />
        }
      >
        <Menu
          mode="inline"
          items={mobileMenuItems}
          style={{ borderRight: 0 }}
        />
        <Divider style={{ margin: 0 }} />
        <div style={{ padding: '24px' }}>
          {token ? (
            <Button 
              type="primary" 
              block
              size="large"
              onClick={() => {
                navigate('/dashboard');
                onClose();
              }}
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button 
                block
                size="large"
                style={{ marginBottom: '16px' }}
                icon={<LoginOutlined />}
                onClick={() => {
                  navigate('/login');
                  onClose();
                }}
              >
                Sign In
              </Button>
              <Button 
                type="primary" 
                block
                size="large"
                onClick={() => {
                  navigate('/register');
                  onClose();
                }}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
        <Divider style={{ margin: 0 }} />
        <div style={{ padding: '24px' }}>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>
            Contact Us
          </Text>
          <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
            support@companysys.com
          </Text>
          <Text type="secondary" style={{ display: 'block' }}>
            +1 (555) 123-4567
          </Text>
        </div>
      </Drawer>
    </Header>
  );
};

export default Navbar;