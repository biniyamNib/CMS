
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Button, 
  Typography, 
  Divider,
  Row,
  Col,
  Alert
} from 'antd';
import { createLicense, updateLicense, fetchAllLicenses } from '../slices/licenseSlice';
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;

const LicenseForm = ({ open, licenseId, companies, onClose }) => {
  const dispatch = useDispatch();
  const { licenses, loading } = useSelector((state) => state.licenses);
  const [form] = Form.useForm();

  const selectedLicense = licenses.find((l) => l.LicenseId === licenseId);

  useEffect(() => {
    if (licenseId && selectedLicense) {
      form.setFieldsValue({
        CompanyId: selectedLicense.CompanyId,
        LicenseNo: selectedLicense.LicenseNo,
        Type: selectedLicense.Type,
        LicenseDate: moment(selectedLicense.LicenseDate),
        ExpireDate: moment(selectedLicense.ExpireDate),
        Status: selectedLicense.Status,
      });
    } else {
      form.resetFields();
    }
  }, [licenseId, selectedLicense, form]);

  const handleSubmit = (values) => {
    const licenseData = {
      ...values,
      LicenseDate: values.LicenseDate.format('YYYY-MM-DD'),
      ExpireDate: values.ExpireDate.format('YYYY-MM-DD'),
    };

    const action = licenseId 
      ? updateLicense({ licenseId, licenseData })
      : createLicense(licenseData);

    dispatch(action)
      .unwrap()
      .then(() => {
        dispatch(fetchAllLicenses()); // Refresh licenses to ensure CompanyName is included
        onClose();
      })
      .catch(error => {
        console.error('License operation failed:', error);
      });
  };

  const validateExpiration = (_, value) => {
    const licenseDate = form.getFieldValue('LicenseDate');
    if (licenseDate && value && value.isBefore(licenseDate)) {
      return Promise.reject('Expiration date must be after issue date');
    }
    return Promise.resolve();
  };

  return (
    <Modal
      title={<Title level={4}>{licenseId ? 'Edit License' : 'Add New License'}</Title>}
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
      destroyOnClose
    >
      <Divider />
      
      {licenseId && (
        <Alert 
          message={`Editing license ${selectedLicense?.LicenseNo}`}
          type="info"
          showIcon
          className="mb-4"
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="CompanyId"
              label="Company"
              rules={[{ required: true, message: 'Please select a company' }]}
            >
              <Select 
                placeholder="Select company"
                loading={companies.length === 0}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {companies.map((company) => (
                  <Option key={company.CompanyId} value={company.CompanyId}>
                    {company.CompanyName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="LicenseNo"
              label="License Number"
              rules={[
                { required: true, message: 'Please enter license number' },
                { pattern: /^[0-9]+$/, message: 'Please enter numbers only' }
              ]}
            >
              <Input placeholder="Enter license number" />
            </Form.Item>

            <Form.Item
              name="Type"
              label="License Type"
              rules={[{ required: true, message: 'Please enter license type' }]}
            >
              <Input placeholder="e.g., Trading, Construction" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="LicenseDate"
              label="Issue Date"
              rules={[{ required: true, message: 'Please select issue date' }]}
            >
              <DatePicker 
                style={{ width: '100%' }}
                disabledDate={(current) => current && current > moment().endOf('day')}
              />
            </Form.Item>

            <Form.Item
              name="ExpireDate"
              label="Expiration Date"
              rules={[
                { required: true, message: 'Please select expiration date' },
                { validator: validateExpiration }
              ]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="Status"
              label="Status"
              rules={[{ required: true, message: 'Please select status' }]}
            >
              <Select placeholder="Select status">
                <Option value="Active">Active</Option>
                <Option value="Expired">Expired</Option>
                <Option value="Suspended">Suspended</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
            >
              {licenseId ? 'Update License' : 'Create License'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LicenseForm;