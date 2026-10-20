import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Button, 
  Alert,
  Typography,
  message
} from 'antd';
import { fetchRole, updateRole, clearError } from '../slices/roleSlice';

const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

function EditRole({ open, onClose, role, onUpdateRole }) {
  const dispatch = useDispatch();
  const { currentRole, loading, error } = useSelector((state) => state.roles);
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && role?.RoleId) {
      dispatch(fetchRole(role.RoleId));
      dispatch(clearError());
    }
  }, [dispatch, open, role]);

  useEffect(() => {
    if (currentRole && currentRole.RoleId === role?.RoleId) {
      form.setFieldsValue({
        RoleName: currentRole.RoleName || '',
        Description: currentRole.Description || '',
        Status: currentRole.Status || 'Active',
      });
    }
  }, [currentRole, role, form]);

  const onFinish = async (values) => {
    try {
      if (currentRole?.RoleName === 'SuperAdmin') {
        message.error('Cannot edit SuperAdmin role');
        return;
      }

      const updatedRole = {
        RoleName: values.RoleName.trim(),
        Description: values.Description.trim() || null,
        Status: values.Status,
      };

      await dispatch(updateRole({ id: role.RoleId, roleData: updatedRole })).unwrap();
      message.success('Role updated successfully');
      onUpdateRole();
      onClose();
    } catch (err) {
      if (err !== 'Cannot edit SuperAdmin role') {
        message.error(err || 'Failed to update role');
      }
    }
  };

  return (
    <Modal
      title="Edit Role"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      destroyOnClose
    >
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={() => dispatch(clearError())}
          style={{ marginBottom: 24 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          RoleName: '',
          Description: '',
          Status: 'Active',
        }}
      >
        <Form.Item
          name="RoleName"
          label="Role Name"
          rules={[
            { required: true, message: 'Role name is required' },
            { max: 50, message: 'Role name must be 50 characters or less' },
          ]}
        >
          <Input placeholder="Enter role name" />
        </Form.Item>

        <Form.Item
          name="Description"
          label="Description"
          rules={[
            { max: 255, message: 'Description must be 255 characters or less' },
          ]}
        >
          <TextArea rows={3} placeholder="Enter description (optional)" />
        </Form.Item>

        <Form.Item
          name="Status"
          label="Status"
          rules={[{ required: true, message: 'Status is required' }]}
        >
          <Select>
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
          </Select>
        </Form.Item>

        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            disabled={currentRole?.RoleName === 'SuperAdmin'}
          >
            Update Role
          </Button>
        </div>

        {currentRole?.RoleName === 'SuperAdmin' && (
          <Text type="warning" style={{ display: 'block', marginTop: 16 }}>
            SuperAdmin role cannot be edited
          </Text>
        )}
      </Form>
    </Modal>
  );
}

export default EditRole;