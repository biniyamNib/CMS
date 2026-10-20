import React, { useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col, Divider, Typography } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const OrgStructureForm = ({ form, mode, onSubmit, companyId, parentId }) => {
  useEffect(() => {
    if (mode === 'create') {
      form.setFieldsValue({
        CompanyId: companyId,
        ReportingToId: parentId,
        StructureType: 'Permanent',
        ReportingType: 'Direct',
        Category: 'Operational',
      });
    }
  }, [form, mode, companyId, parentId]);

  const handleFinish = (values) => {
    onSubmit(values);
  };

  // Reset ExpiryDate when StructureType changes to Permanent
  const handleStructureTypeChange = (value) => {
    if (value === 'Permanent') {
      form.setFieldsValue({ ExpiryDate: null });
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        StructureType: 'Permanent',
        ReportingType: 'Direct',
        Category: 'Operational',
      }}
    >
      <Form.Item name="CompanyId" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="ReportingToId" hidden>
        <Input />
      </Form.Item>

      <Divider orientation="left" plain>
        <Title level={5}>Basic Information</Title>
      </Divider>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="StructureName"
            label="Structure Name"
            rules={[{ required: true, message: 'Please enter the structure name' }]}
          >
            <Input placeholder="Enter structure name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="StructureType"
            label="Structure Type"
            rules={[{ required: true, message: 'Please select structure type' }]}
          >
            <Select placeholder="Select structure type" onChange={handleStructureTypeChange}>
              <Option value="Permanent">Permanent</Option>
              <Option value="Temporary">Temporary</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="Description" label="Description">
        <TextArea rows={3} placeholder="Enter description" />
      </Form.Item>

      <Divider orientation="left" plain>
        <Title level={5}>Reporting Details</Title>
      </Divider>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="ReportingType"
            label="Reporting Type"
            rules={[{ required: true, message: 'Please select reporting type' }]}
          >
            <Select placeholder="Select reporting type">
              <Option value="Direct">Direct</Option>
              <Option value="Dotted">Dotted</Option>
              <Option value="Matrix">Matrix</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="Category"
            label="Category"
            rules={[{ required: true, message: 'Please select category' }]}
          >
            <Select placeholder="Select category">
              <Option value="Operational">Operational</Option>
              <Option value="Support">Support</Option>
              <Option value="Project">Project</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        noStyle
        dependencies={['StructureType']}
      >
        {({ getFieldValue }) => (
          <Form.Item
            name="ExpiryDate"
            label="Expiry Date"
            rules={[
              {
                validator(_, value) {
                  if (getFieldValue('StructureType') === 'Temporary' && !value) {
                    return Promise.reject(new Error('Expiry date is required for temporary structures'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker
              style={{ width: '100%' }}
              disabled={getFieldValue('StructureType') !== 'Temporary'}
              disabledDate={(current) => current && current < moment().startOf('day')}
            />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {mode === 'create' ? 'Create' : 'Update'} Structure
        </Button>
      </Form.Item>
    </Form>
  );
};

OrgStructureForm.propTypes = {
  form: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['create', 'edit']).isRequired,
  onSubmit: PropTypes.func.isRequired,
  companyId: PropTypes.string.isRequired,
  parentId: PropTypes.string,
};

export default OrgStructureForm;