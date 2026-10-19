// import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
// import { Op } from 'sequelize';
// import sequelize from '../config/database.js';
// import OrgStructure from '../models/orgStructureModel.js';
// import UserOrgStructure from '../models/userOrgStructureModel.js';
// import User from '../models/userModel.js';
// import Role from '../models/roleModel.js';
// import Company from '../models/companyModel.js';
// import AuditLog from '../models/auditLogModel.js';
// import UserCompany from '../models/userCompanyModel.js';
// import OrgStructureApproval from '../models/orgStructureApprovalModel.js';

// export const getOrgStructures = async (req, res, next) => {
//   try {
//     const companyId = req.query.companyId || req.user.companyId; // Fallback to user context
//     const userId = req.user.userId;
//     const isSuperAdmin = req.user.role === 'SuperAdmin';

//     if (!companyId) {
//       res.status(400);
//       throw new Error('CompanyId is required');
//     }
//     if (!uuidValidate(companyId)) {
//       res.status(400);
//       throw new Error('Invalid CompanyId format');
//     }

//     const company = await Company.findByPk(companyId);
//     if (!company) {
//       res.status(404);
//       throw new Error('Company not found');
//     }

//     let where = { CompanyId: companyId, Status: 'Active' };
//     if (!isSuperAdmin) {
//       const userOrgStructures = await UserOrgStructure.findAll({ where: { UserId: userId, Status: 'Active' } });
//       const accessibleOrgStructureIds = userOrgStructures.map(u => u.OrgStructureId);
//       if (accessibleOrgStructureIds.length === 0) {
//         res.status(403);
//         throw new Error('No accessible organizational structures');
//       }
//       where = { ...where, OrgStructureId: { [Op.in]: accessibleOrgStructureIds } };
//     }

//     const orgStructures = await OrgStructure.findAll({
//       where,
//       include: [
//         { model: OrgStructure, as: 'SubOrgStructures', where: { Status: 'Active' }, required: false },
//         { model: OrgStructure, as: 'ParentOrgStructure' },
//         { model: User, as: 'Creator', attributes: ['username'] },
//       ],
//     });

//     res.status(200).json(orgStructures);
//   } catch (error) {
//     console.error('Get org structures error:', {
//       message: error.message,
//       stack: error.stack,
//       companyId: req.query.companyId || req.user.companyId
//     });
//     next(error);
//   }
// };

// export const getOrgStructure = async (req, res, next) => {
//   try {
//     const { orgStructureId } = req.params;
//     const userId = req.user.userId;
//     const isSuperAdmin = req.user.role === 'SuperAdmin';

//     if (!uuidValidate(orgStructureId)) {
//       res.status(400);
//       throw new Error('Invalid OrgStructureId format');
//     }

//     const orgStructure = await OrgStructure.findByPk(orgStructureId, {
//       include: [
//         { model: OrgStructure, as: 'SubOrgStructures', where: { Status: 'Active' }, required: false },
//         { model: OrgStructure, as: 'ParentOrgStructure' },
//         { model: User, as: 'Creator', attributes: ['username'] },
//         {
//           model: UserOrgStructure,
//           as: 'UserOrgStructures',
//           include: [
//             { model: User, as: 'User', attributes: ['username'] },
//             { model: Role, as: 'Role', attributes: ['RoleName'] },
//           ],
//         },
//       ],
//     });

//     if (!orgStructure) {
//       res.status(404);
//       throw new Error('Organizational structure not found');
//     }

//     if (!isSuperAdmin) {
//       const userOrgStructure = await UserOrgStructure.findOne({
//         where: { UserId: userId, OrgStructureId: orgStructureId, Status: 'Active' }
//       });
//       if (!userOrgStructure) {
//         res.status(403);
//         throw new Error('Unauthorized to access this organizational structure');
//       }
//     }

//     res.status(200).json(orgStructure);
//   } catch (error) {
//     console.error('Get org structure error:', { message: error.message, stack: error.stack });
//     next(error);
//   }
// };

// export const createOrgStructure = async (req, res, next) => {
//   const { CompanyId, StructureName, Description, StructureType, ReportingType, Category, ExpiryDate, ReportingToId } = req.body;
//   const currentUserId = req.user.userId;
//   const userRole = req.user.role;

//   try {
//     if (!['SuperAdmin', 'Admin'].includes(userRole)) {
//       res.status(403);
//       throw new Error('Unauthorized to create organizational structure');
//     }

//     if (!CompanyId || !StructureName || !StructureType || !ReportingType || !Category) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     if (!uuidValidate(CompanyId)) {
//       return res.status(400).json({ message: 'Invalid CompanyId format' });
//     }

//     const company = await Company.findByPk(CompanyId);
//     if (!company) {
//       return res.status(404).json({ message: 'Company not found' });
//     }

//     const transaction = await sequelize.transaction();

//     try {
//       const orgStructure = await OrgStructure.create({
//         OrgStructureId: uuidv4(),
//         CompanyId,
//         StructureName,
//         Description: Description || null,
//         StructureType,
//         ReportingType,
//         Category,
//         ExpiryDate: ExpiryDate || null,
//         CreatedByUserId: currentUserId,
//         ReportingToId: ReportingToId || null,
//         Status: 'Active'
//       }, { transaction });

//       await AuditLog.create({
//         AuditLogId: uuidv4(),
//         UserId: currentUserId,
//         EntityType: 'OrgStructure',
//         EntityId: orgStructure.OrgStructureId,
//         Action: 'Create',
//         Changes: {
//           StructureName,
//           Description,
//           StructureType,
//           ReportingType,
//           Category,
//           ExpiryDate,
//           ReportingToId,
//         },
//         Timestamp: new Date(),
//       }, { transaction });

//       await transaction.commit();

//       return res.status(201).json({
//         message: 'Organizational structure created successfully',
//         OrgStructureId: orgStructure.OrgStructureId,
//       });
//     } catch (error) {
//       await transaction.rollback();
//       throw error;
//     }
//   } catch (error) {
//     console.error('Create org structure error:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };

// export const updateOrgStructure = async (req, res, next) => {
//   const { orgStructureId } = req.params;
//   const { StructureName, Description, StructureType, ReportingType, Category, ExpiryDate, ReportingToId } = req.body;
//   const currentUserId = req.user.userId;
//   const userRole = req.user.role;

//   try {
//     if (!['SuperAdmin', 'Admin'].includes(userRole)) {
//       res.status(403);
//       throw new Error('Unauthorized to update organizational structure');
//     }

//     if (!uuidValidate(orgStructureId)) {
//       return res.status(400).json({ message: 'Invalid OrgStructureId format' });
//     }

//     console.log('Update OrgStructure:', { orgStructureId, body: req.body, userId: currentUserId });

//     const orgStructure = await OrgStructure.findByPk(orgStructureId);
//     if (!orgStructure) {
//       console.log('OrgStructure not found:', orgStructureId);
//       return res.status(404).json({ message: 'Organizational structure not found' });
//     }

//     const transaction = await sequelize.transaction();

//     try {
//       const oldValues = {
//         StructureName: orgStructure.StructureName,
//         Description: orgStructure.Description,
//         StructureType: orgStructure.StructureType,
//         ReportingType: orgStructure.ReportingType,
//         Category: orgStructure.Category,
//         ExpiryDate: orgStructure.ExpiryDate,
//         ReportingToId: orgStructure.ReportingToId
//       };

//       await orgStructure.update({
//         StructureName: StructureName || orgStructure.StructureName,
//         Description: Description ?? orgStructure.Description,
//         StructureType: StructureType || orgStructure.StructureType,
//         ReportingType: ReportingType || orgStructure.ReportingType,
//         Category: Category || orgStructure.Category,
//         ExpiryDate: ExpiryDate ?? orgStructure.ExpiryDate,
//         ReportingToId: ReportingToId ?? orgStructure.ReportingToId,
//         Status: 'Active'
//       }, { transaction });

//       await AuditLog.create({
//         AuditLogId: uuidv4(),
//         UserId: currentUserId,
//         EntityType: 'OrgStructure',
//         EntityId: orgStructure.OrgStructureId,
//         Action: 'Update',
//         Changes: {
//           old: oldValues,
//           new: {
//             StructureName: StructureName || orgStructure.StructureName,
//             Description: Description ?? orgStructure.Description,
//             StructureType: StructureType || orgStructure.StructureType,
//             ReportingType: ReportingType || orgStructure.ReportingType,
//             Category: Category || orgStructure.Category,
//             ExpiryDate: ExpiryDate ?? orgStructure.ExpiryDate,
//             ReportingToId: ReportingToId ?? orgStructure.ReportingToId
//           }
//         },
//         Timestamp: new Date(),
//       }, { transaction });

//       await transaction.commit();

//       console.log('Update successful:', orgStructure.OrgStructureId);
//       return res.status(200).json({
//         message: 'Organizational structure updated successfully',
//         OrgStructureId: orgStructure.OrgStructureId,
//       });
//     } catch (error) {
//       await transaction.rollback();
//       console.error('Update transaction error:', error);
//       throw error;
//     }
//   } catch (error) {
//     console.error('Update org structure error:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };

// export const deleteOrgStructure = async (req, res, next) => {
//   let transaction;
//   try {
//     const { orgStructureId } = req.params;
//     const currentUserId = req.user.userId;
//     const userRole = req.user.role;

//     if (!['SuperAdmin', 'Admin'].includes(userRole)) {
//       res.status(403);
//       throw new Error('Unauthorized to delete organizational structure');
//     }

//     if (!uuidValidate(orgStructureId)) {
//       res.status(400);
//       throw new Error('Invalid OrgStructureId format');
//     }

//     transaction = await sequelize.transaction();

//     const orgStructure = await OrgStructure.findByPk(orgStructureId, {
//       include: [{ model: OrgStructure, as: 'SubOrgStructures', where: { Status: 'Active' }, required: false }],
//       transaction,
//     });
//     if (!orgStructure) {
//       console.log('OrgStructure not found:', orgStructureId);
//       throw new Error('Organizational structure not found');
//     }

//     if (!['SuperAdmin'].includes(userRole)) {
//       const userOrgStructure = await UserOrgStructure.findOne({
//         where: { UserId: currentUserId, OrgStructureId: orgStructureId },
//         transaction
//       });
//       if (!userOrgStructure) {
//         throw new Error('Unauthorized to delete this organizational structure');
//       }
//     }

//     if (orgStructure.SubOrgStructures.length > 0) {
//       throw new Error('Cannot delete structure with active sub-structures');
//     }

//     await UserOrgStructure.destroy({ where: { OrgStructureId: orgStructureId }, transaction });

//     await AuditLog.create({
//       AuditLogId: uuidv4(),
//       UserId: currentUserId,
//       EntityType: 'OrgStructure',
//       EntityId: orgStructureId,
//       Action: 'Delete',
//       Changes: {
//         StructureName: orgStructure.StructureName,
//         Description: orgStructure.Description || null,
//       },
//       Timestamp: new Date(),
//     }, { transaction });

//     await orgStructure.destroy({ transaction });

//     await transaction.commit();
//     res.status(200).json({ message: 'Organizational structure deleted successfully' });
//   } catch (error) {
//     console.error('Delete org structure error:', { message: error.message, stack: error.stack });
//     if (transaction && !transaction.finished) {
//       await transaction.rollback();
//     }
//     res.status(error.status || 500);
//     next(error);
//   }
// };

// export const getOrgChart = async (req, res, next) => {
//   try {
//     const { companyId } = req.params;
//     const userId = req.user.userId;
//     const isSuperAdmin = req.user.role === 'SuperAdmin';

//     if (!companyId || companyId === 'undefined' || companyId === ':companyId') {
//       res.status(400);
//       throw new Error('CompanyId is required');
//     }
//     if (!uuidValidate(companyId)) {
//       res.status(400);
//       throw new Error('Invalid CompanyId format');
//     }

//     const company = await Company.findByPk(companyId);
//     if (!company) {
//       res.status(404);
//       throw new Error('Company not found');
//     }

//     const statusFilter = isSuperAdmin ? { [Op.in]: ['Active'] } : 'Active';
//     let orgStructures = await OrgStructure.findAll({
//       where: { CompanyId: companyId, Status: statusFilter },
//       attributes: [
//         'OrgStructureId',
//         'StructureName',
//         'ReportingToId',
//         'Category',
//         'ExpiryDate',
//         'Status',
//         'ReportingType',
//         'isLeaf',
//         'Description',
//         'CreatedByUserId',
//         'CreatedDate',
//         'UpdatedDate'
//       ],
//       include: [
//         {
//           model: UserOrgStructure,
//           as: 'UserOrgStructures',
//           where: { Status: 'Active' },
//           required: false,
//           include: [
//             { model: User, as: 'User', attributes: ['userId', 'username'] },
//             { model: Role, as: 'Role', attributes: ['RoleName'] },
//           ],
//         },
//       ],
//     });

//     if (!isSuperAdmin) {
//       const userOrgStructures = await UserOrgStructure.findAll({ where: { UserId: userId, Status: 'Active' } });
//       const accessibleOrgStructureIds = userOrgStructures.map(u => u.OrgStructureId);
//       if (accessibleOrgStructureIds.length === 0) {
//         console.warn(`No accessible organizational structures for user ${userId} in company ${companyId}`);
//         return res.status(200).json([]);
//       }
//       orgStructures = orgStructures.filter(structure => accessibleOrgStructureIds.includes(structure.OrgStructureId));
//     }

//     const response = orgStructures.map(structure => ({
//       OrgStructureId: structure.OrgStructureId,
//       StructureName: structure.StructureName,
//       ReportingToId: structure.ReportingToId,
//       Category: structure.Category,
//       ExpiryDate: structure.ExpiryDate ? structure.ExpiryDate.toISOString() : null,
//       Status: structure.Status,
//       ReportingType: structure.ReportingType,
//       isLeaf: structure.isLeaf,
//       Description: structure.Description,
//       CreatedByUserId: structure.CreatedByUserId,
//       CreatedDate: structure.CreatedDate,
//       UpdatedDate: structure.UpdatedDate,
//       Users: structure.UserOrgStructures.map(u => ({
//         UserId: u.User.userId,
//         Username: u.User.username,
//         Role: u.Role.RoleName,
//       })),
//     }));

//     if (response.length === 0) {
//       console.warn(`No organizational structures found for company ${companyId}`);
//     }

//     res.status(200).json(response);
//   } catch (error) {
//     console.error('Get org chart error:', {
//       message: error.message,
//       stack: error.stack,
//       companyId: req.params.companyId
//     });
//     next(error);
//   }
// };

// export const assignUserToOrgStructure = async (req, res, next) => {
//   let transaction;
//   try {
//     const { UserId, OrgStructureId, RoleId } = req.body;
//     const currentUserId = req.user.userId;
//     const userRole = req.user.role;

//     if (!['SuperAdmin', 'Admin'].includes(userRole)) {
//       res.status(403);
//       throw new Error('Unauthorized to assign users to organizational structure');
//     }

//     if (!uuidValidate(UserId) || !uuidValidate(OrgStructureId) || !uuidValidate(RoleId)) {
//       res.status(400);
//       throw new Error('Invalid UUID format for UserId, OrgStructureId, or RoleId');
//     }

//     transaction = await sequelize.transaction();

//     const user = await User.findByPk(UserId, { transaction });
//     const orgStructure = await OrgStructure.findByPk(OrgStructureId, { transaction });
//     const role = await Role.findByPk(RoleId, { transaction });

//     if (!user || !orgStructure || !role) {
//       throw new Error('User, organizational structure, or role not found');
//     }

//     if (!['SuperAdmin'].includes(userRole)) {
//       const userCompany = await UserCompany.findOne({
//         where: { UserId: currentUserId, CompanyId: orgStructure.CompanyId },
//         transaction
//       });
//       if (!userCompany) {
//         throw new Error('Unauthorized to assign users to this organizational structure');
//       }
//     }

//     const existingAssignment = await UserOrgStructure.findOne({
//       where: { UserId, OrgStructureId, Status: 'Active' },
//       transaction
//     });
//     if (existingAssignment) {
//       throw new Error('User already assigned to this organizational structure');
//     }

//     const assignment = await UserOrgStructure.create({
//       UserId,
//       OrgStructureId,
//       RoleId,
//       Status: 'Active',
//       AssignedDate: new Date(),
//     }, { transaction });

//     await AuditLog.create({
//       AuditLogId: uuidv4(),
//       UserId: currentUserId,
//       EntityType: 'OrgStructure',
//       EntityId: OrgStructureId,
//       Action: 'Assign User to OrgStructure',
//       Changes: {
//         UserId,
//         OrgStructureId,
//         RoleId
//       },
//       Timestamp: new Date(),
//     }, { transaction });

//     await transaction.commit();
//     res.status(201).json({ message: 'User assigned to organizational structure', assignment });
//   } catch (error) {
//     console.error('Assign user to org structure error:', { message: error.message, stack: error.stack });
//     if (transaction && !transaction.finished) {
//       await transaction.rollback();
//     }
//     res.status(error.status || 500);
//     next(error);
//   }
// };

// export const getOrgStructureHistory = async (req, res, next) => {
//   try {
//     const { orgStructureId } = req.params;
//     const userId = req.user.userId;
//     const isSuperAdmin = req.user.role === 'SuperAdmin';

//     if (!uuidValidate(orgStructureId)) {
//       res.status(400);
//       throw new Error('Invalid OrgStructureId format');
//     }

//     const orgStructure = await OrgStructure.findByPk(orgStructureId);
//     if (!orgStructure) {
//       res.status(404);
//       throw new Error('Organizational structure not found');
//     }

//     if (!isSuperAdmin) {
//       const userOrgStructure = await UserOrgStructure.findOne({
//         where: { UserId: userId, OrgStructureId: orgStructureId, Status: 'Active' }
//       });
//       if (!userOrgStructure) {
//         res.status(403);
//         throw new Error('Unauthorized to access this organizational structure history');
//       }
//     }

//     const history = await AuditLog.findAll({
//       where: {
//         EntityId: orgStructureId,
//         EntityType: 'OrgStructure'
//       },
//       include: [
//         { model: User, as: 'Actor', attributes: ['username'] }
//       ],
//       order: [['Timestamp', 'DESC']],
//     });

//     const response = history.map(log => ({
//       HistoryId: log.AuditLogId,
//       Action: log.Action,
//       User: log.Actor?.username || 'Unknown',
//       Timestamp: log.Timestamp,
//       Changes: log.Changes || {},
//     }));

//     res.status(200).json(response);
//   } catch (error) {
//     console.error('Get org structure history error:', { message: error.message, stack: error.stack });
//     next(error);
//   }
// };









// Updated

import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import OrgStructure from '../models/orgStructureModel.js';
import UserOrgStructure from '../models/userOrgStructureModel.js';
import User from '../models/userModel.js';
import Role from '../models/roleModel.js';
import Company from '../models/companyModel.js';
import AuditLog from '../models/auditLogModel.js';
import UserCompany from '../models/userCompanyModel.js';
import OrgStructureApproval from '../models/orgStructureApprovalModel.js';

export const getOrgStructures = async (req, res, next) => {
  try {
    const companyId = req.query.companyId || req.user.CompanyId;
    const userId = req.user.userId;
    const isSuperAdmin = req.user.primaryRole === 'SuperAdmin';

    console.log('User details in getOrgStructures:', req.user);

    if (!companyId) {
      res.status(400);
      throw new Error('CompanyId is required');
    }
    if (!uuidValidate(companyId)) {
      res.status(400);
      throw new Error('Invalid CompanyId format');
    }

    const company = await Company.findByPk(companyId);
    if (!company) {
      res.status(404);
      throw new Error('Company not found');
    }

    let where = { CompanyId: companyId, Status: 'Active' };
    if (!isSuperAdmin) {
      const userOrgStructures = await UserOrgStructure.findAll({ where: { UserId: userId, Status: 'Active' } });
      const accessibleOrgStructureIds = userOrgStructures.map(u => u.OrgStructureId);
      if (accessibleOrgStructureIds.length === 0) {
        res.status(403);
        throw new Error('No accessible organizational structures');
      }
      where = { ...where, OrgStructureId: { [Op.in]: accessibleOrgStructureIds } };
    }

    const orgStructures = await OrgStructure.findAll({
      where,
      include: [
        { model: OrgStructure, as: 'SubOrgStructures', where: { Status: 'Active' }, required: false },
        { model: OrgStructure, as: 'ParentOrgStructure' },
        { model: User, as: 'Creator', attributes: ['username'] },
      ],
    });

    res.status(200).json(orgStructures);
  } catch (error) {
    console.error('Get org structures error:', {
      message: error.message,
      stack: error.stack,
      companyId: req.query.companyId || req.user.CompanyId,
      userId: req.user.userId,
    });
    next(error);
  }
};

export const getOrgStructure = async (req, res, next) => {
  try {
    const { orgStructureId } = req.params;
    const userId = req.user.userId;
    const isSuperAdmin = req.user.primaryRole === 'SuperAdmin';

    console.log('User details in getOrgStructure:', req.user);

    if (!uuidValidate(orgStructureId)) {
      res.status(400);
      throw new Error('Invalid OrgStructureId format');
    }

    const orgStructure = await OrgStructure.findByPk(orgStructureId, {
      include: [
        { model: OrgStructure, as: 'SubOrgStructures', where: { Status: 'Active' }, required: false },
        { model: OrgStructure, as: 'ParentOrgStructure' },
        { model: User, as: 'Creator', attributes: ['username'] },
        {
          model: UserOrgStructure,
          as: 'UserOrgStructures',
          include: [
            { model: User, as: 'User', attributes: ['username'] },
            { model: Role, as: 'Role', attributes: ['RoleName'] },
          ],
        },
      ],
    });

    if (!orgStructure) {
      res.status(404);
      throw new Error('Organizational structure not found');
    }

    if (!isSuperAdmin) {
      const userOrgStructure = await UserOrgStructure.findOne({
        where: { UserId: userId, OrgStructureId: orgStructureId, Status: 'Active' },
      });
      if (!userOrgStructure) {
        res.status(403);
        throw new Error('Unauthorized to access this organizational structure');
      }
    }

    res.status(200).json(orgStructure);
  } catch (error) {
    console.error('Get org structure error:', {
      message: error.message,
      stack: error.stack,
      orgStructureId,
      userId: req.user.userId,
    });
    next(error);
  }
};

export const createOrgStructure = async (req, res, next) => {
  const { CompanyId, StructureName, Description, StructureType, ReportingType, Category, ExpiryDate, ReportingToId } = req.body;
  const currentUserId = req.user.userId;
  const userRole = req.user.primaryRole;

  try {
    if (!['SuperAdmin', 'Admin'].includes(userRole)) {
      res.status(403);
      throw new Error('Unauthorized to create organizational structure');
    }

    if (!CompanyId || !StructureName || !StructureType || !ReportingType || !Category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!uuidValidate(CompanyId)) {
      return res.status(400).json({ message: 'Invalid CompanyId format' });
    }

    const company = await Company.findByPk(CompanyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const transaction = await sequelize.transaction();

    try {
      const orgStructure = await OrgStructure.create({
        OrgStructureId: uuidv4(),
        CompanyId,
        StructureName,
        Description: Description || null,
        StructureType,
        ReportingType,
        Category,
        ExpiryDate: ExpiryDate || null,
        CreatedByUserId: currentUserId,
        ReportingToId: ReportingToId || null,
        Status: 'Active',
      }, { transaction });

      await AuditLog.create({
        AuditLogId: uuidv4(),
        UserId: currentUserId,
        EntityType: 'OrgStructure',
        EntityId: orgStructure.OrgStructureId,
        Action: 'Create',
        Changes: {
          CompanyId,
          StructureName,
          Description,
          StructureType,
          ReportingType,
          Category,
          ExpiryDate,
          ReportingToId,
        },
        Timestamp: new Date(),
      }, { transaction });

      await transaction.commit();
      res.status(201).json({ message: 'Organizational structure created successfully', orgStructure });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Create org structure error:', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
      userId: currentUserId,
    });
    res.status(error.status || 500);
    next(error);
  }
};

export const updateOrgStructure = async (req, res, next) => {
  const { orgStructureId } = req.params;
  const { StructureName, Description, StructureType, ReportingType, Category, ExpiryDate, ReportingToId } = req.body;
  const currentUserId = req.user.userId;
  const userRole = req.user.primaryRole;

  try {
    if (!['SuperAdmin', 'Admin'].includes(userRole)) {
      res.status(403);
      throw new Error('Unauthorized to update organizational structure');
    }

    if (!uuidValidate(orgStructureId)) {
      return res.status(400).json({ message: 'Invalid OrgStructureId format' });
    }

    const orgStructure = await OrgStructure.findByPk(orgStructureId);
    if (!orgStructure) {
      return res.status(404).json({ message: 'Organizational structure not found' });
    }

    const transaction = await sequelize.transaction();

    try {
      await orgStructure.update({
        StructureName: StructureName || orgStructure.StructureName,
        Description: Description || orgStructure.Description,
        StructureType: StructureType || orgStructure.StructureType,
        ReportingType: ReportingType || orgStructure.ReportingType,
        Category: Category || orgStructure.Category,
        ExpiryDate: ExpiryDate || orgStructure.ExpiryDate,
        ReportingToId: ReportingToId || orgStructure.ReportingToId,
        UpdatedByUserId: currentUserId,
        UpdatedDate: new Date(),
      }, { transaction });

      await AuditLog.create({
        AuditLogId: uuidv4(),
        UserId: currentUserId,
        EntityType: 'OrgStructure',
        EntityId: orgStructureId,
        Action: 'Update',
        Changes: {
          StructureName,
          Description,
          StructureType,
          ReportingType,
          Category,
          ExpiryDate,
          ReportingToId,
        },
        Timestamp: new Date(),
      }, { transaction });

      await transaction.commit();
      res.status(200).json({ message: 'Organizational structure updated successfully', orgStructure });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Update org structure error:', {
      message: error.message,
      stack: error.stack,
      orgStructureId,
      userId: currentUserId,
    });
    res.status(error.status || 500);
    next(error);
  }
};

export const deleteOrgStructure = async (req, res, next) => {
  const { orgStructureId } = req.params;
  const currentUserId = req.user.userId;
  const userRole = req.user.primaryRole;

  try {
    if (!['SuperAdmin', 'Admin'].includes(userRole)) {
      res.status(403);
      throw new Error('Unauthorized to delete organizational structure');
    }

    if (!uuidValidate(orgStructureId)) {
      return res.status(400).json({ message: 'Invalid OrgStructureId format' });
    }

    const orgStructure = await OrgStructure.findByPk(orgStructureId);
    if (!orgStructure) {
      return res.status(404).json({ message: 'Organizational structure not found' });
    }

    const transaction = await sequelize.transaction();

    try {
      await orgStructure.update({ Status: 'Inactive' }, { transaction });

      await AuditLog.create({
        AuditLogId: uuidv4(),
        UserId: currentUserId,
        EntityType: 'OrgStructure',
        EntityId: orgStructureId,
        Action: 'Delete',
        Timestamp: new Date(),
      }, { transaction });

      await transaction.commit();
      res.status(200).json({ message: 'Organizational structure deleted successfully' });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Delete org structure error:', {
      message: error.message,
      stack: error.stack,
      orgStructureId,
      userId: currentUserId,
    });
    res.status(error.status || 500);
    next(error);
  }
};

export const getOrgChart = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const userId = req.user.userId;
    const isSuperAdmin = req.user.primaryRole === 'SuperAdmin';

    console.log('User details in getOrgChart:', req.user);

    if (!uuidValidate(companyId)) {
      res.status(400);
      throw new Error('Invalid CompanyId format');
    }

    const company = await Company.findByPk(companyId);
    if (!company) {
      res.status(404);
      throw new Error('Company not found');
    }

    let where = { CompanyId: companyId, Status: 'Active' };
    if (!isSuperAdmin) {
      const accessibleOrgStructureIds = await getAccessibleOrgStructures(userId, companyId);
      if (accessibleOrgStructureIds.length === 0) {
        return res.status(403).json({ message: 'No accessible organizational structures' });
      }
      where = { ...where, OrgStructureId: { [Op.in]: accessibleOrgStructureIds } };
    }

    const orgStructures = await OrgStructure.findAll({
      where,
      include: [
        { model: OrgStructure, as: 'SubOrgStructures', where: { Status: 'Active' }, required: false },
        { model: OrgStructure, as: 'ParentOrgStructure' },
        { model: User, as: 'Creator', attributes: ['username'] },
        {
          model: UserOrgStructure,
          as: 'UserOrgStructures',
          include: [
            { model: User, as: 'User', attributes: ['username'] },
            { model: Role, as: 'Role', attributes: ['RoleName'] },
          ],
        },
      ],
      order: [['CreatedDate', 'ASC']],
    });

    const response = orgStructures.map(structure => ({
      OrgStructureId: structure.OrgStructureId,
      StructureName: structure.StructureName,
      ReportingToId: structure.ReportingToId,
      Category: structure.Category,
      ExpiryDate: structure.ExpiryDate ? structure.ExpiryDate.toISOString() : null,
      Status: structure.Status,
      ReportingType: structure.ReportingType,
      isLeaf: structure.isLeaf,
      Description: structure.Description,
      CreatedByUserId: structure.CreatedByUserId,
      CreatedDate: structure.CreatedDate,
      UpdatedDate: structure.UpdatedDate,
      Users: structure.UserOrgStructures.map(u => ({
        UserId: u.User.userId,
        Username: u.User.username,
        Role: u.Role.RoleName,
      })),
    }));

    if (response.length === 0) {
      console.warn(`No organizational structures found for company ${companyId}`);
    }

    res.status(200).json(response);
  } catch (error) {
    console.error('Get org chart error:', {
      message: error.message,
      stack: error.stack,
      companyId: req.params.companyId,
      userId: req.user.userId,
    });
    next(error);
  }
};

export const assignUserToOrgStructure = async (req, res, next) => {
  let transaction;
  try {
    const { UserId, OrgStructureId, RoleId } = req.body;
    const currentUserId = req.user.userId;
    const userRole = req.user.primaryRole;

    console.log('User details in assignUserToOrgStructure:', req.user);

    if (!['SuperAdmin', 'Admin'].includes(userRole)) {
      res.status(403);
      throw new Error('Unauthorized to assign users to organizational structure');
    }

    if (!uuidValidate(UserId) || !uuidValidate(OrgStructureId) || !uuidValidate(RoleId)) {
      res.status(400);
      throw new Error('Invalid UUID format for UserId, OrgStructureId, or RoleId');
    }

    transaction = await sequelize.transaction();

    const user = await User.findByPk(UserId, { transaction });
    const orgStructure = await OrgStructure.findByPk(OrgStructureId, { transaction });
    const role = await Role.findByPk(RoleId, { transaction });

    if (!user || !orgStructure || !role) {
      throw new Error('User, organizational structure, or role not found');
    }

    if (!['SuperAdmin'].includes(userRole)) {
      const userCompany = await UserCompany.findOne({
        where: { UserId: currentUserId, CompanyId: orgStructure.CompanyId },
        transaction,
      });
      if (!userCompany) {
        throw new Error('Unauthorized to assign users to this organizational structure');
      }
    }

    const existingAssignment = await UserOrgStructure.findOne({
      where: { UserId, OrgStructureId, Status: 'Active' },
      transaction,
    });
    if (existingAssignment) {
      throw new Error('User already assigned to this organizational structure');
    }

    const assignment = await UserOrgStructure.create({
      UserId,
      OrgStructureId,
      RoleId,
      Status: 'Active',
      AssignedDate: new Date(),
    }, { transaction });

    await AuditLog.create({
      AuditLogId: uuidv4(),
      UserId: currentUserId,
      EntityType: 'OrgStructure',
      EntityId: OrgStructureId,
      Action: 'Assign User to OrgStructure',
      Changes: {
        UserId,
        OrgStructureId,
        RoleId,
      },
      Timestamp: new Date(),
    }, { transaction });

    await transaction.commit();
    res.status(201).json({ message: 'User assigned to organizational structure', assignment });
  } catch (error) {
    console.error('Assign user to org structure error:', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
      userId: req.user.userId,
    });
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    res.status(error.status || 500);
    next(error);
  }
};

export const getOrgStructureHistory = async (req, res, next) => {
  try {
    const { orgStructureId } = req.params;
    const userId = req.user.userId;
    const isSuperAdmin = req.user.primaryRole === 'SuperAdmin';

    console.log('User details in getOrgStructureHistory:', req.user);

    if (!uuidValidate(orgStructureId)) {
      res.status(400);
      throw new Error('Invalid OrgStructureId format');
    }

    const orgStructure = await OrgStructure.findByPk(orgStructureId);
    if (!orgStructure) {
      res.status(404);
      throw new Error('Organizational structure not found');
    }

    if (!isSuperAdmin) {
      const userOrgStructure = await UserOrgStructure.findOne({
        where: { UserId: userId, OrgStructureId: orgStructureId, Status: 'Active' },
      });
      if (!userOrgStructure) {
        res.status(403);
        throw new Error('Unauthorized to access this organizational structure history');
      }
    }

    const history = await AuditLog.findAll({
      where: {
        EntityId: orgStructureId,
        EntityType: 'OrgStructure',
      },
      include: [
        { model: User, as: 'Actor', attributes: ['username'] },
      ],
      order: [['Timestamp', 'DESC']],
    });

    const response = history.map(log => ({
      HistoryId: log.AuditLogId,
      Action: log.Action,
      User: log.Actor?.username || 'Unknown',
      Timestamp: log.Timestamp,
      Changes: log.Changes || {},
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error('Get org structure history error:', {
      message: error.message,
      stack: error.stack,
      orgStructureId,
      userId: req.user.userId,
    });
    next(error);
  }
};

// Helper function for getOrgChart (assuming it was part of the truncated code)
async function getAccessibleOrgStructures(userId, companyId) {
  try {
    const userOrgStructures = await UserOrgStructure.findAll({
      where: { UserId: userId, Status: 'Active' },
      include: [
        {
          model: OrgStructure,
          as: 'OrgStructure',
          where: { CompanyId: companyId, Status: 'Active' },
        },
      ],
    });
    return userOrgStructures.map(u => u.OrgStructure.OrgStructureId);
  } catch (error) {
    console.error('Get accessible org structures error:', {
      message: error.message,
      stack: error.stack,
      userId,
      companyId,
    });
    throw error;
  }
}