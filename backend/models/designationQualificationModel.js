import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const DesignationQualification = sequelize.define('Designation_Qualification', {
  DesignationQualificationId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  CompanyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Companies', key: 'CompanyId' },
  },
  DesignationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Designations', key: 'DesignationId' },
  },
  QualificationName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  ServiceYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  RelatedServiceYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  AllowRelatedQualification: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'DesignationQualifications',
  timestamps: false,
});

export default DesignationQualification;