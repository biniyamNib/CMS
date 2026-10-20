import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Layout,
  Card,
  Descriptions,
  Avatar,
  Spin,
  Alert,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Typography,
  Breadcrumb,
  Empty,
  Tooltip,
  Upload,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { fetchUser, updateUser } from "../slices/userSlice";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

const { Content } = Layout;
const { Title, Text } = Typography;

const Profile = () => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.auth);
  const {
    currentUser,
    loading: userLoading,
    error: userError,
  } = useSelector((state) => state.users);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (authUser?.userId) {
      dispatch(fetchUser(authUser.userId))
        .unwrap()
        .catch((err) => message.error(`Failed to fetch user: ${err.message}`));
    }
  }, [dispatch, authUser]);

  const showModal = () => {
    form.setFieldsValue({
      username: currentUser?.username || "",
      email: currentUser?.email || "",
    });
    setFileList([]);
    setPreviewImage('');
    setIsModalVisible(true);
  };

  // const handleOk = async () => {
  //   try {
  //     await form.validateFields();
  //     const values = form.getFieldsValue();
  //     const formData = new FormData();
      
  //     if (values.username) formData.append('username', values.username);
  //     if (values.email) formData.append('email', values.email);
  //     if (values.password && values.password === values.confirmPassword) {
  //       formData.append('password', values.password);
  //     }
  //     if (fileList.length > 0 && fileList[0].originFileObj) {
  //       formData.append('profilePic', fileList[0].originFileObj);
  //     }

  //     await dispatch(
  //       updateUser({
  //         id: authUser.userId,
  //         userData: formData,
  //       })
  //     ).unwrap();
      
  //     message.success("Profile updated successfully");
  //     setIsModalVisible(false);
  //     form.resetFields();
  //     setFileList([]);
  //     setPreviewImage('');
  //     dispatch(fetchUser(authUser.userId));
  //   } catch (error) {
  //     message.error(error.message || "Failed to update profile");
  //   }
  // };

  const handleOk = async () => {
  try {
    await form.validateFields();
    const values = form.getFieldsValue();

    let userData;
    if (fileList.length > 0 && fileList[0].originFileObj) {
      // Use FormData if there's a file
      userData = new FormData();
      if (values.username) userData.append('username', values.username);
      if (values.email) userData.append('email', values.email);
      if (values.password && values.password === values.confirmPassword) {
        userData.append('password', values.password);
      } else if (values.password && values.password !== values.confirmPassword) {
        message.error('Passwords do not match');
        return;
      }
      userData.append('profilePic', fileList[0].originFileObj);
      for (let [key, value] of userData.entries()) {
        console.log(`FormData: ${key} =`, value);
      }
    } else {
      // Use JSON if no file
      userData = {};
      if (values.username) userData.username = values.username;
      if (values.email) userData.email = values.email;
      if (values.password && values.password === values.confirmPassword) {
        userData.password = values.password;
      } else if (values.password && values.password !== values.confirmPassword) {
        message.error('Passwords do not match');
        return;
      }
      console.log('JSON userData:', userData);
    }

    await dispatch(
      updateUser({
        id: authUser.userId,
        userData,
      })
    ).unwrap();

    message.success('Profile updated successfully');
    setIsModalVisible(false);
    form.resetFields();
    setFileList([]);
    setPreviewImage('');
    dispatch(fetchUser(authUser.userId));
  } catch (error) {
    console.error('Profile update error:', error);
    message.error(error.message || 'Failed to update profile');
  }
};

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setFileList([]);
    setPreviewImage('');
  };

  const handlePreview = async (file) => {
    if (!file.originFileObj || !(file.originFileObj instanceof Blob)) {
      message.error('Invalid file selected for preview');
      return;
    }
    if (!file.url && !file.preview) {
      try {
        file.preview = await getBase64(file.originFileObj);
        setPreviewImage(file.preview);
      } catch (error) {
        message.error('Failed to preview image', error);
      }
    } else {
      setPreviewImage(file.url || file.preview);
    }
  };

  const uploadProps = {
    onRemove: () => {
      setFileList([]);
      setPreviewImage('');
      return true;
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isImage) {
        message.error('You can only upload image files!');
        return Upload.LIST_IGNORE;
      }
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      handlePreview(file);
      return false; // Prevent automatic upload
    },
    fileList,
    accept: 'image/*',
    listType: 'picture-card',
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
    },
    onPreview: handlePreview,
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!(file instanceof Blob)) {
        reject(new Error('Invalid file type'));
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  if (userLoading) {
    return (
      <Layout className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <Layout>
          <Sidebar
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />
          <Content
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Spin size="large" tip="Loading profile..." />
          </Content>
        </Layout>
      </Layout>
    );
  }

  if (userError) {
    return (
      <Layout className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <Layout>
          <Sidebar
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />
          <Content
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Alert
              message="Error"
              description={userError}
              type="error"
              showIcon
              action={
                <Button
                  type="text"
                  icon={<ReloadOutlined />}
                  onClick={() => dispatch(fetchUser(authUser.userId))}
                />
              }
              style={{
                maxWidth: 600,
                width: "100%",
                background: "rgba(255,255,255,0.95)",
                borderRadius: 8,
              }}
            />
          </Content>
        </Layout>
      </Layout>
    );
  }

  if (!currentUser) {
    return (
      <Layout className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <Layout>
          <Sidebar
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />
          <Content
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Empty
              description={
                <Text type="secondary">User information is not available.</Text>
              }
              style={{
                background: "rgba(255,255,255,0.95)",
                padding: 40,
                borderRadius: 8,
              }}
            />
          </Content>
        </Layout>
      </Layout>
    );
  }

  const { userId, username, email, status, PrimaryRole, profilePic } = currentUser;
  const fullName = username || userId || "N/A";
  const roleName = PrimaryRole?.RoleName || "N/A";

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <Layout>
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
        <Content
          style={{
            padding: "24px",
            marginTop: 64,
            marginLeft: sidebarCollapsed ? 80 : 250,
            transition: "margin-left 0.3s ease-in-out",
          }}
        >
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            <Title level={3} style={{ marginBottom: 0}}>
              User Profile
            </Title>
            <Card
              style={{
                boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                background: "rgba(255,255,255,0.95)",
              }}
              title={
                <Space align="center">
                  <Avatar
                    size={80}
                    src={profilePic}
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#1890ff" }}
                  />
                  <Text strong style={{ fontSize: 20 }}>
                    {fullName}
                  </Text>
                </Space>
              }
              extra={
                <Tooltip title="Edit Profile">
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={showModal}
                  >
                    Edit Profile
                  </Button>
                </Tooltip>
              }
            >
              <Descriptions
                bordered
                column={1}
                labelStyle={{ fontWeight: "bold" }}
              >
                <Descriptions.Item label="Username">
                  {username || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {email || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Role">{roleName}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  {status || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Space>
        </Content>
      </Layout>
      <Modal
        title={<Title level={4}>Edit Profile</Title>}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
        confirmLoading={userLoading}
        centered
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          name="edit_profile"
        >
          <Form.Item
            name="username"
            label={
              <span>
                Username
                <Tooltip title="Enter username (min 3 chars)">
                  <InfoCircleOutlined
                    style={{ marginLeft: 8, color: '#8c8c8c' }}
                  />
                </Tooltip>
              </span>
            }
            rules={[
              { min: 3, message: 'Username must be at least 3 characters' },
            ]}
          >
            <Input placeholder="username" />
          </Form.Item>
          <Form.Item
            name="email"
            label={
              <span>
                Email
                <Tooltip title="Enter a valid email address">
                  <InfoCircleOutlined
                    style={{ marginLeft: 8, color: "#8c8c8c" }}
                  />
                </Tooltip>
              </span>
            }
            rules={[
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item
            name="password"
            label={
              <span>
                New Password
                <Tooltip title="Enter a new password (min 6 chars)">
                  <InfoCircleOutlined
                    style={{ marginLeft: 8, color: "#8c8c8c" }}
                  />
                </Tooltip>
              </span>
            }
            rules={[
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password placeholder="Leave blank to keep current password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label={
              <span>
                Confirm Password
                <Tooltip title="Re-enter password to confirm password">
                  <InfoCircleOutlined
                    style={{ marginLeft: 8, color: "#8c8c8c" }}
                  />
                </Tooltip>
              </span>
            }
            dependencies={["password"]}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!getFieldValue('password') || !value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                }
              })
            ]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>
          <Form.Item label="Profile Picture">
          <Upload {...uploadProps}>
            {fileList.length >= 1 ? null : (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload Picture</div>
              </div>
            )}
          </Upload>
          {previewImage && (
            <img
              alt="Preview"
              style={{ width: '100%', marginTop: 16 }}
              src={previewImage}
            />
          )}
        </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Profile;