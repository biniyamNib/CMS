import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AuditLog = sequelize.define('AuditLog', {
  AuditLogId: {
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
  },
  EntityId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  EntityType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Company',
  },
  Action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'audit_log',
  timestamps: false,
});

export default AuditLog;