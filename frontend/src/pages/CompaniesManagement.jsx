import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { 
  Layout,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Avatar,
  theme
} from 'antd';
import {
  BankOutlined,
  ShareAltOutlined,
  PercentageOutlined,
  ApartmentOutlined,
  TeamOutlined
} from '@ant-design/icons';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

const { Title } = Typography;
const { Content } = Layout;

const CompaniesManagement = () => {
 // const { companyId } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const cards = [
    {
      name: 'Companies',
      icon: <BankOutlined style={{ fontSize: '24px' }} />,
      link: '/companies',
      color: '#1890ff',
    },
    {
      name: 'Org Structure',
      icon: <ApartmentOutlined style={{ fontSize: '24px' }} />,
      link: '/org-structure',
      color: '#52c41a',
    },
    {
      name: 'Shareholders',
      icon: <ShareAltOutlined style={{ fontSize: '24px' }} />,
      link: '/shareholders',
      color: '#722ed1',
    },
    {
      name: 'Licenses',
      icon: <PercentageOutlined style={{ fontSize: '24px' }} />,
      link: '/licenses',
      color: '#f5222d',
    },
    {
      name: 'Designations',
      icon: <TeamOutlined style={{ fontSize: '24px' }} />,
      link: '/designations',
      color: '#faad14',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
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
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Title level={3} style={{ marginBottom: 0 }}>Companies Management</Title>
            
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

export default CompaniesManagement;