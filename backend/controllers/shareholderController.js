// import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
// import { Op } from 'sequelize';
// import sequelize from '../config/database.js';
// import Shareholder from '../models/shareholderModel.js';
// import CompanyShareholderMapping from '../models/companyShareholderMappingModel.js';
// import Company from '../models/companyModel.js';
// import User from '../models/userModel.js';
// import AuditLog from '../models/auditLogModel.js';

// export const getShareholders = async (req, res, next) => {
//   try {
//     const companyId = req.query.companyId || req.user.companyId;
//     const userId = req.user.userId;
//     const isSuperAdmin = req.user.role === 'SuperAdmin';

//     if (companyId && !uuidValidate(companyId)) {
//       return res.status(400).json({ message: 'Invalid CompanyId format' });
//     }

//     let where = companyId ? { CompanyId: companyId } : {};
//     if (!isSuperAdmin) {
//       where = { ...where, CompanyId: req.user.companyId };
//       if (!req.user.companyId) {
//         return res.status(400).json({ message: 'User not associated with any company' });
//       }
//     }

//     const shareholders = await Shareholder.findAll({
//       include: [
//         {
//           model: CompanyShareholderMapping,
//           as: 'CompanyMappings',
//           where,
//           required: !!companyId,
//           include: [{ model: Company, as: 'Company', attributes: ['CompanyName'] }],
//         },
//       ],
//     });

//     return res.status(200).json(shareholders);
//   } catch (error) {
//     console.error('Get shareholders error:', {
//       message: error.message,
//       stack: error.stack,
//       companyId: req.query.companyId || req.user.companyId,
//       userId: req.user.userId,
//     });
//     return res.status(error.status || 500).json({ message: error.message || 'Server error' });
//   }
// };

// export const getShareholder = async (req, res, next) => {
//   try {
//     const { shareholderId } = req.params;
//     const userId = req.user.userId;
//     const isSuperAdmin = req.user.primaryRole === 'SuperAdmin'; // Use primaryRole

//     console.log('User details:', req.user); // Debug log

//     if (!uuidValidate(shareholderId)) {
//       return res.status(400).json({ message: 'Invalid ShareholderId format' });
//     }

//     const shareholder = await Shareholder.findByPk(shareholderId, {
//       include: [
//         {
//           model: CompanyShareholderMapping,
//           as: 'CompanyMappings',
//           include: [{ model: Company, as: 'Company', attributes: ['CompanyId', 'CompanyName'] }],
//         },
//       ],
//     });

//     if (!shareholder) {
//       return res.status(404).json({ message: 'Shareholder not found' });
//     }

//     if (!isSuperAdmin && shareholder.CompanyMappings.length > 0) {
//       const userCompanyIds = req.user.CompanyId ? [req.user.CompanyId] : []; // Use CompanyId
//       const accessible = shareholder.CompanyMappings.every(
//         (mapping) => userCompanyIds.includes(mapping.CompanyId)
//       );
//       if (!accessible) {
//         return res.status(403).json({ message: 'Unauthorized to access this shareholder' });
//       }
//     }

//     return res.status(200).json(shareholder);
//   } catch (error) {
//     console.error('Get shareholder error:', {
//       message: error.message,
//       stack: error.stack,
//       shareholderId,
//       userId,
//     });
//     return res.status(error.status || 500).json({ message: error.message || 'Server error' });
//   }
// };

// export const createShareholder = async (req, res, next) => {
//   const { ShareholderName, CompanyMappings } = req.body;
//   const currentUserId = req.user.userId;
//   const userRole = req.user.role;

//   try {
//     if (!['SuperAdmin', 'Admin'].includes(userRole)) {
//       return res.status(403).json({ message: 'Unauthorized to create shareholder' });
//     }

//     if (!ShareholderName) {
//       return res.status(400).json({ message: 'ShareholderName is required' });
//     }

//     const transaction = await sequelize.transaction();

//     try {
//       const shareholder = await Shareholder.create({
//         ShareholderId: uuidv4(),
//         ShareholderName,
//       }, { transaction });

//       if (Array.isArray(CompanyMappings) && CompanyMappings.length > 0) {
//         for (const mapping of CompanyMappings) {
//           const { CompanyId, ShareQt, ShareValue } = mapping;
//           if (!uuidValidate(CompanyId) || !Number.isInteger(ShareQt) || ShareQt <= 0 || typeof ShareValue !== 'number' || ShareValue <= 0) {
//             throw new Error('Invalid CompanyId, ShareQt (must be positive integer), or ShareValue (must be positive number)');
//           }

//           const company = await Company.findByPk(CompanyId, { transaction });
//           if (!company) {
//             throw new Error(`Company ${CompanyId} not found`);
//           }

//           await CompanyShareholderMapping.create({
//             ShareholderId: shareholder.ShareholderId,
//             CompanyId,
//             ShareholderName,
//             ShareQt,
//             ShareValue,
//           }, { transaction });

//           await company.update({
//             NoOfShareholders: company.NoOfShareholders + 1,
//             SubscribedShareQt: company.SubscribedShareQt + ShareQt,
//           }, { transaction });
//         }
//       }

//       await AuditLog.create({
//         AuditLogId: uuidv4(),
//         UserId: currentUserId,
//         EntityType: 'Shareholder',
//         EntityId: shareholder.ShareholderId,
//         Action: 'Create',
//         Timestamp: new Date(),
//       }, { transaction });

//       await transaction.commit();
//       return res.status(201).json({
//         message: 'Shareholder created successfully',
//         ShareholderId: shareholder.ShareholderId,
//       });
//     } catch (error) {
//       await transaction.rollback();
//       throw error;
//     }
//   } catch (error) {
//     console.error('Create shareholder error:', {
//       message: error.message,
//       stack: error.stack,
//       userId: currentUserId,
//       validationErrors: error.errors ? error.errors.map(e => ({ field: e.path, message: e.message })) : null,
//     });
//     return res.status(error.status || 500).json({ 
//       message: error.message || 'Internal server error',
//       validationErrors: error.errors ? error.errors.map(e => ({ field: e.path, message: e.message })) : null,
//     });
//   }
// };

// export const updateShareholder = async (req, res, next) => {
//   const { shareholderId } = req.params;
//   const { ShareholderName } = req.body;
//   const currentUserId = req.user.userId;
//   const userRole = req.user.role;

//   try {
//     if (!['SuperAdmin', 'Admin'].includes(userRole)) {
//       return res.status(403).json({ message: 'Unauthorized to update shareholder' });
//     }

//     if (!uuidValidate(shareholderId)) {
//       return res.status(400).json({ message: 'Invalid ShareholderId format' });
//     }

//     if (!ShareholderName) {
//       return res.status(400).json({ message: 'ShareholderName is required' });
//     }

//     const shareholder = await Shareholder.findByPk(shareholderId);
//     if (!shareholder) {
//       return res.status(404).json({ message: 'Shareholder not found' });
//     }

//     const transaction = await sequelize.transaction();

//     try {
//       await shareholder.update({ ShareholderName }, { transaction });

//       await CompanyShareholderMapping.update(
//         { ShareholderName },
//         { where: { ShareholderId: shareholderId }, transaction }
//       );

//       await AuditLog.create({
//         AuditLogId: uuidv4(),
//         UserId: currentUserId,
//         EntityType: 'Shareholder',
//         EntityId: shareholderId,
//         Action: 'Update',
//         Timestamp: new Date(),
//       }, { transaction });

//       await transaction.commit();
//       return res.status(200).json({
//         message: 'Shareholder updated successfully',
//         ShareholderId: shareholderId,
//       });
//     } catch (error) {
//       await transaction.rollback();
//       throw error;
//     }
//   } catch (error) {
//     console.error('Update shareholder error:', {
//       message: error.message,
//       stack: error.stack,
//       shareholderId,
//       userId: currentUserId,
//       validationErrors: error.errors ? error.errors.map(e => ({ field: e.path, message: e.message })) : null,
//     });
//     return res.status(error.status || 500).json({ 
//       message: error.message || 'Internal server error',
//       validationErrors: error.errors ? error.errors.map(e => ({ field: e.path, message: e.message })) : null,
//     });
//   }
// };

// export const deleteShareholder = async (req, res, next) => {
//   let transaction;
//   try {
//     const { shareholderId } = req.params;
//     const currentUserId = req.user.userId;
//     const userRole = req.user.role;

//     if (!['SuperAdmin', 'Admin'].includes(userRole)) {
//       return res.status(403).json({ message: 'Unauthorized to delete shareholder' });
//     }

//     if (!uuidValidate(shareholderId)) {
//       return res.status(400).json({ message: 'Invalid ShareholderId format' });
//     }

//     transaction = await sequelize.transaction();

//     const shareholder = await Shareholder.findByPk(shareholderId, {
//       include: [{ model: CompanyShareholderMapping, as: 'CompanyMappings' }],
//       transaction,
//     });
//     if (!shareholder) {
//       await transaction.rollback();
//       return res.status(404).json({ message: 'Shareholder not found' });
//     }

//     const companyUpdates = shareholder.CompanyMappings.map(async (mapping) => {
//       const company = await Company.findByPk(mapping.CompanyId, { transaction });
//       if (company) {
//         await company.update({
//           NoOfShareholders: Math.max(company.NoOfShareholders - 1, 0),
//           SubscribedShareQt: Math.max(company.SubscribedShareQt - mapping.ShareQt, 0),
//         }, { transaction });
//       }
//     });
//     await Promise.all(companyUpdates);

//     await CompanyShareholderMapping.destroy({
//       where: { ShareholderId: shareholderId },
//       transaction,
//     });

//     await AuditLog.create({
//       AuditLogId: uuidv4(),
//       UserId: currentUserId,
//       EntityType: 'Shareholder',
//       EntityId: shareholderId,
//       Action: 'Delete',
//       Timestamp: new Date(),
//     }, { transaction });

//     await shareholder.destroy({ transaction });

//     await transaction.commit();
//     return res.status(200).json({ message: 'Shareholder deleted successfully' });
//   } catch (error) {
//     if (transaction && !transaction.finished) {
//       await transaction.rollback();
//     }
//     console.error('Delete shareholder error:', {
//       message: error.message,
//       stack: error.stack,
//       shareholderId: req.params.shareholderId,
//       userId: req.user.userId,
//       validationErrors: error.errors ? error.errors.map(e => ({ field: e.path, message: e.message })) : null,
//     });
//     return res.status(error.status || 500).json({ 
//       message: error.message || 'Server error',
//       validationErrors: error.errors ? error.errors.map(e => ({ field: e.path, message: e.message })) : null,
//     });
//   }
// };

// export const assignShareholderToCompany = async (req, res) => {
//   const { ShareholderId, CompanyId, ShareQt, ShareValue } = req.body;
//   const currentUserId = req.user.userId;
//   const userRole = req.user.role;

//   try {
//     if (!['SuperAdmin', 'Admin'].includes(userRole)) {
//       return res.status(403).json({ message: 'Unauthorized to assign shareholder' });
//     }

//     if (!uuidValidate(ShareholderId) || !uuidValidate(CompanyId)) {
//       return res.status(400).json({ message: 'Invalid ShareholderId or CompanyId format' });
//     }

//     if (!Number.isInteger(ShareQt) || ShareQt <= 0) {
//       return res.status(400).json({ message: 'ShareQt must be a positive integer' });
//     }

//     if (typeof ShareValue !== 'number' || ShareValue <= 0) {
//       return res.status(400).json({ message: 'ShareValue must be a positive number' });
//     }

//     const transaction = await sequelize.transaction();
//     try {
//       const shareholder = await Shareholder.findByPk(ShareholderId, { transaction });
//       if (!shareholder) {
//         await transaction.rollback();
//         return res.status(404).json({ message: 'Shareholder not found' });
//       }

//       const company = await Company.findByPk(CompanyId, { transaction });
//       if (!company) {
//         await transaction.rollback();
//         return res.status(404).json({ message: 'Company not found' });
//       }

//       const existingMapping = await CompanyShareholderMapping.findOne({
//         where: { ShareholderId, CompanyId },
//         transaction,
//       });
//       if (existingMapping) {
//         await transaction.rollback();
//         return res.status(400).json({ message: 'Shareholder already assigned to this company' });
//       }

//       await CompanyShareholderMapping.create({
//         ShareholderId,
//         CompanyId,
//         ShareholderName: shareholder.ShareholderName,
//         ShareQt,
//         ShareValue,
//       }, { transaction });

//       await company.update({
//         NoOfShareholders: company.NoOfShareholders + 1,
//         SubscribedShareQt: company.SubscribedShareQt + ShareQt,
//       }, { transaction });

//       await AuditLog.create({
//         AuditLogId: uuidv4(),
//         UserId: currentUserId,
//         EntityType: 'Shareholder',
//         EntityId: ShareholderId,
//         Action: 'Assign to Company',
//         Timestamp: new Date(),
//       }, { transaction });

//       await transaction.commit();
//       return res.status(201).json({ message: 'Shareholder assigned successfully' });
//     } catch (error) {
//       await transaction.rollback();
//       throw error;
//     }
//   } catch (error) {
//     console.error('Assign shareholder to company error:', {
//       message: error.message,
//       stack: error.stack,
//       requestBody: req.body,
//       userId: currentUserId,
//       validationErrors: error.errors?.map(e => ({ field: e.path, message: e.message })) || [],
//     });
//     return res.status(error.status || 500).json({
//       message: error.message || 'Server error',
//       validationErrors: error.errors?.map(e => ({ field: e.path, message: e.message })) || [],
//     });
//   }
// };

// export const getShareholderHistory = async (req, res, next) => {
//   try {
//     const { shareholderId } = req.params;
//     const userId = req.user.userId;
//     const isSuperAdmin = req.user.role === 'SuperAdmin';

//     if (!uuidValidate(shareholderId)) {
//       return res.status(400).json({ message: 'Invalid ShareholderId format' });
//     }

//     const shareholder = await Shareholder.findByPk(shareholderId);
//     if (!shareholder) {
//       return res.status(404).json({ message: 'Shareholder not found' });
//     }

//     if (!isSuperAdmin) {
//       const mappings = await CompanyShareholderMapping.findAll({
//         where: { ShareholderId: shareholderId },
//       });
//       const userCompanyIds = req.user.companyId ? [req.user.companyId] : [];
//       const accessible = mappings.every((mapping) => userCompanyIds.includes(mapping.CompanyId));
//       if (!accessible || mappings.length === 0) {
//         return res.status(403).json({ message: 'Unauthorized to access this shareholder history' });
//       }
//     }

//     const history = await AuditLog.findAll({
//       where: {
//         EntityId: shareholderId,
//         EntityType: 'Shareholder',
//       },
//       include: [{ model: User, as: 'Actor', attributes: ['username'] }],
//       order: [['Timestamp', 'DESC']],
//     });

//     const response = history.map((log) => ({
//       HistoryId: log.AuditLogId,
//       Action: log.Action,
//       User: log.Actor?.username || 'Unknown',
//       Timestamp: log.Timestamp,
//     }));

//     return res.status(200).json(response);
//   } catch (error) {
//     console.error('Get shareholder history error:', {
//       message: error.message,
//       stack: error.stack,
//       shareholderId,
//       userId,
//     });
//     return res.status(error.status || 500).json({ message: error.message || 'Server error' });
//   }
// };






// Updated

import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import Shareholder from '../models/shareholderModel.js';
import CompanyShareholderMapping from '../models/companyShareholderMappingModel.js';
import Company from '../models/companyModel.js';
import User from '../models/userModel.js';
import AuditLog from '../models/auditLogModel.js';

export const getShareholders = async (req, res, next) => {
  try {
    const companyId = req.query.companyId || req.user.CompanyId;
    const userId = req.user.userId;
    const isSuperAdmin = req.user.primaryRole === 'SuperAdmin';

    console.log('User details in getShareholders:', req.user); // Debug log

    if (companyId && !uuidValidate(companyId)) {
      return res.status(400).json({ message: 'Invalid CompanyId format' });
    }

    let where = companyId ? { CompanyId: companyId } : {};
    if (!isSuperAdmin) {
      if (!req.user.CompanyId) {
        return res.status(400).json({ message: 'User not associated with any company' });
      }
      where = { ...where, CompanyId: req.user.CompanyId };
    }

    const shareholders = await Shareholder.findAll({
      include: [
        {
          model: CompanyShareholderMapping,
          as: 'CompanyMappings',
          where,
          required: !!companyId,
          include: [{ model: Company, as: 'Company', attributes: ['CompanyName'] }],
        },
      ],
    });

    return res.status(200).json(shareholders);
  } catch (error) {
    console.error('Get shareholders error:', {
      message: error.message,
      stack: error.stack,
      companyId: req.query.companyId || req.user.CompanyId,
      userId: req.user.userId,
    });
    return res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

export const getShareholder = async (req, res, next) => {
  try {
    const { shareholderId } = req.params;
    const userId = req.user.userId;
    const isSuperAdmin = req.user.primaryRole === 'SuperAdmin';

    console.log('User details in getShareholder:', req.user); // Debug log

    if (!uuidValidate(shareholderId)) {
      return res.status(400).json({ message: 'Invalid ShareholderId format' });
    }

    const shareholder = await Shareholder.findByPk(shareholderId, {
      include: [
        {
          model: CompanyShareholderMapping,
          as: 'CompanyMappings',
          include: [{ model: Company, as: 'Company', attributes: ['CompanyId', 'CompanyName'] }],
        },
      ],
    });

    if (!shareholder) {
      return res.status(404).json({ message: 'Shareholder not found' });
    }

    if (!isSuperAdmin && shareholder.CompanyMappings.length > 0) {
      const userCompanyIds = req.user.CompanyId ? [req.user.CompanyId] : [];
      const accessible = shareholder.CompanyMappings.every(
        (mapping) => userCompanyIds.includes(mapping.CompanyId)
      );
      if (!accessible) {
        return res.status(403).json({ message: 'Unauthorized to access this shareholder' });
      }
    }

    return res.status(200).json(shareholder);
  } catch (error) {
    console.error('Get shareholder error:', {
      message: error.message,
      stack: error.stack,
      shareholderId,
      userId: req.user.userId,
    });
    return res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

export const createShareholder = async (req, res, next) => {
  const { ShareholderName, CompanyMappings } = req.body;
  const currentUserId = req.user.userId;
  const userRole = req.user.primaryRole;

  try {
    if (!['SuperAdmin', 'Admin'].includes(userRole)) {
      res.status(403);
      throw new Error('Unauthorized to create shareholder');
    }

    if (!ShareholderName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const transaction = await sequelize.transaction();

    try {
      const shareholder = await Shareholder.create({
        ShareholderId: uuidv4(),
        ShareholderName,
      }, { transaction });

      if (CompanyMappings && CompanyMappings.length > 0) {
        for (const mapping of CompanyMappings) {
          const { CompanyId, ShareQt, ShareValue } = mapping;
          if (!uuidValidate(CompanyId)) {
            throw new Error('Invalid CompanyId format');
          }

          const company = await Company.findByPk(CompanyId, { transaction });
          if (!company) {
            throw new Error('Company not found');
          }

          await CompanyShareholderMapping.create({
            ShareholderId: shareholder.ShareholderId,
            CompanyId,
            ShareholderName,
            ShareQt,
            ShareValue,
          }, { transaction });

          await company.update({
            NoOfShareholders: company.NoOfShareholders + 1,
            SubscribedShareQt: company.SubscribedShareQt + ShareQt,
          }, { transaction });
        }
      }

      await AuditLog.create({
        AuditLogId: uuidv4(),
        UserId: currentUserId,
        EntityType: 'Shareholder',
        EntityId: shareholder.ShareholderId,
        Action: 'Create',
        Timestamp: new Date(),
      }, { transaction });

      await transaction.commit();
      return res.status(201).json({ message: 'Shareholder created successfully', shareholder });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Create shareholder error:', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
      userId: currentUserId,
    });
    return res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

export const updateShareholder = async (req, res, next) => {
  const { shareholderId } = req.params;
  const { ShareholderName } = req.body;
  const currentUserId = req.user.userId;
  const userRole = req.user.primaryRole;

  try {
    if (!['SuperAdmin', 'Admin'].includes(userRole)) {
      res.status(403);
      throw new Error('Unauthorized to update shareholder');
    }

    if (!uuidValidate(shareholderId)) {
      return res.status(400).json({ message: 'Invalid ShareholderId format' });
    }

    const shareholder = await Shareholder.findByPk(shareholderId);
    if (!shareholder) {
      return res.status(404).json({ message: 'Shareholder not found' });
    }

    const transaction = await sequelize.transaction();

    try {
      await shareholder.update({
        ShareholderName: ShareholderName || shareholder.ShareholderName,
      }, { transaction });

      await AuditLog.create({
        AuditLogId: uuidv4(),
        UserId: currentUserId,
        EntityType: 'Shareholder',
        EntityId: shareholderId,
        Action: 'Update',
        Changes: { ShareholderName },
        Timestamp: new Date(),
      }, { transaction });

      await transaction.commit();
      return res.status(200).json({ message: 'Shareholder updated successfully', shareholder });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Update shareholder error:', {
      message: error.message,
      stack: error.stack,
      shareholderId,
      userId: currentUserId,
    });
    return res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

export const deleteShareholder = async (req, res, next) => {
  const { shareholderId } = req.params;
  const currentUserId = req.user.userId;
  const userRole = req.user.primaryRole;

  try {
    if (!['SuperAdmin', 'Admin'].includes(userRole)) {
      res.status(403);
      throw new Error('Unauthorized to delete shareholder');
    }

    if (!uuidValidate(shareholderId)) {
      return res.status(400).json({ message: 'Invalid ShareholderId format' });
    }

    const shareholder = await Shareholder.findByPk(shareholderId);
    if (!shareholder) {
      return res.status(404).json({ message: 'Shareholder not found' });
    }

    const transaction = await sequelize.transaction();

    try {
      await shareholder.destroy({ transaction });

      await AuditLog.create({
        AuditLogId: uuidv4(),
        UserId: currentUserId,
        EntityType: 'Shareholder',
        EntityId: shareholderId,
        Action: 'Delete',
        Timestamp: new Date(),
      }, { transaction });

      await transaction.commit();
      return res.status(200).json({ message: 'Shareholder deleted successfully' });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Delete shareholder error:', {
      message: error.message,
      stack: error.stack,
      shareholderId,
      userId: currentUserId,
    });
    return res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

export const assignShareholderToCompany = async (req, res, next) => {
  const { ShareholderId, CompanyId, ShareQt, ShareValue } = req.body;
  const currentUserId = req.user.userId;
  const userRole = req.user.primaryRole;

  try {
    if (!['SuperAdmin', 'Admin'].includes(userRole)) {
      res.status(403);
      throw new Error('Unauthorized to assign shareholder to company');
    }

    if (!uuidValidate(ShareholderId) || !uuidValidate(CompanyId)) {
      return res.status(400).json({ message: 'Invalid ShareholderId or CompanyId format' });
    }

    const transaction = await sequelize.transaction();

    try {
      const shareholder = await Shareholder.findByPk(ShareholderId, { transaction });
      if (!shareholder) {
        throw new Error('Shareholder not found');
      }

      const company = await Company.findByPk(CompanyId, { transaction });
      if (!company) {
        throw new Error('Company not found');
      }

      const existingMapping = await CompanyShareholderMapping.findOne({
        where: { ShareholderId, CompanyId },
        transaction,
      });
      if (existingMapping) {
        throw new Error('Shareholder already assigned to this company');
      }

      await CompanyShareholderMapping.create({
        ShareholderId,
        CompanyId,
        ShareholderName: shareholder.ShareholderName,
        ShareQt,
        ShareValue,
      }, { transaction });

      await company.update({
        NoOfShareholders: company.NoOfShareholders + 1,
        SubscribedShareQt: company.SubscribedShareQt + ShareQt,
      }, { transaction });

      await AuditLog.create({
        AuditLogId: uuidv4(),
        UserId: currentUserId,
        EntityType: 'Shareholder',
        EntityId: ShareholderId,
        Action: 'Assign to Company',
        Timestamp: new Date(),
      }, { transaction });

      await transaction.commit();
      return res.status(201).json({ message: 'Shareholder assigned successfully' });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Assign shareholder to company error:', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
      userId: currentUserId,
      validationErrors: error.errors?.map(e => ({ field: e.path, message: e.message })) || [],
    });
    return res.status(error.status || 500).json({
      message: error.message || 'Server error',
      validationErrors: error.errors?.map(e => ({ field: e.path, message: e.message })) || [],
    });
  }
};

export const getShareholderHistory = async (req, res, next) => {
  try {
    const { shareholderId } = req.params;
    const userId = req.user.userId;
    const isSuperAdmin = req.user.primaryRole === 'SuperAdmin';

    console.log('User details in getShareholderHistory:', req.user); // Debug log

    if (!uuidValidate(shareholderId)) {
      return res.status(400).json({ message: 'Invalid ShareholderId format' });
    }

    const shareholder = await Shareholder.findByPk(shareholderId);
    if (!shareholder) {
      return res.status(404).json({ message: 'Shareholder not found' });
    }

    if (!isSuperAdmin) {
      const mappings = await CompanyShareholderMapping.findAll({
        where: { ShareholderId: shareholderId },
      });
      const userCompanyIds = req.user.CompanyId ? [req.user.CompanyId] : [];
      const accessible = mappings.every((mapping) => userCompanyIds.includes(mapping.CompanyId));
      if (!accessible || mappings.length === 0) {
        return res.status(403).json({ message: 'Unauthorized to access this shareholder history' });
      }
    }

    const history = await AuditLog.findAll({
      where: {
        EntityId: shareholderId,
        EntityType: 'Shareholder',
      },
      include: [{ model: User, as: 'Actor', attributes: ['username'] }],
      order: [['Timestamp', 'DESC']],
    });

    const response = history.map((log) => ({
      HistoryId: log.AuditLogId,
      Action: log.Action,
      User: log.Actor?.username || 'Unknown',
      Timestamp: log.Timestamp,
    }));

    return res.status(200).json(response);
  } catch (error) {
    console.error('Get shareholder history error:', {
      message: error.message,
      stack: error.stack,
      shareholderId,
      userId: req.user.userId,
    });
    return res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};