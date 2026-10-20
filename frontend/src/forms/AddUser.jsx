import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Form, Input, Select, Button, Alert } from 'antd';
import { createUser, clearError } from '../slices/userSlice';
import { fetchRoles } from '../slices/roleSlice';
import { fetchCompanies } from '../slices/companySlice';

const { Option } = Select;

function AddUser({ open, onClose, onAddUser }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.users);
  const { token, user: currentUser } = useSelector((state) => state.auth);
  const { roles } = useSelector((state) => state.roles);
  const { companies } = useSelector((state) => state.companies);
  const [form] = Form.useForm();
  const isSuperAdmin = currentUser?.primaryRole === 'SuperAdmin' || currentUser?.roles?.includes('SuperAdmin');

  useEffect(() => {
    if (open && token) {
      dispatch(fetchRoles());
      if (isSuperAdmin) dispatch(fetchCompanies());
      dispatch(clearError());
      form.resetFields();
    }
  }, [open, token, dispatch, form, isSuperAdmin]);

  const onFinish = async (values) => {
    try {
      const userData = {
        ...values,
        companies: isSuperAdmin ? (values.companies || []) : [currentUser.CompanyId],
      };
      await dispatch(createUser(userData)).unwrap();
      form.resetFields();
      onAddUser();
      onClose();
    } catch (err) {
      form.setFields([
        {
          name: 'email',
          errors: err === 'Email already exists' ? ['Email already exists'] : [],
        },
      ]);
    }
  };

  return (
    <Modal
      title="Add New User"
      open={open}
      onCancel={onClose}
      footer={null}
      style={{ borderRadius: '8px' }}
    >
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: '16px' }}
          closable
          onClose={() => dispatch(clearError())}
        />
      )}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ Status: 'Active' }}
      >
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: 'Please enter first name' }]}
        >
          <Input placeholder="Enter first name" />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: 'Please enter last name' }]}
        >
          <Input placeholder="Enter last name" />
        </Form.Item>
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Please enter username' }]}
        >
          <Input placeholder="Enter username" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Invalid email format' },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter password' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>
        <Form.Item
          name="RoleId"
          label="Role"
          rules={[{ required: true, message: 'Please select a role' }]}
        >
          <Select placeholder="Select Role">
            {Array.isArray(roles) && roles.length > 0 ? (
              roles.map((role) => (
                <Option key={role.RoleId} value={role.RoleId}>
                  {role.RoleName}
                </Option>
              ))
            ) : (
              <Option value="" disabled>
                No roles available
              </Option>
            )}
          </Select>
        </Form.Item>
        {isSuperAdmin && (
          <Form.Item
            name="companies"
            label="Assigned Companies"
            rules={[{ required: false }]}
          >
            <Select mode="multiple" placeholder="Select companies">
              {companies.map((company) => (
                <Option key={company.CompanyId} value={company.CompanyId}>
                  {company.CompanyName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <Form.Item
          name="Status"
          label="Status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select>
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
          </Select>
        </Form.Item>
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }} disabled={loading}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add User
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default AddUser;