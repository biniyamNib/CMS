import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Select, DatePicker, InputNumber, Upload, message, Alert, Card, Steps, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { register, clearError } from '../../slices/authSlice';
import { countries } from 'countries-list';

const { Option } = Select;
const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const Register = () => {
  const [form] = Form.useForm();
  console.log('Form instance created:', form);
  const [currentStep, setCurrentStep] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [logoFileList, setLogoFileList] = useState([]);

  const countryOptions = Object.values(countries).map((country) => ({
    value: country.name,
    label: country.name,
  }));
  const companyTypes = ['LLC', 'Corporation', 'Partnership', 'Sole Proprietorship', 'Private Limited', 'Public Limited'];
  const industries = ['Technology', 'Manufacturing', 'Finance', 'Healthcare', 'Retail'];

  const logoUploadProps = {
    onChange: ({ fileList: newFileList }) => {
      const updatedFileList = newFileList.map((file) => ({ ...file, status: 'done' }));
      setLogoFileList(updatedFileList.slice(-1));
      form.setFieldsValue({ logoFile: updatedFileList[0] || null });
    },
    onRemove: () => {
      setLogoFileList([]);
      form.setFieldsValue({ logoFile: null });
    },
    beforeUpload: (file) => {
      const isImage = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
      if (!isImage) {
        message.error('You can only upload JPEG, PNG, or GIF files!');
        return Upload.LIST_IGNORE;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('File must be smaller than 5MB!');
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    fileList: logoFileList,
  };

  const handleSubmit = async (values) => {
    try {
      console.log('Submitting form with values:', values);
      const allValues = form.getFieldsValue(true);
      console.log('All form values:', allValues);

      const requiredFields = [
        'username', 'firstName', 'lastName', 'email', 'password',
        'companyName', 'tin', 'registrationNumber', 'type', 'industry',
        'fiscalYearStart', 'topPosition', 'phone', 'companyEmail',
        ['address', 'street'], ['address', 'city'], ['address', 'country'], ['address', 'postalCode']
      ];
      const missingFields = requiredFields.filter(field => {
        if (Array.isArray(field)) {
          return !form.getFieldValue(field) || form.getFieldValue(field) === '';
        }
        return !allValues[field] || allValues[field] === '';
      });
      if (missingFields.length > 0) {
        console.log('Missing fields:', missingFields);
        message.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }

      const formData = new FormData();
      formData.append('username', allValues.username);
      formData.append('firstName', allValues.firstName);
      formData.append('lastName', allValues.lastName);
      formData.append('email', allValues.email);
      formData.append('password', allValues.password);
      formData.append('companyName', allValues.companyName);
      formData.append('tin', allValues.tin);
      formData.append('registrationNumber', allValues.registrationNumber);
      formData.append('type', allValues.type);
      formData.append('industry', allValues.industry);
      formData.append('fiscalYearStart', allValues.fiscalYearStart.format('YYYY-MM-DD'));
      formData.append('parentCompanyId', allValues.parentCompanyId || '');
      formData.append('topPosition', allValues.topPosition);
      formData.append('phone', allValues.phone);
      formData.append('companyEmail', allValues.companyEmail);
      formData.append('streetAddress', allValues.address.street);
      formData.append('city', allValues.address.city);
      formData.append('state', allValues.address.state || '');
      formData.append('country', allValues.address.country);
      formData.append('postalCode', allValues.address.postalCode);
      formData.append('noOfShareholders', allValues.noOfShareholders || 0);
      formData.append('registeredCapital', allValues.registeredCapital || 0);
      formData.append('subscribedCapital', allValues.subscribedCapital || 0);
      formData.append('registeredShareQt', allValues.registeredShareQt || 0);
      formData.append('subscribedShareQt', allValues.subscribedShareQt || 0);
      formData.append('shareValue', allValues.shareValue || 0);
      if (logoFileList[0]?.originFileObj) {
        formData.append('logoFile', logoFileList[0].originFileObj);
      }

      for (let [key, value] of formData.entries()) {
        console.log(`FormData: ${key} = ${value}`);
      }

      await dispatch(register(formData)).unwrap();
      form.resetFields();
      setLogoFileList([]);
      message.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      console.error('Submission error:', err);
      message.error(err.message || 'Registration failed');
    }
  };

  const next = () => {
    form.validateFields().then(() => {
      const allValues = form.getFieldsValue(true);
      console.log('Step validated, moving to next:', allValues);
      if (currentStep === 0 && !allValues.username) {
        message.error('Please complete User Details fields');
        return;
      }
      if (currentStep === 1 && !allValues.companyName) {
        message.error('Please complete Company Details fields');
        return;
      }
      if (currentStep === 2 && !allValues.address?.street) {
        message.error('Please complete Address fields');
        return;
      }
      if (currentStep === 3 && !allValues.noOfShareholders) {
        message.error('Please complete Financials fields');
        return;
      }
      if (currentStep === 4 && !allValues.logoFile) {
        message.error('Please upload a company logo');
        return;
      }
      setCurrentStep(currentStep + 1);
    }).catch((errorInfo) => {
      console.log('Validation failed:', errorInfo);
      message.error('Please complete all required fields in this step.');
    });
  };

  const prev = () => setCurrentStep(currentStep - 1);

  const steps = [
    {
      title: 'User Details',
      content: (
        <>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: 'Please enter your username' },
              { min: 3, message: 'Username must be at least 3 characters' },
            ]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: 'Please enter your first name' }]}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: 'Please enter your last name' }]}
          >
            <Input placeholder="Enter last name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter a password' },
              { min: 8, message: 'Password must be at least 8 characters' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message: 'Password must include uppercase, lowercase, number, and special character',
              },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm password" />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Company Details',
      content: (
        <>
          <Form.Item
            label="Company Name"
            name="companyName"
            rules={[{ required: true, message: 'Please enter company name' }]}
          >
            <Input placeholder="Enter company name" />
          </Form.Item>
          <Form.Item
            label="TIN Number"
            name="tin"
            rules={[
              { required: true, message: 'Please enter the TIN' },
              { pattern: /^\d{9}$/, message: 'TIN must be a 9-digit number (US EIN format)' },
            ]}
          >
            <Input placeholder="Enter TIN number" />
          </Form.Item>
          <Form.Item
            label="Registration Number"
            name="registrationNumber"
            rules={[{ required: true, message: 'Please enter registration number' }]}
          >
            <Input placeholder="Enter registration number" />
          </Form.Item>
          <Form.Item
            label="Company Type"
            name="type"
            rules={[{ required: true, message: 'Please select company type' }]}
          >
            <Select placeholder="Select type">
              {companyTypes.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Industry"
            name="industry"
            rules={[{ required: true, message: 'Please select an industry' }]}
          >
            <Select placeholder="Select industry">
              {industries.map((industry) => (
                <Option key={industry} value={industry}>
                  {industry}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Fiscal Year Start"
            name="fiscalYearStart"
            rules={[{ required: true, message: 'Please select fiscal year start' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            label="Parent Company"
            name="parentCompanyId"
          >
            <Select placeholder="Select parent company (optional)">
              <Option value="">None</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Top Position"
            name="topPosition"
            rules={[{ required: true, message: 'Please enter top position' }]}
          >
            <Input placeholder="e.g., CEO" />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: 'Please enter phone number' },
              { pattern: /^[0-9+\- ]+$/, message: 'Invalid phone number' },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item
            label="Company Email"
            name="companyEmail"
            rules={[{ required: true, type: 'email', message: 'Invalid email format' }]}
          >
            <Input placeholder="Enter company email" />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Address',
      content: (
        <>
          <Form.Item
            label="Street Address"
            name={['address', 'street']}
            rules={[{ required: true, message: 'Please enter street address' }]}
          >
            <Input placeholder="Enter street address" />
          </Form.Item>
          <Form.Item
            label="City"
            name={['address', 'city']}
            rules={[{ required: true, message: 'Please enter city' }]}
          >
            <Input placeholder="Enter city" />
          </Form.Item>
          <Form.Item
            label="State/Province"
            name={['address', 'state']}
          >
            <Input placeholder="Enter state/province (optional)" />
          </Form.Item>
          <Form.Item
            label="Postal Code"
            name={['address', 'postalCode']}
            rules={[{ required: true, message: 'Please enter postal code' }]}
          >
            <Input placeholder="Enter postal code" />
          </Form.Item>
          <Form.Item
            label="Country"
            name={['address', 'country']}
            rules={[{ required: true, message: 'Please select a country' }]}
          >
            <Select
              showSearch
              placeholder="Select country"
              optionFilterProp="label"
              options={countryOptions}
            />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Financials',
      content: (
        <>
          <Form.Item
            name="noOfShareholders"
            label="Number of Shareholders"
            rules={[
              { required: true, message: 'Please input the number of shareholders!' },
              { type: 'number', min: 0, message: 'Must be a non-negative number!' },
            ]}
          >
            <InputNumber placeholder="Enter number of shareholders" size="large" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="registeredCapital"
            label="Registered Capital"
            rules={[
              { required: true, message: 'Please input the registered capital!' },
              { type: 'number', min: 0, message: 'Must be a non-negative number!' },
            ]}
          >
            <InputNumber
              placeholder="Enter registered capital"
              size="large"
              style={{ width: '100%' }}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
          <Form.Item
            name="subscribedCapital"
            label="Subscribed Capital"
            rules={[
              { required: true, message: 'Please input the subscribed capital!' },
              { type: 'number', min: 0, message: 'Must be a non-negative number!' },
            ]}
          >
            <InputNumber
              placeholder="Enter subscribed capital"
              size="large"
              style={{ width: '100%' }}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
          <Form.Item
            name="registeredShareQt"
            label="Registered Share Quantity"
            rules={[
              { required: true, message: 'Please input the registered share quantity!' },
              { type: 'number', min: 0, message: 'Must be a non-negative number!' },
            ]}
          >
            <InputNumber placeholder="Enter registered share quantity" size="large" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="subscribedShareQt"
            label="Subscribed Share Quantity"
            rules={[
              { required: true, message: 'Please input the subscribed share quantity!' },
              { type: 'number', min: 0, message: 'Must be a non-negative number!' },
            ]}
          >
            <InputNumber placeholder="Enter subscribed share quantity" size="large" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="shareValue"
            label="Share Value"
            rules={[
              { required: true, message: 'Please input the share value!' },
              { type: 'number', min: 0, message: 'Must be a non-negative number!' },
            ]}
          >
            <InputNumber
              placeholder="Enter share value"
              size="large"
              style={{ width: '100%' }}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Document Upload',
      content: (
        <div>
          <Form.Item
            name="logoFile"
            label="Company Logo"
            rules={[{ required: true, message: 'Please upload a company logo!' }]}
          >
            <Upload
              {...logoUploadProps}
              accept="image/*"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload Logo</Button>
            </Upload>
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'Review & Submit',
      content: (
        <div className="space-y-6">
          <div>
            <Title level={4} className="text-indigo-600">Personal Information</Title>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow-sm border border-indigo-100">
                <Text strong className="block text-indigo-500 text-sm">Username</Text>
                <Text className="text-indigo-800">{form.getFieldValue('username') || '-'}</Text>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border border-indigo-100">
                <Text strong className="block text-indigo-500 text-sm">First Name</Text>
                <Text className="text-indigo-800">{form.getFieldValue('firstName') || '-'}</Text>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border border-indigo-100">
                <Text strong className="block text-indigo-500 text-sm">Last Name</Text>
                <Text className="text-indigo-800">{form.getFieldValue('lastName') || '-'}</Text>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border border-indigo-100">
                <Text strong className="block text-indigo-500 text-sm">Email</Text>
                <Text className="text-indigo-800">{form.getFieldValue('email') || '-'}</Text>
              </div>
            </div>
          </div>
          <div>
            <Title level={4} className="text-indigo-600">Company Information</Title>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow-sm border border-indigo-100">
                <Text strong className="block text-indigo-500 text-sm">Company Name</Text>
                <Text className="text-indigo-800">{form.getFieldValue('companyName') || '-'}</Text>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border border-indigo-100">
                <Text strong className="block text-indigo-500 text-sm">TIN</Text>
                <Text className="text-indigo-800">{form.getFieldValue('tin') || '-'}</Text>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border border-indigo-100">
                <Text strong className="block text-indigo-500 text-sm">Registration Number</Text>
                <Text className="text-indigo-800">{form.getFieldValue('registrationNumber') || '-'}</Text>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border border-indigo-100">
                <Text strong className="block text-indigo-500 text-sm">Company Type</Text>
                <Text className="text-indigo-800">{form.getFieldValue('type') || '-'}</Text>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border border-indigo-100">
                <Text strong className="block text-indigo-500 text-sm">Industry</Text>
                <Text className="text-indigo-800">{form.getFieldValue('industry') || '-'}</Text>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border border-indigo-100">
                <Text strong className="block text-indigo-500 text-sm">Fiscal Year Start</Text>
                <Text className="text-indigo-800">{form.getFieldValue('fiscalYearStart')?.format('MMMM YYYY') || '-'}</Text>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border border-indigo-100">
                <Text strong className="block text-indigo-500 text-sm">Top Position</Text>
                <Text className="text-indigo-800">{form.getFieldValue('topPosition') || '-'}</Text>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border border-indigo-100">
                <Text strong className="block text-indigo-500 text-sm">Phone Number</Text>
                <Text className="text-indigo-800">{form.getFieldValue('phone') || '-'}</Text>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border border-indigo-100">
                <Text strong className="block text-indigo-500 text-sm">Company Email</Text>
                <Text className="text-indigo-800">{form.getFieldValue('companyEmail') || '-'}</Text>
              </div>
            </div>
          </div>
          <div>
            <Title level={4} className="text-indigo-600">Address</Title>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow-sm border border-indigo-100">
                <Text strong className="block text-indigo-500 text-sm">Street Address</Text>
                <Text className="text-indigo-800">{form.getFieldValue(['address', 'street']) || '-'}</Text>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border border-indigo-100">
                <Text strong className="block text-indigo-500 text-sm">City</Text>
                <Text className="text-indigo-800">{form.getFieldValue(['address', 'city']) || '-'}</Text>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border border-indigo-100">
                <Text strong className="block text-indigo-500 text-sm">State/Province</Text>
                <Text className="text-indigo-800">{form.getFieldValue(['address', 'state']) || '-'}</Text>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border border-indigo-100">
                <Text strong className="block text-indigo-500 text-sm">Postal Code</Text>
                <Text className="text-indigo-800">{form.getFieldValue(['address', 'postalCode']) || '-'}</Text>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border border-indigo-100">
                <Text strong className="block text-indigo-500 text-sm">Country</Text>
                <Text className="text-indigo-800">{form.getFieldValue(['address', 'country']) || '-'}</Text>
              </div>
            </div>
          </div>
          <div>
            <Title level={4} className="text-indigo-600">Financials</Title>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow-sm border border-indigo-100">
                <Text strong className="block text-indigo-500 text-sm">Number of Shareholders</Text>
                <Text className="text-indigo-800">{form.getFieldValue('noOfShareholders') ?? '-'}</Text>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border border-indigo-100">
                <Text strong className="block text-indigo-500 text-sm">Registered Capital</Text>
                <Text className="text-indigo-800">{form.getFieldValue('registeredCapital') ? `$ ${form.getFieldValue('registeredCapital').toLocaleString()}` : '-'}</Text>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border border-indigo-100">
                <Text strong className="block text-indigo-500 text-sm">Subscribed Capital</Text>
                <Text className="text-indigo-800">{form.getFieldValue('subscribedCapital') ? `$ ${form.getFieldValue('subscribedCapital').toLocaleString()}` : '-'}</Text>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border border-indigo-100">
                <Text strong className="block text-indigo-500 text-sm">Registered Share Quantity</Text>
                <Text className="text-indigo-800">{form.getFieldValue('registeredShareQt') ?? '-'}</Text>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border border-indigo-100">
                <Text strong className="block text-indigo-500 text-sm">Subscribed Share Quantity</Text>
                <Text className="text-indigo-800">{form.getFieldValue('subscribedShareQt') ?? '-'}</Text>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border border-indigo-100">
                <Text strong className="block text-indigo-500 text-sm">Share Value</Text>
                <Text className="text-indigo-800">{form.getFieldValue('shareValue') ? `$ ${form.getFieldValue('shareValue').toLocaleString()}` : '-'}</Text>
              </div>
            </div>
          </div>
          <div>
            <Title level={4} className="text-indigo-600">Document</Title>
            <div className="bg-white p-4 rounded shadow-sm border border-indigo-100">
              <Text strong className="block text-indigo-500 text-sm">Company Logo</Text>
              <Text className="text-indigo-800">{form.getFieldValue('logoFile')?.name || '-'}</Text>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const stepColors = [
    'bg-gradient-to-br from-indigo-50 to-blue-50',
    'bg-gradient-to-br from-blue-50 to-teal-50',
    'bg-gradient-to-br from-teal-50 to-green-50',
    'bg-gradient-to-br from-green-50 to-lime-50',
    'bg-gradient-to-br from-lime-50 to-yellow-50',
    'bg-gradient-to-br from-yellow-50 to-orange-50',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl shadow-2xl border-0 overflow-hidden" bodyStyle={{ padding: 0 }}>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 bg-gradient-to-b from-indigo-600 to-purple-600 text-white p-8 hidden md:block">
            <div className="sticky top-8">
              <Title level={3} className="!text-white !mb-6">Company Registration</Title>
              <Paragraph className="text-indigo-100 block mb-8">
                Follow these simple steps to register your company and get started with our platform.
              </Paragraph>
              <Steps current={currentStep} direction="vertical" className="registration-steps">
                {steps.map((step) => (
                  <Step
                    key={step.title}
                    title={<span className="text-white">{step.title}</span>}
                    className="!text-white"
                  />
                ))}
              </Steps>
              <div className="mt-8 pt-6 border-t border-indigo-500">
                <Text className="text-indigo-100">Already have an account?</Text>
                <Button
                  type="link"
                  className="!text-white !p-0 !ml-2 hover:!text-indigo-200"
                  onClick={() => navigate('/login')}
                >
                  Sign in here
                </Button>
              </div>
            </div>
          </div>
          <div className={`w-full md:w-3/4 ${stepColors[currentStep]} p-8 transition-all duration-300`}>
            <div className="block md:hidden mb-6">
              <Steps current={currentStep} responsive={false} className="mb-6">
                {steps.map((step) => (
                  <Step key={step.title} title={step.title} />
                ))}
              </Steps>
            </div>
            {error && (
              <Alert
                message="Registration Error"
                description={error}
                type="error"
                showIcon
                closable
                className="mb-6"
                onClose={() => dispatch(clearError())}
              />
            )}
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              onValuesChange={(changedValues, allValues) => {
                console.log('Form values changed:', allValues);
              }}
              initialValues={{
                noOfShareholders: 0,
                registeredCapital: 0,
                subscribedCapital: 0,
                registeredShareQt: 0,
                subscribedShareQt: 0,
                shareValue: 0,
                address: {},
              }}
            >
              {steps[currentStep].content}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                {currentStep > 0 ? (
                  <Button
                    onClick={prev}
                    size="large"
                    disabled={loading}
                    className="min-w-[120px] bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                  >
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}
                {currentStep < steps.length - 1 ? (
                  <Button
                    type="primary"
                    onClick={next}
                    size="large"
                    disabled={loading}
                    className="min-w-[120px] bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    loading={loading}
                    disabled={loading}
                    className="min-w-[120px] bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                    onClick={() => {
                      console.log('Submit button clicked');
                      form.submit();
                    }}
                  >
                    Submit
                  </Button>
                )}
              </div>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Register;