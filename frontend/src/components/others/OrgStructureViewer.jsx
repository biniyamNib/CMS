import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import orgStructureService from '../../services/orgStructureService';

function OrgStructureViewer() {
  const { companyId } = useParams();
  const userRole = 'Admin'; // Mock; replace with auth context
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    if (['Admin', 'HR'].includes(userRole)) {
      orgStructureService.getNodesByCompany(companyId)
        .then(setNodes)
        .catch(console.error);
    }
  }, [companyId, userRole]);

  // Build tree structure
  const buildTree = (nodes, parentId = null) => {
    return nodes
      .filter((node) => node.parentId === parentId)
      .map((node) => ({
        ...node,
        children: buildTree(nodes, node.id),
      }));
  };

  const tree = buildTree(nodes);

  const renderTree = (nodes, level = 0) => (
    <ul className={level > 0 ? 'ml-6' : ''}>
      {nodes.map((node) => (
        <li key={node.id} className="my-2">
          <div className="p-2 bg-white rounded shadow">
            <p><strong>{node.name}</strong></p>
            <p>Manager ID: {node.managerId || 'None'}</p>
            <p>Designation ID: {node.designationId || 'None'}</p>
          </div>
          {node.children.length > 0 && renderTree(node.children, level + 1)}
        </li>
      ))}
    </ul>
  );

  if (!['Admin', 'HR'].includes(userRole)) {
    return <div>Unauthorized Access</div>;
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Organizational Structure Viewer</h2>
      {nodes.length === 0 ? (
        <p>No organizational structure found for this company.</p>
      ) : (
        renderTree(tree)
      )}
    </div>
  );
}

export default OrgStructureViewer;