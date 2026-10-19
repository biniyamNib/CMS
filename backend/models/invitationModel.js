import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Invitation = sequelize.define('Invitation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Companies', key: 'CompanyId' },
  },
  roleId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Role', key: 'RoleId' },
  },
  shareholderId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'Shareholders', key: 'ShareholderId' },
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Accepted'),
    defaultValue: 'Pending',
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Users', key: 'userId' },
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Invitations',
  timestamps: false,
});

export default Invitation;