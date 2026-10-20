import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CompanyShareholderMapping = sequelize.define('company_shareholder_mapping', {
  ShareholderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Shareholders', key: 'ShareholderId' },
  },
  CompanyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Companies', key: 'CompanyId' },
  },
  ShareholderName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'ShareholderName cannot be empty' },
    },
  },
  ShareQt: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: 1, msg: 'ShareQt must be at least 1' },
      isInt: { msg: 'ShareQt must be an integer' },
    },
  },
  ShareValue: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: { args: 0.01, msg: 'ShareValue must be at least 0.01' },
    },
  },
}, {
  tableName: 'CompanyShareholders',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['ShareholderId', 'CompanyId'],
      name: 'company_shareholder_mapping_pk',
    },
  ],
});

export default CompanyShareholderMapping;