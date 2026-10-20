import React from 'react';
import { useDispatch } from 'react-redux';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Button, 
  Alert,
  message
} from 'antd';
import { createRole } from '../slices/roleSlice';

const { TextArea } = Input;
const { Option } = Select;

function AddRole({ open, onClose, onAddRole }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await dispatch(createRole({
        RoleName: values.RoleName.trim(),
        Description: values.Description.trim() || null,
        Status: values.Status
      })).unwrap();
      
      message.success('Role created successfully');
      form.resetFields();
      onAddRole();
      onClose();
    } catch (error) {
      if (error === 'Role already exists') {
        form.setFields([{
          name: 'RoleName',
          errors: ['Role already exists']
        }]);
      } else {
        message.error(error || 'Failed to create role');
      }
    }
  };

  return (
    <Modal
      title="Add New Role"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          RoleName: '',
          Description: '',
          Status: 'Active'
        }}
      >
        <Form.Item
          name="RoleName"
          label="Role Name"
          rules={[
            { required: true, message: 'Role name is required' },
            { max: 50, message: 'Role name must be 50 characters or less' }
          ]}
        >
          <Input placeholder="Enter role name" />
        </Form.Item>

        <Form.Item
          name="Description"
          label="Description"
          rules={[
            { max: 255, message: 'Description must be 255 characters or less' }
          ]}
        >
          <TextArea rows={4} placeholder="Enter description (optional)" />
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
          <Button type="primary" htmlType="submit">
            Add Role
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default AddRole;