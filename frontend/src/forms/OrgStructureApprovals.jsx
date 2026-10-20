import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tag, Button, Space, Modal, message, Badge, Input, Alert } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { fetchOrgStructureApprovals, respondToApproval } from '../slices/orgStructureSlice';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

const { TextArea } = Input;

const OrgStructureApprovals = () => {
  const dispatch = useDispatch();
  const { list: approvals, loading, error } = useSelector(state => state.orgStructures.approvals);
  const { user } = useSelector(state => state.auth);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const [errorVisible, setErrorVisible] = useState(!!error);

  useEffect(() => {
    dispatch(fetchOrgStructureApprovals())
      .unwrap()
      .then(data => console.log('Approvals fetched in component:', data))
      .catch(err => {
        message.error(`Failed to fetch approvals: ${err}`);
        setErrorVisible(true);
      });
  }, [dispatch]);

  useEffect(() => {
    setErrorVisible(!!error);
    console.log('Redux state:', { approvals, loading, error });
  }, [approvals, loading, error]);

  const handleApprove = (id) => {
    setActionLoading(prev => ({ ...prev, [id]: 'approve' }));
    Modal.confirm({
      title: 'Approve this request?',
      content: 'This action cannot be undone.',
      onOk: () => {
        return dispatch(respondToApproval({ approvalId: id, action: 'approve', reason: '' }))
          .unwrap()
          .then(() => {
            message.success('Approval processed successfully');
            dispatch(fetchOrgStructureApprovals());
          })
          .catch(err => {
            message.error(`Failed to approve: ${err}`);
            console.error('Approve error:', err);
          })
          .finally(() => setActionLoading(prev => ({ ...prev, [id]: undefined })));
      },
    });
  };

  const handleReject = (id) => {
    setActionLoading(prev => ({ ...prev, [id]: 'reject' }));
    Modal.confirm({
      title: 'Reject this request?',
      content: (
        <div>
          <p>Please provide a reason for rejection.</p>
          <TextArea
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter rejection reason"
          />
        </div>
      ),
      onOk: () => {
        if (!rejectionReason.trim()) {
          message.error('Rejection reason is required');
          return Promise.reject();
        }
        return dispatch(respondToApproval({ approvalId: id, action: 'reject', reason: rejectionReason }))
          .unwrap()
          .then(() => {
            message.success('Request rejected');
            dispatch(fetchOrgStructureApprovals());
            setRejectionReason('');
          })
          .catch(err => {
            message.error(`Failed to reject: ${err}`);
            console.error('Reject error:', err);
          })
          .finally(() => setActionLoading(prev => ({ ...prev, [id]: undefined })));
      },
      onCancel: () => setRejectionReason(''),
    });
  };

  const columns = [
    {
      title: 'Request ID',
      dataIndex: 'ApprovalRequestId',
      key: 'ApprovalRequestId',
      sorter: (a, b) => a.ApprovalRequestId.localeCompare(b.ApprovalRequestId),
    },
    {
      title: 'Action',
      dataIndex: 'Action',
      key: 'Action',
      render: (action) => (
        <Tag color={action === 'Create' ? 'green' : action === 'Update' ? 'blue' : 'red'}>
          {action}
        </Tag>
      ),
      filters: [
        { text: 'Create', value: 'Create' },
        { text: 'Update', value: 'Update' },
        { text: 'Delete', value: 'Delete' },
      ],
      onFilter: (value, record) => record.Action === value,
    },
    {
      title: 'Structure Name',
      dataIndex: 'StructureName',
      key: 'StructureName',
      sorter: (a, b) => a.StructureName.localeCompare(b.StructureName),
    },
    {
      title: 'Requested By',
      dataIndex: 'RequestedByUsername',
      key: 'RequestedByUsername',
      sorter: (a, b) => a.RequestedByUsername.localeCompare(b.RequestedByUsername),
    },
    {
      title: 'Approver',
      dataIndex: 'ApproverUsername',
      key: 'ApproverUsername',
      sorter: (a, b) => a.ApproverUsername.localeCompare(b.ApproverUsername),
    },
    {
      title: 'Date',
      dataIndex: 'CreatedAt',
      key: 'CreatedAt',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.CreatedAt) - new Date(b.CreatedAt),
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      render: (status) => (
        <Badge
          status={status === 'Approved' ? 'success' : status === 'Rejected' ? 'error' : 'processing'}
          text={status}
        />
      ),
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Approved', value: 'Approved' },
        { text: 'Rejected', value: 'Rejected' },
      ],
      onFilter: (value, record) => record.Status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          {user?.role === 'SuperAdmin' && record.Status === 'Pending' && (
            <>
              <Button
                icon={<CheckOutlined />}
                size="small"
                type="text"
                loading={actionLoading[record.ApprovalRequestId] === 'approve'}
                onClick={() => handleApprove(record.ApprovalRequestId)}
              />
              <Button
                icon={<CloseOutlined />}
                size="small"
                type="text"
                danger
                loading={actionLoading[record.ApprovalRequestId] === 'reject'}
                onClick={() => handleReject(record.ApprovalRequestId)}
              />
            </>
          )}
        </Space>
      ),
    },
  ];

  console.log('Table dataSource:', Array.isArray(approvals) ? approvals : []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">Pending Approvals</h1>
            <Button
              type="primary"
              onClick={() => dispatch(fetchOrgStructureApprovals())}
              loading={loading}
            >
              Refresh
            </Button>
          </div>
          {errorVisible && (
            <Alert
              message="Error"
              description={error}
              type="error"
              closable
              onClose={() => setErrorVisible(false)}
              className="mb-6"
            />
          )}
          {Array.isArray(approvals) && approvals.length === 0 && !loading && (
            <Alert
              message="No Approvals"
              description="There are no pending approvals to display."
              type="info"
              showIcon
              className="mb-6"
            />
          )}
          <Table
            columns={columns}
            dataSource={Array.isArray(approvals) ? approvals : []}
            loading={loading}
            rowKey="ApprovalRequestId"
            pagination={{ pageSize: 10 }}
            className="bg-white shadow-md rounded"
            scroll={{ x: 'max-content' }}
          />
        </div>
      </div>
    </div>
  );
};

export default OrgStructureApprovals;