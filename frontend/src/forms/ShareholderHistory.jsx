import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Table } from 'antd';
import { fetchShareholderHistory } from '../slices/shareholderSlice';

const ShareholderHistory = ({ open, shareholderId, onClose }) => {
  const dispatch = useDispatch();
  const { history, loading } = useSelector((state) => state.shareholders);

  useEffect(() => {
    if (open && shareholderId) {
      dispatch(fetchShareholderHistory(shareholderId));
    }
  }, [dispatch, open, shareholderId]);

  const columns = [
    {
      title: 'Action',
      dataIndex: 'Action',
      key: 'Action',
    },
    {
      title: 'User',
      dataIndex: 'User',
      key: 'User',
    },
    {
      title: 'Timestamp',
      dataIndex: 'Timestamp',
      key: 'Timestamp',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Changes',
      dataIndex: 'Changes',
      key: 'Changes',
      render: (changes) => (
        <pre style={{ margin: 0, fontSize: '12px' }}>
          {JSON.stringify(changes, null, 2)}
        </pre>
      ),
    },
  ];

  return (
    <Modal
      title="Shareholder History"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Table
        columns={columns}
        dataSource={history}
        rowKey="HistoryId"
        loading={loading}
        pagination={false}
      />
    </Modal>
  );
};

export default ShareholderHistory;