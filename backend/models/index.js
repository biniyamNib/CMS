// import { Sequelize, DataTypes } from 'sequelize';
// import sequelize from '../config/database.js';
// import User from './userModel.js';
// import Role from './roleModel.js';
// import UserRoleMapping from './userRoleMappingModel.js';
// import AuditLog from './auditLogModel.js';
// import Company from './companyModel.js';
// import UserCompany from './userCompanyModel.js';
// import OrgStructure from './orgStructureModel.js';
// import UserOrgStructure from './userOrgStructureModel.js';
// import Shareholder from './shareholderModel.js';
// import CompanyShareholderMapping from './companyShareholderMappingModel.js';
// import License from './licenseModel.js';
// import Designation from './designationModel.js';
// import DesignationQualification from './designationQualificationModel.js';
// import Notification from './notificationModel.js'

// export async function syncDatabase(alter = false) {
//   try {
//     console.log('Starting database synchronization...');

//     await sequelize.query('SET CONSTRAINTS ALL DEFERRED');
//     console.log('Constraints deferred');

//     const syncOptions = { alter };

//     try {
//       await Role.sync(syncOptions);
//       console.log('Role synced');
//     } catch (e) {
//       console.error('Failed to sync Role:', { message: e.message, stack: e.stack });
//       throw e;
//     }

//     try {
//       await User.sync(syncOptions);
//       console.log('Users synced');
//     } catch (e) {
//       console.error('Failed to sync User:', { message: e.message, stack: e.stack });
//       throw e;
//     }

//     try {
//       await Company.sync(syncOptions);
//       console.log('Companies synced');
//     } catch (e) {
//       console.error('Failed to sync Company:', { message: e.message, stack: e.stack });
//       throw e;
//     }

//     try {
//       await UserCompany.sync(syncOptions);
//       console.log('UserCompany synced');
//     } catch (e) {
//       console.error('Failed to sync UserCompany:', { message: e.message, stack: e.stack });
//       throw e;
//     }

//     try {
//       await UserRoleMapping.sync(syncOptions);
//       console.log('UserRoleMapping synced');
//     } catch (e) {
//       console.error('Failed to sync UserRoleMapping:', { message: e.message, stack: e.stack });
//       throw e;
//     }

//     try {
//       await AuditLog.sync(syncOptions);
//       console.log('AuditLog synced');
//     } catch (e) {
//       console.error('Failed to sync AuditLog:', { message: e.message, stack: e.stack });
//       throw e;
//     }

//     try {
//       await OrgStructure.sync(syncOptions);
//       console.log('OrgStructure synced');
//     } catch (e) {
//       console.error('Failed to sync OrgStructure:', { message: e.message, stack: e.stack });
//       throw e;
//     }

//     try {
//       await UserOrgStructure.sync(syncOptions);
//       console.log('UserOrgStructure synced');
//     } catch (e) {
//       console.error('Failed to sync UserOrgStructure:', { message: e.message, stack: e.stack });
//       throw e;
//     }

//     try {
//       await Shareholder.sync(syncOptions);
//       console.log('Shareholder synced');
//     } catch (e) {
//       console.error('Failed to sync Shareholder:', { message: e.message, stack: e.stack });
//       throw e;
//     }

//     try {
//       await CompanyShareholderMapping.sync(syncOptions);
//       console.log('CompanyShareholderMapping synced');
//     } catch (e) {
//       console.error('Failed to sync CompanyShareholderMapping:', { message: e.message, stack: e.stack });
//       throw e;
//     }

//     try {
//       await License.sync(syncOptions);
//       console.log('License synced');
//     } catch (e) {
//       console.error('Failed to sync License:', { message: e.message, stack: e.stack });
//       throw e;
//     }

//     try {
//       await Designation.sync(syncOptions);
//       console.log('Designation synced');
//     } catch (e) {
//       console.error('Failed to sync Designation:', { message: e.message, stack: e.stack });
//       throw e;
//     }

//     try {
//       await DesignationQualification.sync(syncOptions);
//       console.log('DesignationQualification synced');
//     } catch (e) {
//       console.error('Failed to sync DesignationQualification:', { message: e.message, stack: e.stack });
//       throw e;
//     }

//     try {
//       await Notification.sync(syncOptions);
//       console.log('Notification synced');
//     } catch (e) {
//       console.error('Failed to sync Notification:', { message: e.message, stack: e.stack });
//       throw e;
//     }

//     await sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
//     console.log('Constraints restored');

//     // Define associations
//     User.belongsTo(Role, { foreignKey: 'RoleId', as: 'PrimaryRole' });
//     User.belongsTo(User, { foreignKey: 'WhoUpdateUserId', as: 'Updater' });
//     User.hasMany(User, { foreignKey: 'WhoUpdateUserId', as: 'UpdatedUsers' });
//     Role.belongsTo(User, { foreignKey: 'CreatedByUserId', as: 'Creator' });
//     User.belongsToMany(Role, { through: UserRoleMapping, foreignKey: 'UserId', as: 'Roles' });
//     Role.belongsToMany(User, { through: UserRoleMapping, foreignKey: 'RoleId', as: 'RoleUsers' });

//     Company.hasMany(Company, { as: 'SubCompanies', foreignKey: 'ParentCompanyId' });
//     Company.belongsTo(Company, { as: 'ParentCompany', foreignKey: 'ParentCompanyId' });
//     Company.belongsToMany(User, { through: UserCompany, foreignKey: 'CompanyId', as: 'Users' });
//     Company.hasMany(AuditLog, { foreignKey: 'EntityId', constraints: false, scope: { EntityType: 'Company' }, as: 'AuditLogs' });
//     Company.hasMany(UserCompany, { foreignKey: 'CompanyId', as: 'UserCompanies' });
//     Company.hasMany(OrgStructure, { foreignKey: 'CompanyId', as: 'OrgStructures' });
//     Company.hasMany(License, { foreignKey: 'CompanyId', as: 'Licenses' });

//     User.belongsToMany(Company, { through: UserCompany, foreignKey: 'UserId', as: 'Companies' });
//     UserCompany.belongsTo(Company, { foreignKey: 'CompanyId', as: 'Company' });
//     UserCompany.belongsTo(User, { foreignKey: 'UserId', as: 'User' });

//     OrgStructure.hasMany(OrgStructure, { as: 'SubOrgStructures', foreignKey: 'ReportingToId' });
//     OrgStructure.belongsTo(OrgStructure, { as: 'ParentOrgStructure', foreignKey: 'ReportingToId' });
//     OrgStructure.hasMany(UserOrgStructure, { foreignKey: 'OrgStructureId', as: 'UserOrgStructures' });
//     OrgStructure.belongsTo(Company, { foreignKey: 'CompanyId', as: 'Company' });
//     OrgStructure.belongsTo(User, { foreignKey: 'CreatedByUserId', as: 'Creator' });

//     UserOrgStructure.belongsTo(OrgStructure, { foreignKey: 'OrgStructureId', as: 'OrgStructure' });
//     UserOrgStructure.belongsTo(User, { foreignKey: 'UserId', as: 'User' });
//     UserOrgStructure.belongsTo(Role, { foreignKey: 'RoleId', as: 'Role' });

//     AuditLog.belongsTo(User, { foreignKey: 'UserId', as: 'Actor' });
//     AuditLog.belongsTo(Company, { foreignKey: 'EntityId', constraints: false, scope: { EntityType: 'Company' }, as: 'Company' });
//     AuditLog.belongsTo(OrgStructure, { foreignKey: 'EntityId', constraints: false, scope: { EntityType: 'OrgStructure' }, as: 'OrgStructure' });
//     AuditLog.belongsTo(License, { foreignKey: 'EntityId', constraints: false, scope: { EntityType: 'License' }, as: 'License' });

//     // Shareholder and CompanyShareholderMapping associations
//     Company.belongsToMany(Shareholder, { through: CompanyShareholderMapping, foreignKey: 'CompanyId', as: 'Shareholders' });
//     Shareholder.belongsToMany(Company, { through: CompanyShareholderMapping, foreignKey: 'ShareholderId', as: 'Companies' });
//     CompanyShareholderMapping.belongsTo(Company, { foreignKey: 'CompanyId', as: 'Company' });
//     CompanyShareholderMapping.belongsTo(Shareholder, { foreignKey: 'ShareholderId', as: 'Shareholder' });
//     Shareholder.hasMany(CompanyShareholderMapping, { foreignKey: 'ShareholderId', as: 'CompanyMappings' });
//     Company.hasMany(CompanyShareholderMapping, { foreignKey: 'CompanyId', as: 'ShareholderMappings' });
//     CompanyShareholderMapping.hasMany(AuditLog, { foreignKey: 'EntityId', constraints: false, scope: { EntityType: 'Shareholder' }, as: 'AuditLogs' });

//     // License associations
//     License.belongsTo(Company, { foreignKey: 'CompanyId', as: 'Company' });
//     License.belongsTo(User, { foreignKey: 'CreatedByUserId', as: 'Creator' });
//     License.belongsTo(User, { foreignKey: 'UpdatedByUserId', as: 'Updater' });
//     License.hasMany(AuditLog, { foreignKey: 'EntityId', constraints: false, scope: { EntityType: 'License' }, as: 'AuditLogs' });

//     // Designation associations
//     Designation.belongsTo(Company, { foreignKey: 'CompanyId' });
//     Designation.belongsTo(OrgStructure, { foreignKey: 'OrgStructureId', as: 'Structure' });
//     Company.hasMany(Designation, { foreignKey: 'CompanyId' });
//     OrgStructure.hasMany(Designation, { foreignKey: 'OrgStructureId' });

//     // DesignationQualification associations
//     DesignationQualification.belongsTo(Company, { foreignKey: 'CompanyId' });
//     DesignationQualification.belongsTo(Designation, { 
//       foreignKey: 'DesignationId', 
//       as: 'Designation' 
//     });
//     Company.hasMany(DesignationQualification, { foreignKey: 'CompanyId' });
//     Designation.hasMany(DesignationQualification, { foreignKey: 'DesignationId', as: 'Qualifications'});

//     // Notification assosiations
//     Notification.belongsTo(Company, { foreignKey: 'CompanyId' });
//     Notification.belongsTo(User, { foreignKey: 'UserId', as: 'User' });
//     Company.hasMany(Notification, { foreignKey: 'CompanyId' });
//     User.hasMany(Notification, { foreignKey: 'UserId' });

//     // Add association between UserCompany and Company
//     UserCompany.belongsTo(Company, { foreignKey: 'CompanyId' });
//     Company.hasMany(UserCompany, { foreignKey: 'CompanyId' });
    
//     console.log('Database synced successfully');
//   } catch (error) {
//     console.error('Error syncing database:', {
//       message: error.message,
//       stack: error.stack,
//       errors: error.errors || [],
//     });
//     throw error;
//   }
// }

// export {
//   User,
//   Role,
//   UserRoleMapping,
//   AuditLog,
//   Company,
//   UserCompany,
//   OrgStructure,
//   UserOrgStructure,
//   Shareholder,
//   CompanyShareholderMapping,
//   License,
// };







// Updated

// import { Sequelize, DataTypes } from 'sequelize';
// import sequelize from '../config/database.js';
// import User from './userModel.js';
// import Role from './roleModel.js';
// import UserRoleMapping from './userRoleMappingModel.js';
// import AuditLog from './auditLogModel.js';
// import Company from './companyModel.js';
// import UserCompany from './userCompanyModel.js';
// import OrgStructure from './orgStructureModel.js';
// import UserOrgStructure from './userOrgStructureModel.js';
// import Shareholder from './shareholderModel.js';
// import CompanyShareholderMapping from './companyShareholderMappingModel.js';
// import License from './licenseModel.js';
// import Designation from './designationModel.js';
// import DesignationQualification from './designationQualificationModel.js';
// import Notification from './notificationModel.js';

// const Invitation = sequelize.define('Invitation', {
//   id: {
//     type: DataTypes.UUID,
//     defaultValue: DataTypes.UUIDV4,
//     primaryKey: true,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   companyId: {
//     type: DataTypes.UUID,
//     allowNull: false,
//     references: { model: 'Companies', key: 'CompanyId' },
//   },
//   roleId: {
//     type: DataTypes.UUID,
//     allowNull: false,
//     references: { model: 'Role', key: 'RoleId' },
//   },
//   shareholderId: {
//     type: DataTypes.UUID,
//     allowNull: true,
//     references: { model: 'Shareholders', key: 'ShareholderId' },
//   },
//   token: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   status: {
//     type: DataTypes.ENUM('Pending', 'Accepted'),
//     defaultValue: 'Pending',
//   },
//   created_by: {
//     type: DataTypes.UUID,
//     allowNull: false,
//     references: { model: 'Users', key: 'userId' },
//   },
//   created_at: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   },
// }, {
//   tableName: 'Invitations',
//   timestamps: false,
// });

// export async function syncDatabase(alter = false) {
//   try {
//     console.log('Starting database synchronization...');

//     await sequelize.query('SET CONSTRAINTS ALL DEFERRED');
//     console.log('Constraints deferred');

//     const syncOptions = { alter };

//     await Role.sync(syncOptions);
//     console.log('Role synced');

//     await User.sync(syncOptions);
//     console.log('Users synced');

//     await Company.sync(syncOptions);
//     console.log('Companies synced');

//     await UserCompany.sync(syncOptions);
//     console.log('UserCompany synced');

//     await UserRoleMapping.sync(syncOptions);
//     console.log('UserRoleMapping synced');

//     await AuditLog.sync(syncOptions);
//     console.log('AuditLog synced');

//     await OrgStructure.sync(syncOptions);
//     console.log('OrgStructure synced');

//     await UserOrgStructure.sync(syncOptions);
//     console.log('UserOrgStructure synced');

//     await Shareholder.sync(syncOptions);
//     console.log('Shareholder synced');

//     await CompanyShareholderMapping.sync(syncOptions);
//     console.log('CompanyShareholderMapping synced');

//     await License.sync(syncOptions);
//     console.log('License synced');

//     await Designation.sync(syncOptions);
//     console.log('Designation synced');

//     await DesignationQualification.sync(syncOptions);
//     console.log('DesignationQualification synced');

//     await Notification.sync(syncOptions);
//     console.log('Notification synced');

//     await Invitation.sync(syncOptions);
//     console.log('Invitation synced');

//     // Associations
//     User.belongsTo(Role, { foreignKey: 'RoleId', as: 'PrimaryRole' });
//     User.hasMany(UserRoleMapping, { foreignKey: 'UserId' });
//     UserRoleMapping.belongsTo(User, { foreignKey: 'UserId' });
//     UserRoleMapping.belongsTo(Role, { foreignKey: 'RoleId' });
//     // Fixed: Use belongsToMany for N:M
//     User.belongsToMany(Role, { through: UserRoleMapping, foreignKey: 'UserId', as: 'Roles' });
//     Role.belongsToMany(User, { through: UserRoleMapping, foreignKey: 'RoleId', as: 'Users' });
//     Role.hasMany(UserRoleMapping, { foreignKey: 'RoleId' });
//     User.hasMany(AuditLog, { foreignKey: 'UserId', as: 'Actor' });
//     UserCompany.belongsTo(User, { foreignKey: 'UserId' });
//     UserCompany.belongsTo(Company, { foreignKey: 'CompanyId' });
//     User.hasMany(UserCompany, { foreignKey: 'UserId' });
//     Company.hasMany(UserCompany, { foreignKey: 'CompanyId' });
//     // Added for completeness: belongsToMany for User <-> Company
//     User.belongsToMany(Company, { through: UserCompany, foreignKey: 'UserId', as: 'Companies' });
//     Company.belongsToMany(User, { through: UserCompany, foreignKey: 'CompanyId', as: 'Users' });
//     Company.belongsTo(Company, { foreignKey: 'ParentCompanyId', as: 'ParentCompany' });
//     Company.hasMany(Company, { foreignKey: 'ParentCompanyId', as: 'SubCompanies' });
//     CompanyShareholderMapping.belongsTo(Company, { foreignKey: 'CompanyId' });
//     CompanyShareholderMapping.belongsTo(Shareholder, { foreignKey: 'ShareholderId' });
//     Company.hasMany(CompanyShareholderMapping, { foreignKey: 'CompanyId' });
//     // Shareholder.hasMany(CompanyShareholderMapping, { foreignKey: 'ShareholderId' });
//     Shareholder.hasMany(CompanyShareholderMapping, { foreignKey: 'ShareholderId', as: 'CompanyMappings' });
//     // Added for completeness: belongsToMany for Company <-> Shareholder
//     Company.belongsToMany(Shareholder, { through: CompanyShareholderMapping, foreignKey: 'CompanyId', as: 'Shareholders' });
//     Shareholder.belongsToMany(Company, { through: CompanyShareholderMapping, foreignKey: 'ShareholderId', as: 'Companies' });
//     License.belongsTo(Company, { foreignKey: 'CompanyId', as: 'Company' });
//     License.belongsTo(User, { foreignKey: 'CreatedByUserId', as: 'Creator' });
//     License.belongsTo(User, { foreignKey: 'UpdatedByUserId', as: 'Updater' });
//     License.hasMany(AuditLog, { foreignKey: 'EntityId', constraints: false, scope: { EntityType: 'License' }, as: 'AuditLogs' });
//     Designation.belongsTo(Company, { foreignKey: 'CompanyId' });
//     Designation.belongsTo(OrgStructure, { foreignKey: 'OrgStructureId', as: 'Structure' });
//     Company.hasMany(Designation, { foreignKey: 'CompanyId' });
//     OrgStructure.hasMany(Designation, { foreignKey: 'OrgStructureId' });
//     DesignationQualification.belongsTo(Company, { foreignKey: 'CompanyId' });
//     DesignationQualification.belongsTo(Designation, { foreignKey: 'DesignationId', as: 'Designation' });
//     Company.hasMany(DesignationQualification, { foreignKey: 'CompanyId' });
//     Designation.hasMany(DesignationQualification, { foreignKey: 'DesignationId', as: 'Qualifications' });
//     Notification.belongsTo(Company, { foreignKey: 'CompanyId' });
//     Notification.belongsTo(User, { foreignKey: 'UserId', as: 'User' });
//     Company.hasMany(Notification, { foreignKey: 'CompanyId' });
//     User.hasMany(Notification, { foreignKey: 'UserId' });
//     Invitation.belongsTo(Company, { foreignKey: 'companyId' });
//     Invitation.belongsTo(Role, { foreignKey: 'roleId' });
//     Invitation.belongsTo(Shareholder, { foreignKey: 'shareholderId' });
//     Invitation.belongsTo(User, { foreignKey: 'created_by', as: 'Creator' });

//     // Newly Added
//     Role.belongsTo(User, { foreignKey: 'CreatedByUserId', as: 'Creator' }); // Added for getRoles include
//     // Add this line - the reverse association from AuditLog to User
//     AuditLog.belongsTo(User, { foreignKey: 'UserId', as: 'Actor' });

//     console.log('Database synced successfully');
//   } catch (error) {
//     console.error('Error syncing database:', {
//       message: error.message,
//       stack: error.stack,
//       errors: error.errors || [],
//     });
//     throw error;
//   }
// }

// export {
//   User,
//   Role,
//   UserRoleMapping,
//   AuditLog,
//   Company,
//   UserCompany,
//   OrgStructure,
//   UserOrgStructure,
//   Shareholder,
//   CompanyShareholderMapping,
//   License,
//   Invitation,
// };


// Latest

// import { Sequelize, DataTypes } from 'sequelize';
// import sequelize from '../config/database.js';
// import User from './userModel.js';
// import Role from './roleModel.js';
// import UserRoleMapping from './userRoleMappingModel.js';
// import AuditLog from './auditLogModel.js';
// import Company from './companyModel.js';
// import UserCompany from './userCompanyModel.js';
// import OrgStructure from './orgStructureModel.js';
// import UserOrgStructure from './userOrgStructureModel.js';
// import Shareholder from './shareholderModel.js';
// import CompanyShareholderMapping from './companyShareholderMappingModel.js';
// import License from './licenseModel.js';
// import Designation from './designationModel.js';
// import DesignationQualification from './designationQualificationModel.js';
// import Notification from './notificationModel.js';
// import Invitation from './invitationModel.js';

// export async function syncDatabase(alter = false) {
//   try {
//     console.log('Starting database synchronization...');

//     await sequelize.query('SET CONSTRAINTS ALL DEFERRED');
//     console.log('Constraints deferred');

//     const syncOptions = { alter };

//     await Role.sync(syncOptions);
//     console.log('Role synced');

//     await User.sync(syncOptions);
//     console.log('Users synced');

//     await Company.sync(syncOptions);
//     console.log('Companies synced');

//     await UserCompany.sync(syncOptions);
//     console.log('UserCompany synced');

//     await UserRoleMapping.sync(syncOptions);
//     console.log('UserRoleMapping synced');

//     await AuditLog.sync(syncOptions);
//     console.log('AuditLog synced');

//     await OrgStructure.sync(syncOptions);
//     console.log('OrgStructure synced');

//     await UserOrgStructure.sync(syncOptions);
//     console.log('UserOrgStructure synced');

//     await Shareholder.sync(syncOptions);
//     console.log('Shareholder synced');

//     await CompanyShareholderMapping.sync(syncOptions);
//     console.log('CompanyShareholderMapping synced');

//     await License.sync(syncOptions);
//     console.log('License synced');

//     await Designation.sync(syncOptions);
//     console.log('Designation synced');

//     await DesignationQualification.sync(syncOptions);
//     console.log('DesignationQualification synced');

//     await Notification.sync(syncOptions);
//     console.log('Notification synced');

//     await Invitation.sync(syncOptions);
//     console.log('Invitation synced');

//     // Associations
//     User.belongsTo(Role, { foreignKey: 'RoleId', as: 'PrimaryRole' });
//     User.hasMany(UserRoleMapping, { foreignKey: 'UserId' });
//     UserRoleMapping.belongsTo(User, { foreignKey: 'UserId' });
//     UserRoleMapping.belongsTo(Role, { foreignKey: 'RoleId' });
//     User.belongsToMany(Role, { through: UserRoleMapping, foreignKey: 'UserId', as: 'Roles' });
//     Role.belongsToMany(User, { through: UserRoleMapping, foreignKey: 'RoleId', as: 'Users' });
//     Role.hasMany(UserRoleMapping, { foreignKey: 'RoleId' });
//     User.hasMany(AuditLog, { foreignKey: 'UserId', as: 'Actor' });
//     UserCompany.belongsTo(User, { foreignKey: 'UserId' });
//     UserCompany.belongsTo(Company, { foreignKey: 'CompanyId' });
//     User.hasMany(UserCompany, { foreignKey: 'UserId' });
//     Company.hasMany(UserCompany, { foreignKey: 'CompanyId' });
//     User.belongsToMany(Company, { through: UserCompany, foreignKey: 'UserId', as: 'Companies' });
//     Company.belongsToMany(User, { through: UserCompany, foreignKey: 'CompanyId', as: 'Users' });
//     Company.belongsTo(Company, { foreignKey: 'ParentCompanyId', as: 'ParentCompany' });
//     Company.hasMany(Company, { foreignKey: 'ParentCompanyId', as: 'SubCompanies' });
//     CompanyShareholderMapping.belongsTo(Company, { foreignKey: 'CompanyId' });
//     CompanyShareholderMapping.belongsTo(Shareholder, { foreignKey: 'ShareholderId' });
//     Company.hasMany(CompanyShareholderMapping, { foreignKey: 'CompanyId' });
//     Shareholder.hasMany(CompanyShareholderMapping, { foreignKey: 'ShareholderId', as: 'CompanyMappings' });
//     Company.belongsToMany(Shareholder, { through: CompanyShareholderMapping, foreignKey: 'CompanyId', as: 'Shareholders' });
//     Shareholder.belongsToMany(Company, { through: CompanyShareholderMapping, foreignKey: 'ShareholderId', as: 'Companies' });
//     License.belongsTo(Company, { foreignKey: 'CompanyId', as: 'Company' });
//     License.belongsTo(User, { foreignKey: 'CreatedByUserId', as: 'Creator' });
//     License.belongsTo(User, { foreignKey: 'UpdatedByUserId', as: 'Updater' });
//     License.hasMany(AuditLog, { foreignKey: 'EntityId', constraints: false, scope: { EntityType: 'License' }, as: 'AuditLogs' });
//     Designation.belongsTo(Company, { foreignKey: 'CompanyId' });
//     Designation.belongsTo(OrgStructure, { foreignKey: 'OrgStructureId', as: 'Structure' });
//     Company.hasMany(Designation, { foreignKey: 'CompanyId' });
//     OrgStructure.hasMany(Designation, { foreignKey: 'OrgStructureId' });
//     OrgStructure.belongsTo(OrgStructure, { foreignKey: 'ReportingToId', as: 'ParentOrgStructure' });
//     OrgStructure.hasMany(OrgStructure, { foreignKey: 'ReportingToId', as: 'SubOrgStructures' });
//     OrgStructure.belongsTo(User, { foreignKey: 'CreatedByUserId', as: 'Creator' });
//     OrgStructure.hasMany(UserOrgStructure, { foreignKey: 'OrgStructureId', as: 'UserOrgStructures' });
//     UserOrgStructure.belongsTo(OrgStructure, { foreignKey: 'OrgStructureId', as: 'OrgStructure' });
//     // Add associations for UserOrgStructure to User and Role
//     UserOrgStructure.belongsTo(User, { foreignKey: 'UserId', as: 'User' });
//     UserOrgStructure.belongsTo(Role, { foreignKey: 'RoleId', as: 'Role' });
//     DesignationQualification.belongsTo(Company, { foreignKey: 'CompanyId' });
//     DesignationQualification.belongsTo(Designation, { foreignKey: 'DesignationId', as: 'Designation' });
//     Company.hasMany(DesignationQualification, { foreignKey: 'CompanyId' });
//     Designation.hasMany(DesignationQualification, { foreignKey: 'DesignationId', as: 'Qualifications' });
//     Notification.belongsTo(Company, { foreignKey: 'CompanyId' });
//     Notification.belongsTo(User, { foreignKey: 'UserId', as: 'User' });
//     Company.hasMany(Notification, { foreignKey: 'CompanyId' });
//     User.hasMany(Notification, { foreignKey: 'UserId' });
//     Invitation.belongsTo(Company, { foreignKey: 'companyId' });
//     Invitation.belongsTo(Role, { foreignKey: 'roleId' });
//     Invitation.belongsTo(Shareholder, { foreignKey: 'shareholderId' });
//     Invitation.belongsTo(User, { foreignKey: 'created_by', as: 'Creator' });
//     Role.belongsTo(User, { foreignKey: 'CreatedByUserId', as: 'Creator' });
//     AuditLog.belongsTo(User, { foreignKey: 'UserId', as: 'Actor' });

//     await sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
//     console.log('Constraints restored');

//     console.log('Database synced successfully');
//   } catch (error) {
//     console.error('Error syncing database:', {
//       message: error.message,
//       stack: error.stack,
//       errors: error.errors || [],
//     });
//     throw error;
//   }
// }

// export {
//   User,
//   Role,
//   UserRoleMapping,
//   AuditLog,
//   Company,
//   UserCompany,
//   OrgStructure,
//   UserOrgStructure,
//   Shareholder,
//   CompanyShareholderMapping,
//   License,
//   Invitation,
//   Designation,
//   DesignationQualification,
//   Notification,
// };





// Very Latest


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