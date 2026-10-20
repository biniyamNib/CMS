const nodes = [
{
    id: '1',
    companyId: 'COMP001',
    name: 'Engineering Department',
    parentId: null,
    managerId: 'EMP001',
    designationId: 'DES001',
},
{
    id: '2',
    companyId: 'COMP001',
    name: 'Frontend Team',
    parentId: '1',
    managerId: 'EMP002',
    designationId: 'DES002',
},
];

const getNodes = async () => nodes;

const getNodesByCompany = async (companyId) => 
nodes.filter((node) => node.companyId === companyId);

const createNode = async (nodeData) => {
const newNode = { id: String(nodes.length + 1), ...nodeData };
nodes.push(newNode);
return newNode;
};

const deleteNode = async (nodeId) => {
const index = nodes.findIndex((node) => node.id === nodeId);
if (index !== -1) nodes.splice(index, 1);
};

export default { getNodes, getNodesByCompany, createNode, deleteNode };