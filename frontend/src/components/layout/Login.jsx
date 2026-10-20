import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MailOutlined, 
  LockOutlined, 
  LoadingOutlined,
  UserOutlined
} from '@ant-design/icons';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Space, 
  Alert, 
  message,
  Divider,
  Checkbox 
} from 'antd';
import { login, clearError } from '../../slices/authSlice';

const { Title, Text } = Typography;

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      message.success('Login successful! Redirecting to dashboard...');
      navigate('/dashboard');
    }
    if (error) {
      dispatch(clearError());
    }
  }, [isAuthenticated, user, navigate, dispatch, error]);

  const onFinish = async (values) => {
    try {
      await dispatch(login({
        email: values.email,
        password: values.password,
        remember: rememberMe
      })).unwrap();
    } catch (err) {
      message.error(err || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card 
        className="w-full max-w-md shadow-xl border-0"
        styles={{
          body: {
            padding: '40px',
          }
        }}
      >
        <Space direction="vertical" size="middle" className="w-full">
          <div className="text-center">
            <Title level={3} className="!mb-1 !text-indigo-600">
              Welcome Back
            </Title>
            <Text type="secondary" className="text-sm">
              Sign in to access your dashboard
            </Text>
          </div>

          {error && (
            <Alert
              message="Login Error"
              description={error}
              type="error"
              showIcon
              closable
              className="mb-4"
              afterClose={() => dispatch(clearError())}
            />
          )}

          <Divider className="!my-6" />

          <Form
            form={form}
            name="login"
            initialValues={{ remember: rememberMe }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input 
                prefix={<MailOutlined className="text-gray-400" />} 
                placeholder="Enter your email" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input your password!' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined className="text-gray-400" />} 
                placeholder="Enter your password" 
                size="large"
              />
            </Form.Item>

            <div className="flex justify-between items-center mb-6">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                >
                  Remember me
                </Checkbox>
              </Form.Item>

              <Link 
                to="/reset-password-request" 
                className="text-indigo-600 hover:underline text-sm"
              >
                Forgot password?
              </Link>
            </div>

            <Form.Item className="!mt-2">
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                size="large"
                loading={loading}
                icon={loading ? <LoadingOutlined /> : <UserOutlined />}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Form.Item>
          </Form>

          <Divider className="!my-4">or</Divider>

          <div className="text-center">
            <Text type="secondary">
              Don't have an account?{' '}
              <Link to="/" className="text-indigo-600 hover:underline">
                Register now
              </Link>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
}

export default Login;