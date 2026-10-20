import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Button,
  Typography,
  Divider,
  List,
  Tag,
  Upload,
  message,
  Row,
  Col,
} from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { createSubCompany, fetchCompanies } from '../slices/companySlice';

const { Option } = Select;
const { Text, Title } = Typography;

function SubCompanies({ open, onClose, company }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [showForm, setShowForm] = useState(false);
  const [fileList, setFileList] = useState([]);

  if (!company || !company.CompanyName) {
    onClose();
    return null;
  }

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('companyName', values.companyName || '');
      formData.append('topPosition', values.topPosition || '');
      formData.append('type', values.type || '');
      formData.append('registrationNo', values.registrationNo || '');
      formData.append('establishedDate', values.establishedDate ? values.establishedDate.format('YYYY-MM-DD') : '');
      formData.append('tinNo', values.tinNo || '');
      formData.append('noOfShareholders', values.noOfShareholders || 0);
      formData.append('registeredCapital', values.registeredCapital || 0);
      formData.append('subscribedCapital', values.subscribedCapital || 0);
      formData.append('registeredShareQt', values.registeredShareQt || 0);
      formData.append('subscribedShareQt', values.subscribedShareQt || 0);
      formData.append('shareValue', values.shareValue || 0);
      formData.append('address', values.address || '');
      formData.append('phone', values.phone || '');
      formData.append('email', values.email || '');
      if (fileList.length > 0) {
        formData.append('logoFile', fileList[0]);
      }

      await dispatch(createSubCompany({
        parentCompanyId: company.CompanyId,
        data: formData
      })).unwrap();

      await dispatch(fetchCompanies());

      message.success('SubSub company created successfully');
      form.resetFields();
      setShowForm(false);
      //setFile([]);
      onClose();
    } catch (error) {
      console.error('Failed to create subSubcompany:', error);
      message.error(error.message || 'Failed to create subSub company');
    }
  };

  const uploadProps = {
    onRemove: () => {
      setFileList([]);
      return false;
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Invalid You can only upload image files!');
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      return false; // Prevent automatic upload
    },
    fileList,
  };

  return (
    <Modal
      title={`Sub-Companies for ${company.CompanyName}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      destroyOnClose
    >
      <div style={{ marginBottom: 16 }}>
        <Title level={5}>Existing Sub-Companies</Title>
        {company.SubCompanies?.length ? (
          <List
            size="small"
            bordered
            dataSource={company.SubCompanies}
            renderItem={(sub) => (
              <List.Item key={sub.CompanyId}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Text strong>{sub.CompanyName || 'N/A'}</Text>
                  <Tag color={sub.Status === 'Active' ? 'green' : 'red'}>
                    {sub.Status || 'N/A'}
                  </Tag>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Text type="secondary">No subSub-companies</Text>
        )}
      </div>

      {!showForm && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowForm(true)}
          style={{ marginBottom: 16 }}
        >
          Add Sub-Company
        </Button>
      )}

      {showForm && (
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
                <Input />
              </Form.Item>
              <Form.Item label="Phone" name="phone">
                <Input />
              </Form.Item>
              <Form.Item 
                label="Email" 
                name="email" 
                rules={[{ type: 'email', message: 'Invalid email format' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Address" name="address">
                <Input />
              </Form.Item>
              <Form.Item 
                label="Top Position" 
                name="topPosition" 
                rules={[{ required: true, message: 'Please enter top position' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item 
                label="Company Type" 
                name="type" 
                rules={[{ required: true, message: 'Please select company type' }]}
              >
                <Select>
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
                <Input />
              </Form.Item>
              <Form.Item label="TIN Number" name="tinNo">
                <Input />
              </Form.Item>
              <Form.Item label="Established Date" name="establishedDate">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Divider orientation="left"> 
                <Text type="secondary">Financial Info</Text> 
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

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">Create Sub-Company</Button>
            </div>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}

export default SubCompanies;