import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Table, 
  Button, 
  Input, 
  Select, 
  Space, 
  Modal, 
  Badge, 
  Tooltip, 
  Card, 
  Typography,
  Layout,
  Statistic,
  Row,
  Col,
  Tag
} from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import LicenseForm from '../forms/LicenseForm';
import { fetchAllLicenses, deleteLicense } from '../slices/licenseSlice';
import { fetchCompanies } from '../slices/companySlice';
import moment from 'moment';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

const { Content } = Layout;
const { Title, Text } = Typography;

const Licenses = () => {
  const dispatch = useDispatch();
  const { licenses, loading: licensesLoading } = useSelector((state) => state.licenses);
  const { companies, loading: companiesLoading } = useSelector((state) => state.companies);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [isFormModalVisible, setFormModalVisible] = useState(false);
  const [selectedLicenseId, setSelectedLicenseId] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    dispatch(fetchAllLicenses());
    dispatch(fetchCompanies());
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
  };

  const handleEdit = (licenseId) => {
    setSelectedLicenseId(licenseId);
    setFormModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Confirm License Deletion',
      content: (
        <>
          <p>Are you sure you want to delete license <Text strong>{record.LicenseNo}</Text>?</p>
          <p>This action cannot be undone.</p>
        </>
      ),
      okText: 'Delete',
      okType: 'danger',
      onOk: () => dispatch(deleteLicense(record.LicenseId)),
    });
  };

  const checkExpiration = (expireDate) => {
    const today = moment();
    const expiration = moment(expireDate);
    const daysUntilExpiration = expiration.diff(today, 'days');
    if (daysUntilExpiration < 0) return 'expired';
    if (daysUntilExpiration <= 30) return 'warning';
    return 'valid';
  };

  const getLicenseStats = () => {
    const stats = {
      total: licenses.length,
      active: licenses.filter(l => l.Status === 'Active').length,
      expired: licenses.filter(l => l.Status === 'Expired').length,
      suspended: licenses.filter(l => l.Status === 'Suspended').length,
    };
    return stats;
  };

  const columns = [
    {
      title: 'Company',
      dataIndex: 'CompanyName',
      key: 'CompanyName',
      filteredValue: [searchText],
      onFilter: (value, record) =>
        (record.CompanyName || '').toLowerCase().includes(value.toLowerCase()) ||
        record.LicenseNo.toString().toLowerCase().includes(value.toLowerCase()) ||
        record.Type.toLowerCase().includes(value.toLowerCase()),
      sorter: (a, b) => (a.CompanyName || '').localeCompare(b.CompanyName || ''),
      render: (text) => text || 'N/A',
    },
    {
      title: 'License Number',
      dataIndex: 'LicenseNo',
      key: 'LicenseNo',
      sorter: (a, b) => a.LicenseNo - b.LicenseNo,
    },
    {
      title: 'Type',
      dataIndex: 'Type',
      key: 'Type',
      sorter: (a, b) => a.Type.localeCompare(b.Type),
    },
    {
      title: 'Issue Date',
      dataIndex: 'LicenseDate',
      key: 'LicenseDate',
      render: (date) => moment(date).format('DD MMM YYYY'),
      sorter: (a, b) => moment(a.LicenseDate).unix() - moment(b.LicenseDate).unix(),
    },
    {
      title: 'Expiration Date',
      dataIndex: 'ExpireDate',
      key: 'ExpireDate',
      render: (date) => {
        const status = checkExpiration(date);
        return (
          <Tooltip
            title={
              status === 'expired'
                ? 'License has expired'
                : status === 'warning'
                ? 'License expires soon'
                : 'License is valid'
            }
          >
            <Badge
              status={
                status === 'expired' ? 'error' : status === 'warning' ? 'warning' : 'success'
              }
              text={moment(date).format('DD MMM YYYY')}
            />
          </Tooltip>
        );
      },
      sorter: (a, b) => moment(a.ExpireDate).unix() - moment(b.ExpireDate).unix(),
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Expired', value: 'Expired' },
        { text: 'Suspended', value: 'Suspended' },
      ],
      filteredValue: statusFilter ? [statusFilter] : null,
      onFilter: (value, record) => record.Status === value,
      render: (status) => (
        <Tag
          color={
            status === 'Active' ? 'green' : 
            status === 'Expired' ? 'red' : 'orange'
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button 
            size="small" 
            onClick={() => handleEdit(record.LicenseId)}
          >
            Edit
          </Button>
          <Button 
            size="small" 
            danger 
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const stats = getLicenseStats();

  return (
    <Layout className="min-h-screen">
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
          <Card>
            <div className="flex justify-between items-center mb-6">
              <Title level={3} className="mb-0">License Management</Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setSelectedLicenseId(null);
                  setFormModalVisible(true);
                }}
              >
                Add License
              </Button>
            </div>

            <Row gutter={16} className="mb-6">
              <Col span={6}>
                <Card size="small">
                  <Statistic title="Total Licenses" value={stats.total} />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic title="Active" value={stats.active} valueStyle={{ color: '#52c41a' }} />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic title="Expired" value={stats.expired} valueStyle={{ color: '#f5222d' }} />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic title="Suspended" value={stats.suspended} valueStyle={{ color: '#fa8c16' }} />
                </Card>
              </Col>
            </Row>

            <div className="flex justify-between items-center mb-4">
              <Input
                placeholder="Search licenses..."
                value={searchText}
                onChange={handleSearch}
                style={{ width: 300 }}
                prefix={<SearchOutlined />}
                allowClear
              />
              <Select
                placeholder="Filter by status"
                allowClear
                style={{ width: 150 }}
                onChange={handleStatusFilter}
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Expired', label: 'Expired' },
                  { value: 'Suspended', label: 'Suspended' },
                ]}
              />
            </div>

            <Table
              columns={columns}
              dataSource={licenses}
              rowKey="LicenseId"
              loading={licensesLoading || companiesLoading}
              pagination={{ 
                pageSize: 10, 
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} licenses`
              }}
              bordered
              size="middle"
            />
          </Card>

          <LicenseForm
            open={isFormModalVisible}
            licenseId={selectedLicenseId}
            companies={companies}
            onClose={() => {
              setFormModalVisible(false);
              setSelectedLicenseId(null);
            }}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Licenses;