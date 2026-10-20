import React, { useState, useEffect } from 'react';
import orgStructureService from '../../services/orgStructureService';

function OrgStructureManagement() {
  const userRole = 'Admin'; // Mock; replace with auth context
  const [nodes, setNodes] = useState([]);
  const [companyId, setCompanyId] = useState('');
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [managerId, setManagerId] = useState('');
  const [designationId, setDesignationId] = useState('');

  // Fetch nodes on mount
  useEffect(() => {
    if (['Admin', 'HR'].includes(userRole)) {
      orgStructureService.getNodes().then(setNodes).catch(console.error);
    }
  }, [userRole]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!['Admin', 'HR'].includes(userRole)) return;

    const nodeData = {
      companyId,
      name,
      parentId: parentId || null,
      managerId: managerId || null,
      designationId: designationId || null,
    };

    try {
      const newNode = await orgStructureService.createNode(nodeData);
      setNodes([...nodes, newNode]);
      // Reset form
      setCompanyId('');
      setName('');
      setParentId('');
      setManagerId('');
      setDesignationId('');
    } catch (error) {
      console.error('Error creating node:', error);
    }
  };

  // Delete node
  const handleDelete = async (nodeId) => {
    if (!['Admin', 'HR'].includes(userRole)) return;
    try {
      await orgStructureService.deleteNode(nodeId);
      setNodes(nodes.filter((node) => node.id !== nodeId));
    } catch (error) {
      console.error('Error deleting node:', error);
    }
  };

  if (!['Admin', 'HR'].includes(userRole)) {
    return <div>Unauthorized Access</div>;
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Organizational Structure Management</h2>

      {/* Node Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium">Company ID</label>
          <input
            type="text"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Node Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Parent Node ID (optional)</label>
          <input
            type="text"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Manager ID (optional)</label>
          <input
            type="text"
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Designation ID (optional)</label>
          <input
            type="text"
            value={designationId}
            onChange={(e) => setDesignationId(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Node
        </button>
      </form>

      {/* Node List */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Organizational Nodes</h3>
        {nodes.length === 0 ? (
          <p>No nodes found.</p>
        ) : (
          <ul className="space-y-2">
            {nodes.map((node) => (
              <li
                key={node.id}
                className="p-2 border rounded flex justify-between items-center"
              >
                <div>
                  <p><strong>Name:</strong> {node.name}</p>
                  <p><strong>Company ID:</strong> {node.companyId}</p>
                  <p><strong>Parent ID:</strong> {node.parentId || 'None'}</p>
                  <p><strong>Manager ID:</strong> {node.managerId || 'None'}</p>
                  <p><strong>Designation ID:</strong> {node.designationId || 'None'}</p>
                </div>
                <button
                  onClick={() => handleDelete(node.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default OrgStructureManagement;