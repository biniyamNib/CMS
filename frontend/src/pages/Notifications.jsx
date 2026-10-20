import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Layout, 
  List, 
  Button, 
  Tag, 
  Space, 
  Spin, 
  Alert, 
  Typography, 
  Breadcrumb, 
  Select, 
  Card, 
  Tooltip, 
  Modal, 
  Empty,
  message
} from 'antd';
import { 
  CheckCircleOutlined, 
  DeleteOutlined, 
  BellOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { 
  fetchAllNotifications, 
  markNotificationAsRead, 
  deleteNotification 
} from '../slices/notificationSlice';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error, loaded } = useSelector((state) => state.notifications);
  const { user } = useSelector((state) => state.auth);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp-desc');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (user?.userId && !loaded) {
      dispatch(fetchAllNotifications())
        .unwrap()
        .catch(err => message.error(`Failed to fetch notifications: ${err.message}`));
    }
  }, [dispatch, user, loaded]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await dispatch(markNotificationAsRead(notificationId)).unwrap();
      message.success('Notification marked as read');
    } catch (error) {
      message.error(`Failed to mark as read: ${error.message}`);
    }
  };

  const handleDelete = (notificationId, messageText) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: (
        <Space direction="vertical">
          <Text>Are you sure you want to delete the notification: <Text strong>{messageText}</Text>?</Text>
          <Text type="secondary">This action cannot be undone.</Text>
        </Space>
      ),
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          console.log('Deleting notification:', notificationId); // Debug
          await dispatch(deleteNotification(notificationId)).unwrap();
          message.success('Notification deleted successfully');
        } catch (error) {
          console.error('Delete notification error:', error); // Debug
          message.error(`Failed to delete: ${error.message}`);
        }
      },
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filterStatus === 'read') return notification.ReadStatus;
    if (filterStatus === 'unread') return !notification.ReadStatus;
    return true;
  });

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (sortBy === 'timestamp-desc') {
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    } else if (sortBy === 'timestamp-asc') {
      return new Date(a.Timestamp) - new Date(b.Timestamp);
    } else if (sortBy === 'action') {
      return a.Action.localeCompare(b.Action);
    }
    return 0;
  });

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Navbar />
      <Layout>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}/>
        <Content 
          style={{
            flex: 1,
            margin: '88px 16px 24px',
            marginLeft: collapsed ? 96 : 266,
            padding: 24,
            background: '#F5F5F5',
            minHeight: 280,
            transition: 'margin-left 0.3s ease',
          }}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={3} style={{ marginBottom: 0 }}>Notifications</Title>
              <Space>
                <Select
                  value={filterStatus}
                  onChange={setFilterStatus}
                  style={{ width: 120 }}
                  placeholder="Filter by status"
                >
                  <Option value="all">All</Option>
                  <Option value="read">Read</Option>
                  <Option value="unread">Unread</Option>
                </Select>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  style={{ width: 160 }}
                  placeholder="Sort by"
                >
                  <Option value="timestamp-desc">Newest First</Option>
                  <Option value="timestamp-asc">Oldest First</Option>
                  <Option value="action">Action Type</Option>
                </Select>
              </Space>
            </div>

            {loading ? (
              <Card style={{ textAlign: 'center', padding: '50px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <Spin size="large" tip="Loading notifications..." />
              </Card>
            ) : error ? (
              <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                action={
                  <Button
                    type="text"
                    icon={<ReloadOutlined />}
                    onClick={() => dispatch(fetchAllNotifications())}
                  />
                }
                style={{ marginBottom: 16 }}
              />
            ) : sortedNotifications.length === 0 ? (
              <Card style={{ textAlign: 'center', padding: '40px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <Empty
                  image={<BellOutlined style={{ fontSize: 40, color: '#d9d9d9' }} />}
                  description={<Text type="secondary">No notifications found</Text>}
                />
              </Card>
            ) : (
              <Card style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <List
                  itemLayout="horizontal"
                  dataSource={sortedNotifications}
                  renderItem={(notification) => (
                    <List.Item
                      actions={[
                        !notification.ReadStatus && (
                          <Tooltip title="Mark as Read">
                            <Button
                              type="link"
                              icon={<CheckCircleOutlined />}
                              onClick={() => handleMarkAsRead(notification.NotificationId)}
                            >
                              Mark as Read
                            </Button>
                          </Tooltip>
                        ),
                        <Tooltip title="Delete Notification">
                          <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() => handleDelete(notification.NotificationId, notification.Message)}
                          >
                            Delete
                          </Button>
                        </Tooltip>,
                      ]}
                      style={{
                        background: '#fff',
                        borderRadius: 8,
                        marginBottom: 8,
                        padding: 16,
                        opacity: notification.ReadStatus ? 0.7 : 1,
                        transition: 'all 0.3s',
                      }}
                      className="hover:shadow-md"
                    >
                      <List.Item.Meta
                        avatar={<BellOutlined style={{ fontSize: 24, color: notification.ReadStatus ? '#52c41a' : '#1890ff' }} />}
                        title={
                          <Space>
                            <Text strong ellipsis={{ tooltip: notification.Message }}>
                              {notification.Message}
                            </Text>
                            <Tag color={notification.ReadStatus ? 'green' : 'blue'}>
                              {notification.ReadStatus ? 'Read' : 'Unread'}
                            </Tag>
                          </Space>
                        }
                        description={
                          <Space direction="vertical" size="small">
                            <Text>
                              <strong>Company:</strong> {notification.Company?.CompanyName || 'N/A'}
                            </Text>
                            <Text>
                              <strong>Entity:</strong> {notification.EntityType}
                            </Text>
                            <Text>
                              <strong>Action:</strong> {notification.Action}
                            </Text>
                            <Text type="secondary">
                              <strong>Time:</strong> {new Date(notification.Timestamp).toLocaleString()}
                            </Text>
                            <Text>
                              <strong>User:</strong> {notification.User?.username || 'N/A'}
                            </Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            )}
          </Space>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Notifications;