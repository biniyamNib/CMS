import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const License = sequelize.define('License', {
  LicenseId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  CompanyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Companies',
      key: 'CompanyId',
    },
  },
  LicenseNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  Type: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  LicenseDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  ExpireDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  Status: {
    type: DataTypes.ENUM('Active', 'Expired', 'Suspended'),
    allowNull: false,
    defaultValue: 'Active',
  },
  CreatedByUserId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'userId',
    },
  },
  UpdatedByUserId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'userId',
    },
  },
  CreatedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  UpdatedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Licenses',
});

export default License;
