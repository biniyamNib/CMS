import React, { useState } from "react";
import { 
  TeamOutlined, 
  SafetyOutlined
} from '@ant-design/icons';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Space,
  Layout,
  Avatar,
  theme
} from 'antd';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

const { Title, Text } = Typography;
const { Content } = Layout;

const Account = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const cards = [
    {
      name: 'User Management',
      icon: <TeamOutlined style={{ fontSize: '24px' }} />,
      link: '/users',
      color: '#1890ff',
      description: 'View, add, edit and manage system users',
    },
    {
      name: 'Role Management',
      icon: <SafetyOutlined style={{ fontSize: '24px' }} />,
      link: '/roles',
      color: '#52c41a',
      description: 'View, add, edit and manage user roles',
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />
      <Layout>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}/>
        <Content
          style={{
            flex: 1,
            margin: '88px 16px 24px',
            marginLeft: collapsed ? 96 : 266,
            padding: 24,
            background: '#F5F5F5',
            minHeight: 280,
            transition: 'margin-left 0.3s ease',
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {/* Header */}
            <div>
              <Title level={3} style={{ marginBottom: 0 }}>Account Management</Title>
              <Text type="secondary">
                Manage user accounts and system roles
              </Text>
            </div>

            {/* Management Cards */}
            <Row gutter={[16, 16]}>
              {cards.map((card, idx) => (
                <Col xs={24} sm={12} lg={8} key={idx}>
                  <Link to={card.link}>
                    <Card
                      hoverable
                      style={{ 
                        borderLeft: `4px solid ${card.color}`,
                        borderRadius: '8px',
                        height: '100%'
                      }}
                    >
                      <Space 
                        direction="vertical" 
                        size="middle" 
                        style={{ 
                          width: '100%',
                          textAlign: 'center'
                        }}
                      >
                        <Avatar
                          size={64}
                          style={{ 
                            backgroundColor: `${card.color}20`,
                            color: card.color
                          }}
                          icon={card.icon}
                        />
                        <Title level={4} style={{ margin: 0 }}>
                          {card.name}
                        </Title>
                        <Text type="secondary">
                          {card.description}
                        </Text>
                      </Space>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </Space>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Account;