import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Modal, 
  Card, 
  Layout, 
  Typography,
  Tag
} from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import ShareholderCard from '../forms/ShareHolderCard'
import ShareholderForm from '../forms/ShareholderFormHolder';
import AssignShareholderModal from '../forms/AssignShareholderToCompany';
import { fetchShareholders, deleteShareholder, fetchShareholder } from '../slices/shareholderSlice';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

const { Content } = Layout;
const { Title } = Typography;

const ShareholdersList = () => {
  const dispatch = useDispatch();
  const { shareholders, loading } = useSelector((state) => state.shareholders);
  const [searchText, setSearchText] = useState('');
  const [isFormModalVisible, setFormModalVisible] = useState(false);
  const [isAssignModalVisible, setAssignModalVisible] = useState(false);
  const [isCardModalVisible, setCardModalVisible] = useState(false);
  const [selectedShareholderId, setSelectedShareholderId] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    dispatch(fetchShareholders());
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleView = (shareholderId) => {
    dispatch(fetchShareholder(shareholderId));
    setSelectedShareholderId(shareholderId);
    setCardModalVisible(true);
  };

  const handleEdit = (shareholderId) => {
    setSelectedShareholderId(shareholderId);
    setFormModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: `Are you sure you want to delete shareholder ${record.ShareholderName}?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: () => dispatch(deleteShareholder(record.ShareholderId)),
    });
  };

  const handleAssign = (shareholderId) => {
    setSelectedShareholderId(shareholderId);
    setAssignModalVisible(true);
  };

  const columns = [
    {
      title: 'Shareholder Name',
      dataIndex: 'ShareholderName',
      key: 'ShareholderName',
      filteredValue: [searchText],
      onFilter: (value, record) =>
        record.ShareholderName.toLowerCase().includes(value.toLowerCase()),
      render: (text, record) => (
        <Button type="link" onClick={() => handleView(record.ShareholderId)}>
          {text}
        </Button>
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      width: 250,
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record.ShareholderId)}>
            Edit
          </Button>
          <Button size="small" danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
          <Button 
            size="small" 
            type="primary" 
            onClick={() => handleAssign(record.ShareholderId)}
          >
            Assign Shares
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen">
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
          }}
        >
          <Card>
            <div className="flex justify-between items-center mb-6">
              <Title level={3} className="mb-0">Shareholders</Title>
              <Space>
                <Input
                  placeholder="Search shareholders"
                  value={searchText}
                  onChange={handleSearch}
                  style={{ width: 300 }}
                  prefix={<SearchOutlined />}
                  allowClear
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setSelectedShareholderId(null);
                    setFormModalVisible(true);
                  }}
                >
                  Add Shareholder
                </Button>
              </Space>
            </div>

            <Table
              columns={columns}
              dataSource={shareholders}
              rowKey="ShareholderId"
              loading={loading}
              pagination={{ pageSize: 10, showSizeChanger: true }}
              bordered
            />
          </Card>

          <Modal
            title="Shareholder Details"
            open={isCardModalVisible}
            onCancel={() => setCardModalVisible(false)}
            footer={null}
            width={800}
            destroyOnClose
          >
            <ShareholderCard shareholderId={selectedShareholderId} />
          </Modal>

          <ShareholderForm
            open={isFormModalVisible}
            shareholderId={selectedShareholderId}
            onClose={() => setFormModalVisible(false)}
          />

          <AssignShareholderModal
            open={isAssignModalVisible}
            shareholderId={selectedShareholderId}
            onClose={() => setAssignModalVisible(false)}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ShareholdersList;