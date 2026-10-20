import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanies } from '../slices/companySlice';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Card, 
  Select, 
  Spin, 
  Alert, 
  Space, 
  Typography, 
  Breadcrumb 
} from 'antd';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const OrgStructureSelector = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companies, loading, error } = useSelector(state => state.companies);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    dispatch(fetchCompanies())
      .unwrap()
      .catch(err => console.error('Failed to fetch companies:', err));
  }, [dispatch]);

  const handleCompanyChange = (companyId) => {
    if (companyId) {
      navigate(`/org-structure/${companyId}`);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
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
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Title level={3}>Select Company for Organizational Structure</Title>
            <Card style={{ maxWidth: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
              {error && (
                <Alert
                  message="Error"
                  description={error}
                  type="error"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              )}
              <Select
                placeholder="Select a Company"
                style={{ width: '100%' }}
                onChange={handleCompanyChange}
                disabled={loading}
                loading={loading}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {companies.map(company => (
                  <Option key={company.CompanyId} value={company.CompanyId}>
                    {company.CompanyName}
                  </Option>
                ))}
              </Select>
              {loading && (
                <Space style={{ marginTop: 16 }}>
                  <Spin size="small" />
                  <Text type="secondary">Loading companies...</Text>
                </Space>
              )}
            </Card>
          </Space>
        </Content>
      </Layout>
    </Layout>
  );
};

export default OrgStructureSelector;