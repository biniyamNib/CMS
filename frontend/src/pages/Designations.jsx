import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Layout, 
  Card, 
  Button, 
  Modal, 
  Space, 
  Tag, 
  List, 
  Row, 
  Col, 
  Typography, 
  Input, 
  Statistic, 
  Divider, 
  Breadcrumb,
  Empty,
  Spin,
  message,
  Descriptions,
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined, 
  TeamOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  BookOutlined,
} from '@ant-design/icons';
import DesignationForm from '../forms/DesignationForm';
import { fetchAllDesignations, deleteDesignation } from '../slices/designationSlice';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

const { Content } = Layout;
const { Title, Text } = Typography;

const Designations = () => {
  const dispatch = useDispatch();
  const { designations, loading } = useSelector((state) => state.designations);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDesignationId, setSelectedDesignationId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    dispatch(fetchAllDesignations());
  }, [dispatch]);

  const handleAdd = () => {
    setSelectedDesignationId(null);
    setModalVisible(true);
  };

  const handleEdit = (designationId) => {
    setSelectedDesignationId(designationId);
    setModalVisible(true);
  };

  const handleDelete = (designationId, designationName) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: (
        <Space direction="vertical">
          <Text>Are you sure you want to delete <Text strong>{designationName}</Text>?</Text>
          <Text type="secondary">This action cannot be undone.</Text>
        </Space>
      ),
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        dispatch(deleteDesignation(designationId))
          .unwrap()
          .then(() => {
            message.success('Designation deleted successfully');
          })
          .catch(err => message.error(`Failed to delete: ${err.message}`));
      },
    });
  };

  // Safeguard against undefined Name
  const filteredDesignations = designations
    .filter(designation => designation && typeof designation.Name === 'string')
    .filter(designation =>
      designation.Name.toLowerCase().includes(searchText.toLowerCase()) ||
      (designation.Structure?.StructureName || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (designation.Company?.CompanyName || '').toLowerCase().includes(searchText.toLowerCase())
    );

  const getDesignationStats = () => ({
    total: designations.filter(d => d && typeof d.Name === 'string').length,
    active: designations.filter(d => d && d.isActive).length,
    inactive: designations.filter(d => d && !d.isActive).length,
    withQualifications: designations.filter(d => d && d.Qualifications?.length > 0).length,
  });

  const stats = getDesignationStats();

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
          }}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={3} style={{ marginBottom: 0 }}>Designation Management</Title>
              <Space>
                <Input
                  placeholder="Search designations, departments, or companies..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 300 }}
                  allowClear
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                >
                  Add Designation
                </Button>
              </Space>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={12} md={6}>
                <Card size="small" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: 8 }}>
                  <Statistic 
                    title="Total Designations" 
                    value={stats.total} 
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: '#1890ff', fontSize: 24 }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card size="small" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: 8 }}>
                  <Statistic 
                    title="Active Designations" 
                    value={stats.active} 
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#52c41a', fontSize: 24 }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card size="small" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: 8 }}>
                  <Statistic 
                    title="Inactive Designations" 
                    value={stats.inactive} 
                    prefix={<CloseCircleOutlined />}
                    valueStyle={{ color: '#f5222d', fontSize: 24 }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card size="small" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: 8 }}>
                  <Statistic 
                    title="With Qualifications" 
                    value={stats.withQualifications} 
                    prefix={<BookOutlined />}
                    valueStyle={{ color: '#fa8c16', fontSize: 24 }}
                  />
                </Card>
              </Col>
            </Row>

            {loading ? (
              <Card style={{ textAlign: 'center', padding: '50px', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Spin size="large" tip="Loading designations..." />
              </Card>
            ) : filteredDesignations.length === 0 ? (
              <Card style={{ textAlign: 'center', padding: '40px', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Empty
                  description={
                    <Text type="secondary">
                      {searchText ? 'No matching designations found' : 'No designations available'}
                    </Text>
                  }
                >
                  {!searchText && (
                    <Button type="primary" onClick={handleAdd}>
                      Add Your First Designation
                    </Button>
                  )}
                </Empty>
              </Card>
            ) : (
              <Row gutter={[16, 16]}>
                {filteredDesignations.map((designation) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={designation.DesignationId}>
                    <Card
                      title={
                        <Text strong ellipsis={{ tooltip: designation.Name }} style={{ fontSize: 16 }}>
                          {designation.Name}
                        </Text>
                      }
                      extra={
                        <Space size="small">
                          <Button 
                            size="small" 
                            icon={<EditOutlined />} 
                            onClick={() => handleEdit(designation.DesignationId)}
                            type="text"
                          />
                          <Button 
                            size="small" 
                            icon={<DeleteOutlined />} 
                            danger 
                            type="text"
                            onClick={() => handleDelete(designation.DesignationId, designation.Name)}
                          />
                        </Space>
                      }
                      hoverable
                      style={{ 
                        height: '100%', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                        borderRadius: 8, 
                        background: '#fff' 
                      }}
                      bodyStyle={{ padding: 16 }}
                    >
                      <Descriptions 
                        column={1} 
                        size="small" 
                        bordered={false} 
                        labelStyle={{ color: '#8c8c8c', width: '40%' }}
                        contentStyle={{ color: '#262626' }}
                      >
                        <Descriptions.Item label="Company">
                          {designation.Company?.CompanyName || 'N/A'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Department">
                          {designation.Structure?.StructureName || 'N/A'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Description">
                          <Text ellipsis={{ tooltip: designation.JobDescription }}>
                            {designation.JobDescription || 'No description'}
                          </Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Positions">
                          {designation.NoOfPosition || 0}
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">
                          <Tag color={designation.isActive ? 'green' : 'red'}>
                            {designation.isActive ? 'Active' : 'Inactive'}
                          </Tag>
                        </Descriptions.Item>
                      </Descriptions>
                      {designation.Qualifications?.length > 0 && (
                        <>
                          <Divider orientation="left" plain style={{ margin: '12px 0', fontSize: 12, color: '#8c8c8c' }}>
                            Qualifications
                          </Divider>
                          <List
                            size="small"
                            dataSource={designation.Qualifications}
                            renderItem={(qual) => (
                              <List.Item style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                  <Text strong style={{ fontSize: 14 }}>{qual.QualificationName}</Text>
                                  <Row gutter={[8, 4]}>
                                    <Col span={8}>
                                      <Text type="secondary" style={{ fontSize: 12 }}>
                                        Service: {qual.ServiceYear || 0} yrs
                                      </Text>
                                    </Col>
                                    <Col span={8}>
                                      <Text type="secondary" style={{ fontSize: 12 }}>
                                        Related: {qual.RelatedServiceYear || 0} yrs
                                      </Text>
                                    </Col>
                                    <Col span={8}>
                                      <Text type="secondary" style={{ fontSize: 12 }}>
                                        Allow Related: {qual.AllowRelatedQualification ? 'Yes' : 'No'}
                                      </Text>
                                    </Col>
                                  </Row>
                                </Space>
                              </List.Item>
                            )}
                          />
                        </>
                      )}
                    </Card>
                  </Col>
                ))}
              </Row>
            )}

            <DesignationForm
              open={isModalVisible}
              designationId={selectedDesignationId}
              onClose={() => {
                setModalVisible(false);
                setSelectedDesignationId(null);
              }}
            />
          </Space>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Designations;