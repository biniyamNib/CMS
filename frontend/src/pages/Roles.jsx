import React, { useEffect, useState } from 'react';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined // Added this import
} from '@ant-design/icons';
import { 
  Table, 
  Button, 
  Card, 
  Typography, 
  Space, 
  Tag, 
  Modal,
  Alert,
  Input,
  Layout,
  theme
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchRoles, deleteRole, clearError, clearSuccessMessage } from '../slices/roleSlice';
import AddRole from '../forms/AddRole';
import EditRole from '../edit/EditRole';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

const { Title, Text } = Typography;
const { Content } = Layout;
const { confirm } = Modal;

function Roles() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { roles, loading, error, successMessage } = useSelector((state) => state.roles);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      dispatch(fetchRoles());
      dispatch(clearError());
    }
  }, [token, dispatch, navigate]);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => dispatch(clearSuccessMessage()), 3000);
    }
  }, [successMessage, dispatch]);

  const handleAddRole = () => {
    dispatch(fetchRoles());
    setIsAddOpen(false);
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setIsEditOpen(true);
  };

  const handleUpdateRole = () => {
    dispatch(fetchRoles());
    setIsEditOpen(false);
    setSelectedRole(null);
  };

  const handleDelete = (id) => {
    confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this role?',
      onOk: async () => {
        await dispatch(deleteRole(id));
      },
    });
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredRoles = roles.filter(role => 
    role.RoleName.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Role Name',
      dataIndex: 'RoleName',
      key: 'RoleName',
    },
    {
      title: 'Description',
      dataIndex: 'Description',
      key: 'Description',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Created By',
      dataIndex: ['Creator', 'username'],
      key: 'Creator',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Created',
      dataIndex: 'CreatedDate',
      key: 'CreatedDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Updated',
      dataIndex: 'UpdatedDate',
      key: 'UpdatedDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.RoleId)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Layout>
        <Sidebar  collapsed={collapsed} setCollapsed={setCollapsed}/>
        <Content
          // style={{
          //   marginTop: 64,
          //   marginLeft: collapsed ? 80 : 250,
          //   padding: 24,
          //   background: colorBgContainer,
          //   transition: 'margin-left 0.2s',
          // }}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={3} style={{ marginBottom: 0 }}>Role Management</Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsAddOpen(true)}
              >
                Add Role
              </Button>
            </div>

            {successMessage && (
              <Alert
                message={successMessage}
                type="success"
                showIcon
                closable
                style={{ marginBottom: 16 }}
              />
            )}

            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                closable
                style={{ marginBottom: 16 }}
                action={
                  <Button 
                    size="small" 
                    type="text" 
                    icon={<ReloadOutlined />}
                    onClick={() => {
                      dispatch(clearError());
                      dispatch(fetchRoles());
                    }}
                  />
                }
              />
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <Input
                placeholder="Search roles"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={handleSearch}
                style={{ width: 300 }}
                allowClear
              />
            </div>

            <Card>
              <Table
                columns={columns}
                dataSource={filteredRoles}
                rowKey="RoleId"
                loading={loading}
                pagination={{ pageSize: 10 }}
                locale={{
                  emptyText: 'No roles found'
                }}
              />
            </Card>

            <AddRole
              open={isAddOpen}
              onClose={() => setIsAddOpen(false)}
              onAddRole={handleAddRole}
            />
            <EditRole
              open={isEditOpen}
              onClose={() => setIsEditOpen(false)}
              role={selectedRole}
              onUpdateRole={handleUpdateRole}
            />
          </Space>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Roles;