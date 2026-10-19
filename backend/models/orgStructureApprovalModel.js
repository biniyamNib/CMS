import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const OrgStructureApproval = sequelize.define('OrgStructureApproval', {
  ApprovalId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  OrgStructureId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'OrgStructures', key: 'OrgStructureId' },
  },
  RequestedByUserId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Users', key: 'userId' },
  },
  ApproverUserId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Users', key: 'userId' },
  },
  Action: {
    type: DataTypes.ENUM('Create', 'Update', 'Delete'),
    allowNull: false,
  },
  Status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
    allowNull: false,
    defaultValue: 'Pending',
  },
  RequestDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  ResponseDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'OrgStructureApprovals',
  timestamps: false,
});

export default OrgStructureApproval;