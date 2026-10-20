import React from 'react';
import { Layout, Typography, Row, Col, Divider, Space, Button } from 'antd';
import { 
  FacebookOutlined, 
  TwitterOutlined, 
  LinkedinOutlined, 
  GithubOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';

const { Footer } = Layout;
const { Text, Link } = Typography;

const AppFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Footer style={{ 
      background: '#001529',
      color: 'rgba(255, 255, 255, 0.65)',
      padding: '48px 24px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
      }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={6}>
            <Text strong style={{ color: 'white', display: 'block', marginBottom: 16 }}>
              Corporate Management System
            </Text>
            <Text style={{ display: 'block', marginBottom: 8 }}>
              Streamline your company's organizational structure, compliance documents, 
              and shareholder information in one powerful platform.
            </Text>
            <Space size="middle" style={{ marginTop: 16 }}>
              <Button 
                type="text" 
                icon={<FacebookOutlined style={{ color: 'rgba(255, 255, 255, 0.65)' }} />} 
                href="#"
              />
              <Button 
                type="text" 
                icon={<TwitterOutlined style={{ color: 'rgba(255, 255, 255, 0.65)' }} />} 
                href="#"
              />
              <Button 
                type="text" 
                icon={<LinkedinOutlined style={{ color: 'rgba(255, 255, 255, 0.65)' }} />} 
                href="#"
              />
              <Button 
                type="text" 
                icon={<GithubOutlined style={{ color: 'rgba(255, 255, 255, 0.65)' }} />} 
                href="#"
              />
            </Space>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Text strong style={{ color: 'white', display: 'block', marginBottom: 16 }}>
              Product
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Link href="#" style={{ color: 'rgba(255, 255, 255, 0.65)', marginBottom: 8 }}>Features</Link>
              <Link href="#" style={{ color: 'rgba(255, 255, 255, 0.65)', marginBottom: 8 }}>Pricing</Link>
              <Link href="#" style={{ color: 'rgba(255, 255, 255, 0.65)', marginBottom: 8 }}>Documentation</Link>
              <Link href="#" style={{ color: 'rgba(255, 255, 255, 0.65)', marginBottom: 8 }}>API</Link>
              <Link href="#" style={{ color: 'rgba(255, 255, 255, 0.65)', marginBottom: 8 }}>Changelog</Link>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Text strong style={{ color: 'white', display: 'block', marginBottom: 16 }}>
              Company
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Link href="#" style={{ color: 'rgba(255, 255, 255, 0.65)', marginBottom: 8 }}>About Us</Link>
              <Link href="#" style={{ color: 'rgba(255, 255, 255, 0.65)', marginBottom: 8 }}>Careers</Link>
              <Link href="#" style={{ color: 'rgba(255, 255, 255, 0.65)', marginBottom: 8 }}>Blog</Link>
              <Link href="#" style={{ color: 'rgba(255, 255, 255, 0.65)', marginBottom: 8 }}>Press</Link>
              <Link href="#" style={{ color: 'rgba(255, 255, 255, 0.65)', marginBottom: 8 }}>Contact</Link>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Text strong style={{ color: 'white', display: 'block', marginBottom: 16 }}>
              Contact Us
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Space style={{ marginBottom: 8 }}>
                <MailOutlined />
                <Link href="mailto:info@companymgmt.com" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                  info@companymgmt.com
                </Link>
              </Space>
              <Space style={{ marginBottom: 8 }}>
                <PhoneOutlined />
                <Link href="tel:+1234567890" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                  +1 (234) 567-890
                </Link>
              </Space>
              <Space style={{ marginBottom: 8 }}>
                <EnvironmentOutlined />
                <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                  123 Business Ave, Suite 500<br />
                  New York, NY 10001
                </Text>
              </Space>
            </div>
          </Col>
        </Row>

        <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '24px 0' }} />

        <Row justify="space-between" align="middle">
          <Col>
            <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
              © {currentYear} Corporate Management System. All rights reserved.
            </Text>
          </Col>
          <Col>
            <Space size="middle">
              <Link href="#" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Terms</Link>
              <Link href="#" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Privacy</Link>
              <Link href="#" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Cookies</Link>
              <Link href="#" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Security</Link>
            </Space>
          </Col>
        </Row>
      </div>
    </Footer>
  );
};

export default AppFooter;