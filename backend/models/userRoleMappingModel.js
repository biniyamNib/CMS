import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UserRoleMapping = sequelize.define('User_Role_Mapping', {
  UserRoleMappingId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  UserId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'userId',
    },
    onDelete: 'CASCADE', // Add this
  },
  RoleId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Role',
      key: 'RoleId',
    },
    onDelete: 'CASCADE', // Add this
  },
  AssignedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  Status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    allowNull: false,
    defaultValue: 'Active',
  },
}, {
  tableName: 'User_Role_Mapping',
  timestamps: false,
});

export default UserRoleMapping;