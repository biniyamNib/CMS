import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Button,
  Alert,
  Row,
  Col,
  Typography,
  Divider,
  Upload,
  message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { createCompany, clearError, fetchCompanies } from '../slices/companySlice';
//import moment from 'moment';

const { Option } = Select;
const { Text } = Typography;

function AddCompany({ open, onClose, onAddCompany }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.companies);
  const { token } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (open && token) {
      dispatch(clearError());
      form.resetFields();
      setFileList([]);
    }
  }, [open, token, dispatch, form]);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('CompanyName', values.companyName || '');
      formData.append('TopPosition', values.topPosition || '');
      formData.append('Type', values.type || '');
      formData.append('RegistrationNo', values.registrationNo || '');
      formData.append(
        'EstablishedDate',
        values.establishedDate ? values.establishedDate.format('YYYY-MM-DD') : ''
      );
      formData.append('TinNo', values.tinNo || '');
      formData.append('NoOfShareholders', values.noOfShareholders || 0);
      formData.append('RegisteredCapital', values.registeredCapital || 0);
      formData.append('SubscribedCapital', values.subscribedCapital || 0);
      formData.append('RegisteredShareQt', values.registeredShareQt || 0);
      formData.append('SubscribedShareQt', values.subscribedShareQt || 0);
      formData.append('ShareValue', values.shareValue || 0);
      formData.append('Address', values.address || '');
      formData.append('Phone', values.phone || '');
      formData.append('Email', values.email || '');

      console.log('fileList before FormData:', fileList);
      // Append logoFile only if a new file is selected
      const newFile = fileList.find((file) => file.originFileObj);
      if (newFile) {
        formData.append('logoFile', newFile.originFileObj);
        console.log('FormData logoFile:', newFile.originFileObj);
      } else {
        console.log('No file selected');
      }

      await dispatch(createCompany(formData)).unwrap();
      dispatch(fetchCompanies()); // Refresh companies to ensure new company displays
      message.success('Company added successfully');
      onClose();
      if (onAddCompany) {
        onAddCompany();
      }
    } catch (err) {
      console.error('Create company error:', err);
      message.error(err.message || 'Failed to create company');
    }
  };

  const uploadProps = {
    onChange: ({ fileList: newFileList }) => {
      // Update fileList only for new uploads
      const updatedFileList = newFileList.map((file) => ({
        ...file,
        status: 'uploading',
      }));
      setFileList(updatedFileList.slice(-1)); // Keep only the latest file
      console.log('Updated fileList:', updatedFileList);
    },
    onRemove: () => {
      setFileList([]);
      console.log('File removed; fileList:', []);
    },
    beforeUpload: (file) => {
      console.log('Selected file:', file);
      const isImage = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
      if (!isImage) {
        message.error('You can only upload JPEG, PNG, or GIF files!');
        return Upload.LIST_IGNORE;
      }
      return false; // Prevent automatic upload
    },
    fileList,
  };

  return (
    <Modal
      title="Add New Company"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      destroyOnClose
    >
      {error && (
        <Alert
          message="Error"
          description={error.message || 'An error occurred'}
          type="error"
          showIcon
          closable
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          noOfShareholders: 0,
          registeredCapital: 0,
          subscribedCapital: 0,
          registeredShareQt: 0,
          subscribedShareQt: 0,
          shareValue: 0,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Company Name"
              name="companyName"
              rules={[{ required: true, message: 'Please enter company name' }]}
            >
              <Input placeholder="Enter company name" />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ pattern: /^[0-9+\- ]+$/, message: 'Invalid phone number' }]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ type: 'email', message: 'Invalid email format' }]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
            <Form.Item label="Address" name="address">
              <Input placeholder="Enter company address" />
            </Form.Item>
            <Form.Item
              label="Top Position"
              name="topPosition"
              rules={[{ required: true, message: 'Please enter top position' }]}
            >
              <Input placeholder="e.g., CEO" />
            </Form.Item>
            <Form.Item
              label="Company Type"
              name="type"
              rules={[{ required: true, message: 'Please select company type' }]}
            >
              <Select placeholder="Select type">
                <Option value="Private Limited">Private Limited</Option>
                <Option value="Public Limited">Public Limited</Option>
                <Option value="LLC">LLC</Option>
                <Option value="Partnership">Partnership</Option>
                <Option value="Sole Proprietorship">Sole Proprietorship</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Registration Number"
              name="registrationNo"
              rules={[{ required: true, message: 'Please enter registration number' }]}
            >
              <Input placeholder="Enter registration number" />
            </Form.Item>
            <Form.Item
              label="TIN Number"
              name="tinNo"
              rules={[{ pattern: /^[A-Za-z0-9-]+/, message: 'Invalid TIN format' }]}
            >
              <Input placeholder="Enter TIN number" />
            </Form.Item>
            <Form.Item label="Established Date" name="establishedDate">
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>
            <Divider orientation="left" plain>
              <Text type="secondary">Financial Information</Text>
            </Divider>
            <Form.Item label="Number of Shareholders" name="noOfShareholders">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Registered Capital" name="registeredCapital">
              <InputNumber min={0} step="0.01" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Subscribed Capital" name="subscribedCapital">
              <InputNumber min={0} step="0.01" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Registered Share Quantity" name="registeredShareQt">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Subscribed Share Quantity" name="subscribedShareQt">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Share Value" name="shareValue">
              <InputNumber min={0} step="0.01" prefix="$" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Logo">
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Upload Logo</Button>
          </Upload>
        </Form.Item>
        <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Add Company
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddCompany;