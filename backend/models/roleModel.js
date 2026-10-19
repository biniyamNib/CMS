import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Role = sequelize.define('Role', {
  RoleId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  RoleName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  CreatedByUserId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  CreatedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  UpdatedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  Status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    defaultValue: 'Active',
  },
}, {
  tableName: 'Role',
  timestamps: false,
});

export default Role;