import React, { useEffect } from 'react';
import { Table, Tag, Descriptions, Button } from 'antd';
import { HistoryOutlined } from '@ant-design-icons';

const HistoryLog = ({ orgStructureId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    if (orgStructureId) {
      // Fetch history for this org structure
    }
  }, [orgStructureId]);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
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

  return (
    <div className="p-4">
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
            <Descriptions.Item label="Changed By">{selectedRecord.changedBy}</Descriptions.Item>
            <Descriptions.Item label="Date">{selectedRecord.timestamp}</Descriptions.Item>
            <Descriptions.Item label="Details">
              <pre>{JSON.stringify(selectedRecord.changes, null, 2)}</pre>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default HistoryLog;