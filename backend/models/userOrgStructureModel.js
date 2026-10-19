import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UserOrgStructure = sequelize.define('UserOrgStructure', {
  UserOrgStructureId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  UserId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Users', key: 'userId' },
  },
  OrgStructureId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'OrgStructures', key: 'OrgStructureId' },
  },
  RoleId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Role', key: 'RoleId' },
  },
  Status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    allowNull: false,
    defaultValue: 'Active',
  },
  AssignedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'UserOrgStructures',
  timestamps: false,
});

export default UserOrgStructure;