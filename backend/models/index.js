import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './userModel.js';
import Role from './roleModel.js';
import UserRoleMapping from './userRoleMappingModel.js';
import AuditLog from './auditLogModel.js';
import Company from './companyModel.js';
import UserCompany from './userCompanyModel.js';
import OrgStructure from './orgStructureModel.js';
import UserOrgStructure from './userOrgStructureModel.js';
import Shareholder from './shareholderModel.js';
import CompanyShareholderMapping from './companyShareholderMappingModel.js';
import License from './licenseModel.js';
import Designation from './designationModel.js';
import DesignationQualification from './designationQualificationModel.js';
import Notification from './notificationModel.js';
import Invitation from './invitationModel.js';

export async function syncDatabase(alter = false) {
  try {
    console.log('Starting database synchronization...');

    await sequelize.query('SET CONSTRAINTS ALL DEFERRED');
    console.log('Constraints deferred');

    const syncOptions = { alter };

    await Role.sync(syncOptions);
    console.log('Role synced');

    await User.sync(syncOptions);
    console.log('Users synced');

    await Company.sync(syncOptions);
    console.log('Companies synced');

    await UserCompany.sync(syncOptions);
    console.log('UserCompany synced');

    await UserRoleMapping.sync(syncOptions);
    console.log('UserRoleMapping synced');

    await AuditLog.sync(syncOptions);
    console.log('AuditLog synced');

    await OrgStructure.sync(syncOptions);
    console.log('OrgStructure synced');

    await UserOrgStructure.sync(syncOptions);
    console.log('UserOrgStructure synced');

    await Shareholder.sync(syncOptions);
    console.log('Shareholder synced');

    await CompanyShareholderMapping.sync(syncOptions);
    console.log('CompanyShareholderMapping synced');

    await License.sync(syncOptions);
    console.log('License synced');

    await Designation.sync(syncOptions);
    console.log('Designation synced');

    await DesignationQualification.sync(syncOptions);
    console.log('DesignationQualification synced');

    await Notification.sync(syncOptions);
    console.log('Notification synced');

    await Invitation.sync(syncOptions);
    console.log('Invitation synced');

    // Associations
    User.belongsTo(Role, { foreignKey: 'RoleId', as: 'PrimaryRole' });
    User.hasMany(UserRoleMapping, { foreignKey: 'UserId' });
    UserRoleMapping.belongsTo(User, { foreignKey: 'UserId' });
    UserRoleMapping.belongsTo(Role, { foreignKey: 'RoleId' });
    User.belongsToMany(Role, { through: UserRoleMapping, foreignKey: 'UserId', as: 'Roles' });
    Role.belongsToMany(User, { through: UserRoleMapping, foreignKey: 'RoleId', as: 'Users' });
    Role.hasMany(UserRoleMapping, { foreignKey: 'RoleId' });
    User.hasMany(AuditLog, { foreignKey: 'UserId', as: 'Actor' });
    UserCompany.belongsTo(User, { foreignKey: 'UserId' });
    UserCompany.belongsTo(Company, { foreignKey: 'CompanyId' });
    User.hasMany(UserCompany, { foreignKey: 'UserId' });
    Company.hasMany(UserCompany, { foreignKey: 'CompanyId' });
    User.belongsToMany(Company, { through: UserCompany, foreignKey: 'UserId', as: 'Companies' });
    Company.belongsToMany(User, { through: UserCompany, foreignKey: 'CompanyId', as: 'Users' });
    Company.belongsTo(Company, { foreignKey: 'ParentCompanyId', as: 'ParentCompany' });
    Company.hasMany(Company, { foreignKey: 'ParentCompanyId', as: 'SubCompanies' });
    CompanyShareholderMapping.belongsTo(Company, { foreignKey: 'CompanyId' });
    CompanyShareholderMapping.belongsTo(Shareholder, { foreignKey: 'ShareholderId' });
    Company.hasMany(CompanyShareholderMapping, { foreignKey: 'CompanyId' });
    Shareholder.hasMany(CompanyShareholderMapping, { foreignKey: 'ShareholderId', as: 'CompanyMappings' });
    Company.belongsToMany(Shareholder, { through: CompanyShareholderMapping, foreignKey: 'CompanyId', as: 'Shareholders' });
    Shareholder.belongsToMany(Company, { through: CompanyShareholderMapping, foreignKey: 'ShareholderId', as: 'Companies' });
    License.belongsTo(Company, { foreignKey: 'CompanyId', as: 'Company' });
    License.belongsTo(User, { foreignKey: 'CreatedByUserId', as: 'Creator' });
    License.belongsTo(User, { foreignKey: 'UpdatedByUserId', as: 'Updater' });
    License.hasMany(AuditLog, { foreignKey: 'EntityId', constraints: false, scope: { EntityType: 'License' }, as: 'AuditLogs' });
    Designation.belongsTo(Company, { foreignKey: 'CompanyId' });
    Designation.belongsTo(OrgStructure, { foreignKey: 'OrgStructureId', as: 'Structure' });
    Company.hasMany(Designation, { foreignKey: 'CompanyId' });
    OrgStructure.hasMany(Designation, { foreignKey: 'OrgStructureId' });
    OrgStructure.belongsTo(OrgStructure, { foreignKey: 'ReportingToId', as: 'ParentOrgStructure' });
    OrgStructure.hasMany(OrgStructure, { foreignKey: 'ReportingToId', as: 'SubOrgStructures' });
    OrgStructure.belongsTo(User, { foreignKey: 'CreatedByUserId', as: 'Creator' });
    OrgStructure.hasMany(UserOrgStructure, { foreignKey: 'OrgStructureId', as: 'UserOrgStructures' });
    UserOrgStructure.belongsTo(OrgStructure, { foreignKey: 'OrgStructureId', as: 'OrgStructure' });
    UserOrgStructure.belongsTo(User, { foreignKey: 'UserId', as: 'User' });
    UserOrgStructure.belongsTo(Role, { foreignKey: 'RoleId', as: 'Role' });
    // Add associations for OrgStructure to Company
    OrgStructure.belongsTo(Company, { foreignKey: 'CompanyId', as: 'Company' });
    Company.hasMany(OrgStructure, { foreignKey: 'CompanyId', as: 'OrgStructures' });
    DesignationQualification.belongsTo(Company, { foreignKey: 'CompanyId' });
    DesignationQualification.belongsTo(Designation, { foreignKey: 'DesignationId', as: 'Designation' });
    Company.hasMany(DesignationQualification, { foreignKey: 'CompanyId' });
    Designation.hasMany(DesignationQualification, { foreignKey: 'DesignationId', as: 'Qualifications' });
    Notification.belongsTo(Company, { foreignKey: 'CompanyId' });
    Notification.belongsTo(User, { foreignKey: 'UserId', as: 'User' });
    Company.hasMany(Notification, { foreignKey: 'CompanyId' });
    User.hasMany(Notification, { foreignKey: 'UserId' });
    Invitation.belongsTo(Company, { foreignKey: 'companyId' });
    Invitation.belongsTo(Role, { foreignKey: 'roleId' });
    Invitation.belongsTo(Shareholder, { foreignKey: 'shareholderId' });
    Invitation.belongsTo(User, { foreignKey: 'created_by', as: 'Creator' });
    Role.belongsTo(User, { foreignKey: 'CreatedByUserId', as: 'Creator' });
    AuditLog.belongsTo(User, { foreignKey: 'UserId', as: 'Actor' });

    await sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
    console.log('Constraints restored');

    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', {
      message: error.message,
      stack: error.stack,
      errors: error.errors || [],
    });
    throw error;
  }
}

export {
  User,
  Role,
  UserRoleMapping,
  AuditLog,
  Company,
  UserCompany,
  OrgStructure,
  UserOrgStructure,
  Shareholder,
  CompanyShareholderMapping,
  License,
  Invitation,
  Designation,
  DesignationQualification,
  Notification,
};