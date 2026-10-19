import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Designation = sequelize.define('Designation', {
  DesignationId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  CompanyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Companies', key: 'CompanyId' },
  },
  OrgStructureId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'OrgStructures', key: 'OrgStructureId' },
  },
  Name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  JobDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  NoOfPosition: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'Designations',
  timestamps: false,
});

export default Designation;