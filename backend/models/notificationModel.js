import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Notification = sequelize.define('Notification', {
  NotificationId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  CompanyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Companies', key: 'CompanyId' },
  },
  UserId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Users', key: 'userId' }, 
  },
  Message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  EntityType: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  EntityId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  Action: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  Timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  ReadStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'Notifications',
  timestamps: false,
});

export default Notification;