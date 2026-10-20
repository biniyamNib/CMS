import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { approveOrgStructureChange } from '../slices/orgStructureSlice';

const ApprovalWorkflow = () => {
  const dispatch = useDispatch();
  //const { user } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.orgStructures);
  const [approvals, setApprovals] = useState([]); // Assume fetched via API

  useEffect(() => {
    // Fetch pending approvals for user (mocked for brevity)
    // Replace with actual API call
    setApprovals([
      {
        approvalId: '1',
        action: 'Create',
        requestDetails: { StructureName: 'Test Dept', StructureType: 'Department', Category: 'Business' },
        requestedBy: 'user1',
      },
    ]);
  }, []);

  const handleApprove = async (approvalId, status) => {
    try {
      const comments = prompt(`Enter comments for ${status}:`);
      await dispatch(approveOrgStructureChange({ approvalId, status, comments })).unwrap();
      setApprovals((prev) => prev.filter((a) => a.approvalId !== approvalId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2>Pending Approvals</h2>
      {error && <p className="text-red-500">{error}</p>}
      {approvals.length === 0 ? (
        <p>No pending approvals.</p>
      ) : (
        <ul className="space-y-4">
          {approvals.map((approval) => (
            <li key={approval.approvalId} className="border p-4 rounded">
              <p>Action: {approval.action}</p>
              <p>Name: {approval.requestDetails.StructureName}</p>
              <p>Type: {approval.requestDetails.StructureType || '-'}</p>
              <p>Category: {approval.requestDetails.Category || '-'}</p>
              <p>Requested By: {approval.requestedBy}</p>
              <button
                onClick={() => handleApprove(approval.approvalId, 'Approved')}
                className="btn btn-success mr-2"
                disabled={loading}
              >
                Approve
              </button>
              <button
                onClick={() => handleApprove(approval.approvalId, 'Rejected')}
                className="btn btn-danger"
                disabled={loading}
              >
                Reject
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApprovalWorkflow;