import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Modal, 
  Form, 
  Select, 
  InputNumber, 
  Button, 
  Typography, 
  Divider, 
  Alert, 
  Space, 
  Tooltip,
  message 
} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { assignShareholderToCompany, fetchShareholder } from '../slices/shareholderSlice';
import { fetchCompanies } from '../slices/companySlice';

const { Title, Text } = Typography;

const AssignShareholderToCompany = ({ open, shareholderId, onClose }) => {
  const dispatch = useDispatch();
  const { loading: shareholderLoading, currentShareholder, error: shareholderError } = useSelector((state) => state.shareholders);
  const { companies, loading: companiesLoading, error: companiesError } = useSelector((state) => state.companies);
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if (open) {
      dispatch(fetchCompanies())
        .unwrap()
        .catch(err => {
          const msg = err || 'Failed to load companies';
          setErrorMessage(msg);
          message.error(msg);
        });
      if (shareholderId) {
        dispatch(fetchShareholder(shareholderId))
          .unwrap()
          .catch(err => {
            const msg = err || 'Failed to load shareholder';
            setErrorMessage(msg);
            message.error(msg);
          });
      }
    } else {
      form.resetFields();
      setErrorMessage(null);
      setValidationErrors([]);
    }
  }, [dispatch, shareholderId, open, form]);
  
    const onFinish = async (values) => {
    try {
      console.log('Form values:', { ShareholderId: shareholderId, ...values }); // Debug log
      await dispatch(
        assignShareholderToCompany({
          ShareholderId: shareholderId,
          CompanyId: values.companyId,
          ShareQt: Math.floor(values.shareQt), // Ensure integer
          ShareValue: Number(values.shareValue.toFixed(2)), // Ensure 2 decimal places
        })
      ).unwrap();
      await dispatch(fetchShareholder(shareholderId));
      message.success('Shareholder assigned successfully');
      onClose();
    } catch (err) {
      const errorMsg = err.message || 'Failed to assign shareholder';
      const validation = err.validationErrors || (err.missingFields ? [{ field: 'Request', message: `Missing fields: ${err.missingFields.join(', ')}` }] : []);
      setErrorMessage(errorMsg);
      setValidationErrors(validation);
      message.error(errorMsg);
    }
  };

  return (
    <Modal
      title={<Title level={4}>Assign Shareholder to Company</Title>}
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      destroyOnClose
      className="bg-gradient-to-br from-blue-50 to-blue-600"
    >
      <Divider style={{ borderColor: '#d9d9d9' }} />
      
      {currentShareholder && (
        <Alert
          message={<Text strong>Assigning shares to {currentShareholder.ShareholderName || 'Unknown'}</Text>}
          type="info"
          showIcon
          style={{ marginBottom: 16, background: 'rgba(255,255,255,0.95)', borderRadius: 8 }}
        />
      )}

      {(shareholderError || companiesError || errorMessage) && (
        <Alert
          message="Error"
          description={
            <Space direction="vertical">
              <Text>{errorMessage || shareholderError || companiesError}</Text>
              {validationErrors.length > 0 && (
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {validationErrors.map((err, idx) => (
                    <li key={idx}>{`${err.field}: ${err.message}`}</li>
                  ))}
                </ul>
              )}
            </Space>
          }
          type="error"
          showIcon
          style={{ marginBottom: 16, background: 'rgba(255,255,255,0.95)', borderRadius: 8 }}
        />
      )}

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="companyId"
          label={
            <span>
              Company
              <Tooltip title="Select the company to assign shares to">
                <InfoCircleOutlined style={{ marginLeft: 8, color: '#8c8c8c' }} />
              </Tooltip>
            </span>
          }
          rules={[{ required: true, message: 'Please select a company' }]}
        >
          <Select
            placeholder="Select a company"
            options={companies.map((company) => ({
              value: company.CompanyId,
              label: company.CompanyName,
            }))}
            showSearch
            optionFilterProp="label"
            loading={companiesLoading}
            notFoundContent={companiesLoading ? 'Loading...' : 'No companies found'}
            disabled={companiesLoading || !!companiesError}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="shareQt"
          label={
            <span>
              Share Quantity
              <Tooltip title="Enter the number of shares (minimum 1, integer)">
                <InfoCircleOutlined style={{ marginLeft: 8, color: '#8c8c8c' }} />
              </Tooltip>
            </span>
          }
          rules={[
            { required: true, message: 'Please enter share quantity' },
            { type: 'number', min: 1, message: 'Must be at least 1 share' },
            { type: 'integer', message: 'Share quantity must be an integer' },
          ]}
        >
          <InputNumber
            min={1}
            step={1}
            placeholder="Enter share quantity"
            style={{ width: '100%' }}
            parser={(value) => Math.floor(Number(value) || 1)}
          />
        </Form.Item>

        <Form.Item
          name="shareValue"
          label={
            <span>
              Share Value ($)
              <Tooltip title="Enter the value per share (minimum $0.01)">
                <InfoCircleOutlined style={{ marginLeft: 8, color: '#8c8c8c' }} />
              </Tooltip>
            </span>
          }
          rules={[
            { required: true, message: 'Please enter share value' },
            { type: 'number', min: 0.01, message: 'Must be at least $0.01' },
          ]}
        >
          <InputNumber
            min={0.01}
            step={0.01}
            placeholder="Enter share value"
            style={{ width: '100%' }}
            precision={2}
            parser={(value) => Number(Number(value).toFixed(2))}
          />
        </Form.Item>

        <Form.Item>
          <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
            <Button onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={shareholderLoading}
              disabled={companiesLoading || !!companiesError || !shareholderId}
            >
              Assign Shares
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AssignShareholderToCompany;