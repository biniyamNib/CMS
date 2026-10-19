import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Shareholder = sequelize.define('shareholder', {
  ShareholderId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  ShareholderName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'Shareholders',
  timestamps: false,
});

export default Shareholder;