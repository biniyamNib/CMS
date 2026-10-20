import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Input, Space, Modal, Alert, Select } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { fetchUsers, deleteUser, clearError } from '../slices/userSlice';
import { fetchRoles } from '../slices/roleSlice';
import AddUser from '../forms/AddUser';
import EditUser from '../edit/EditUser';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { message } from 'antd';

const { confirm } = Modal;
const { Option } = Select;

function Users() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user: currentUser } = useSelector((state) => state.auth);
  const { users, loading, error } = useSelector((state) => state.users);
  const { roles } = useSelector((state) => state.roles);
  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const isSuperAdmin = currentUser?.primaryRole === 'SuperAdmin' || currentUser?.roles?.includes('SuperAdmin');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      dispatch(fetchUsers());
      dispatch(fetchRoles());
      dispatch(clearError());
    }
  }, [token, dispatch, navigate]);

  const handleAddUser = () => {
    setSuccessMessage('User added successfully!');
    dispatch(fetchUsers());
    setIsAddOpen(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleUpdateUser = () => {
    setSuccessMessage('User updated successfully!');
    dispatch(fetchUsers());
    setIsEditOpen(false);
    setSelectedUser(null);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDelete = (id) => {
    confirm({
      title: 'Are you sure you want to delete this user?',
      icon: <DeleteOutlined />,
      content: 'This action cannot be undone',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await dispatch(deleteUser(id)).unwrap();
          setSuccessMessage('User deleted successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
          message.error(err || 'Failed to delete user');
        }
      },
    });
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleFilterRole = (value) => {
    setFilterRole(value);
  };

  const handleFilterStatus = (value) => {
    setFilterStatus(value);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.username.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesRole = !filterRole || user.primaryRole === filterRole;
    const matchesStatus = !filterStatus || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Role',
      dataIndex: 'primaryRole',
      key: 'primaryRole',
      sorter: (a, b) => a.primaryRole.localeCompare(b.primaryRole),
    },
    ...(isSuperAdmin ? [{
      title: 'Company',
      dataIndex: 'companies',
      key: 'companies',
      sorter: (a, b) => a.companies.localeCompare(b.companies),
    }] : []),
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => (
        <span style={{ color: status === 'Active' ? '#52c41a' : '#f5222d' }}>
          {status}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined onClick={() => handleEdit(record)} style={{ color: '#1890ff', cursor: 'pointer' }} />
          <DeleteOutlined onClick={() => handleDelete(record.userId)} style={{ color: '#ff4d4f', cursor: 'pointer' }} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Navbar />
      {/* <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main style={{ flex: 1, padding: '16px', transition: 'margin-left 0.3s ease', marginLeft: collapsed ? 80 : 200 }}> */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}/>
        <main
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
        {successMessage && (
          <Alert
            message={successMessage}
            type="success"
            showIcon
            closable
            onClose={() => setSuccessMessage('')}
            style={{ marginBottom: '16px' }}
          />
        )}
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => dispatch(clearError())}
            style={{ marginBottom: '16px' }}
          />
        )}
        <div style={{ marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <Space style={{ flexWrap: 'wrap', gap: '8px' }}>
            <Input
              placeholder="Search users"
              value={searchText}
              onChange={handleSearch}
              style={{ width: '200px' }}
              prefix={<SearchOutlined />}
            />
            <Select
              placeholder="Filter by Role"
              style={{ width: '200px' }}
              onChange={handleFilterRole}
              allowClear
            >
              {Array.isArray(roles) && roles.length > 0 ? (
                roles.map((role) => (
                  <Option key={role.RoleId} value={role.RoleName}>
                    {role.RoleName}
                  </Option>
                ))
              ) : (
                <Option value="" disabled>
                  No roles available
                </Option>
              )}
            </Select>
            <Select
              placeholder="Filter by Status"
              style={{ width: '200px' }}
              onChange={handleFilterStatus}
              allowClear
            >
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAddOpen(true)}
            style={{ background: '#1890FF', borderColor: '#1890FF' }}
          >
            Add User
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="userId"
          loading={loading}
          pagination={{ pageSize: 10 }}
          style={{ background: '#FFFFFF', borderRadius: '8px', overflow: 'hidden' }}
        />
        <AddUser
          open={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onAddUser={handleAddUser}
        />
        <EditUser
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          user={selectedUser}
          onUpdateUser={handleUpdateUser}
        />
      </main>
    </div>
  );
}

export default Users;