import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UserCompany = sequelize.define('UserCompany', {
  UserId: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'userId',
    },
    primaryKey: true,
  },
  CompanyId: {
    type: DataTypes.UUID,
    references: {
      model: 'Companies',
      key: 'CompanyId',
    },
    primaryKey: true,
  },
}, {
  timestamps: false,
  tableName: 'UserCompanies',
});

export default UserCompany;