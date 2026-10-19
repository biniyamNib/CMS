import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const OrgStructure = sequelize.define('OrgStructure', {
  OrgStructureId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  CompanyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Companies', key: 'CompanyId' },
  },
  ReportingToId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'OrgStructures', key: 'OrgStructureId' },
  },
  StructureName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  StructureType: {
    type: DataTypes.ENUM('Permanent', 'Temporary'),
    allowNull: false,
    defaultValue: 'Permanent',
  },
  ReportingType: {
    type: DataTypes.ENUM('Direct', 'Dotted', 'Matrix'),
    allowNull: false,
    defaultValue: 'Direct',
  },
  Category: {
    type: DataTypes.ENUM('Operational', 'Support', 'Project', 'Other'),
    allowNull: false,
    defaultValue: 'Operational',
  },
  isLeaf: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  Status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    allowNull: false,
    defaultValue: 'Active', // It chnaged from pending to active
  },
  CreatedByUserId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Users', key: 'userId' },
  },
  CreatedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  UpdatedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  ExpiryDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'OrgStructures',
  timestamps: false,
});

export default OrgStructure;