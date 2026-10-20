import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tag, Descriptions, Button, Alert, Spin } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';
import { fetchOrgStructureHistory } from '../slices/orgStructureSlice';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

const OrgStructureHistory = ({ orgStructureId }) => {
  const dispatch = useDispatch();
  const { list: history, loading, error } = useSelector(state => state.orgStructures.history);
  const [selectedRecord, setSelectedRecord] = React.useState(null);

  useEffect(() => {
    if (orgStructureId) {
      dispatch(fetchOrgStructureHistory(orgStructureId));
    }
  }, [dispatch, orgStructureId]);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => new Date(timestamp).toLocaleString(),
      sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (action) => (
        <Tag color={action === 'Create' ? 'green' : action === 'Update' ? 'blue' : 'red'}>
          {action}
        </Tag>
      ),
    },
    {
      title: 'Changed By',
      dataIndex: 'changedBy',
      key: 'changedBy',
      render: (changedBy) => changedBy?.username || 'System',
    },
    {
      title: 'Details',
      key: 'details',
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => setSelectedRecord(record)}
        >
          View Details
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading history..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        action={
          <Button 
            type="primary" 
            danger 
            onClick={() => dispatch(fetchOrgStructureHistory(orgStructureId))}
          >
            Retry
          </Button>
        }
      />
    );
  }

  if (!Array.isArray(history) || history.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No history records found for this organizational unit.</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className='flex min-h-screen'>
        <Sidebar />
    <div className="flex-1 p-4">
      <div className="flex items-center mb-4">
        <HistoryOutlined className="text-xl mr-2" />
        <h2 className="text-xl font-semibold">Change History</h2>
      </div>
      
      <Table
        columns={columns}
        dataSource={history}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
      
      <Modal
        title="Change Details"
        visible={!!selectedRecord}
        onCancel={() => setSelectedRecord(null)}
        footer={null}
        width={800}
      >
        {selectedRecord && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Action">{selectedRecord.action}</Descriptions.Item>
            <Descriptions.Item label="Changed By">
              {selectedRecord.changedBy?.username || 'System'}
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {new Date(selectedRecord.timestamp).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Details">
              <pre className="bg-gray-50 p-2 rounded overflow-auto">
                {JSON.stringify(selectedRecord.changes, null, 2)}
              </pre>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
    </div>
    </div>
  );
};

export default OrgStructureHistory;