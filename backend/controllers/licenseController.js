import License from '../models/licenseModel.js';
import Company from '../models/companyModel.js';
import AuditLog from '../models/auditLogModel.js';
import sequelize from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export const getAllLicenses = async (req, res) => {
  try {
    const licenses = await License.findAll({
      attributes: ['LicenseId', 'CompanyId', 'LicenseNo', 'Type', 'LicenseDate', 'ExpireDate', 'Status', 'CreatedDate', 'UpdatedDate'],
      include: [
        {
          model: Company,
          as: 'Company',
          attributes: ['CompanyName'],
        },
      ],
    });
    // Transform response to flatten CompanyName
    const formattedLicenses = licenses.map(license => ({
      ...license.toJSON(),
      CompanyName: license.Company?.CompanyName || 'N/A',
    }));
    res.status(200).json(formattedLicenses);
  } catch (error) {
    console.error('Get all licenses error:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to fetch licenses' });
  }
};

export const getLicenses = async (req, res) => {
  try {
    const { companyId } = req.params;
    const licenses = await License.findAll({
      where: { CompanyId: companyId },
      attributes: ['LicenseId', 'CompanyId', 'LicenseNo', 'Type', 'LicenseDate', 'ExpireDate', 'Status', 'CreatedDate', 'UpdatedDate'],
      include: [
        {
          model: Company,
          as: 'Company',
          attributes: ['CompanyName'],
        },
      ],
    });
    const formattedLicenses = licenses.map(license => ({
      ...license.toJSON(),
      CompanyName: license.Company?.CompanyName || 'N/A',
    }));
    res.status(200).json(formattedLicenses);
  } catch (error) {
    console.error('Get licenses error:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to fetch licenses' });
  }
};

export const getLicense = async (req, res) => {
  try {
    const { licenseId } = req.params;
    const license = await License.findByPk(licenseId, {
      attributes: ['LicenseId', 'CompanyId', 'LicenseNo', 'Type', 'LicenseDate', 'ExpireDate', 'Status', 'CreatedDate', 'UpdatedDate'],
      include: [
        {
          model: Company,
          as: 'Company',
          attributes: ['CompanyName'],
        },
      ],
    });
    if (!license) {
      return res.status(404).json({ error: 'License not found' });
    }
    const formattedLicense = {
      ...license.toJSON(),
      CompanyName: license.Company?.CompanyName || 'N/A',
    };
    res.status(200).json(formattedLicense);
  } catch (error) {
    console.error('Get license by ID error:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to fetch license' });
  }
};

export const createLicense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { CompanyId, LicenseNo, Type, LicenseDate, ExpireDate, Status } = req.body;
    const currentUserId = req.user.userId;

    // Validate required fields
    if (!CompanyId || !LicenseNo || !Type || !LicenseDate || !ExpireDate || !Status) {
      await t.rollback();
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate Status
    if (!['Active', 'Expired', 'Suspended'].includes(Status)) {
      await t.rollback();
      return res.status(400).json({ error: 'Invalid Status' });
    }

    // Check if Company exists
    const company = await Company.findByPk(CompanyId, { transaction: t });
    if (!company) {
      await t.rollback();
      return res.status(404).json({ error: 'Company not found' });
    }

    // Check if LicenseNo is unique
    const existingLicense = await License.findOne({ where: { LicenseNo }, transaction: t });
    if (existingLicense) {
      await t.rollback();
      return res.status(400).json({ error: 'License number already exists' });
    }

    const license = await License.create({
      LicenseId: uuidv4(),
      CompanyId,
      LicenseNo,
      Type,
      LicenseDate,
      ExpireDate,
      Status,
      CreatedByUserId: currentUserId,
      UpdatedByUserId: currentUserId,
      CreatedDate: new Date(),
      UpdatedDate: new Date(),
    }, { transaction: t });

    await AuditLog.create({
      Action: 'Create License',
      UserId: currentUserId,
      TargetId: license.LicenseId,
      EntityId: license.LicenseId,
      EntityType: 'License',
      Timestamp: new Date(),
      Details: JSON.stringify({ CompanyId, LicenseNo, Type, LicenseDate, ExpireDate, Status }),
    }, { transaction: t });

    await t.commit();
    res.status(201).json({ message: 'License created successfully', licenseId: license.LicenseId });
  } catch (error) {
    await t.rollback();
    console.error('Create license error:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to create license' });
  }
};

export const updateLicense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { licenseId } = req.params;
    const { CompanyId, LicenseNo, Type, LicenseDate, ExpireDate, Status } = req.body;
    const currentUserId = req.user.userId;

    // Validate required fields
    if (!CompanyId || !LicenseNo || !Type || !LicenseDate || !ExpireDate || !Status) {
      await t.rollback();
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate Status
    if (!['Active', 'Expired', 'Suspended'].includes(Status)) {
      await t.rollback();
      return res.status(400).json({ error: 'Invalid Status' });
    }

    const license = await License.findByPk(licenseId, { transaction: t });
    if (!license) {
      await t.rollback();
      return res.status(404).json({ error: 'License not found' });
    }

    // Check if Company exists
    const company = await Company.findByPk(CompanyId, { transaction: t });
    if (!company) {
      await t.rollback();
      return res.status(404).json({ error: 'Company not found' });
    }

    // Check if LicenseNo is unique (excluding current license)
    if (LicenseNo !== license.LicenseNo) {
      const existingLicense = await License.findOne({ where: { LicenseNo }, transaction: t });
      if (existingLicense) {
        await t.rollback();
        return res.status(400).json({ error: 'License number already exists' });
      }
    }

    const oldData = {
      CompanyId: license.CompanyId,
      LicenseNo: license.LicenseNo,
      Type: license.Type,
      LicenseDate: license.LicenseDate,
      ExpireDate: license.ExpireDate,
      Status: license.Status,
    };

    await license.update({
      CompanyId,
      LicenseNo,
      Type,
      LicenseDate,
      ExpireDate,
      Status,
      UpdatedByUserId: currentUserId,
      UpdatedDate: new Date(),
    }, { transaction: t });

    await AuditLog.create({
      Action: 'Update License',
      UserId: currentUserId,
      TargetId: licenseId,
      EntityId: licenseId,
      EntityType: 'License',
      Timestamp: new Date(),
      Details: JSON.stringify({ old: oldData, new: { CompanyId, LicenseNo, Type, LicenseDate, ExpireDate, Status } }),
    }, { transaction: t });

    await t.commit();
    res.status(200).json({ message: 'License updated successfully' });
  } catch (error) {
    await t.rollback();
    console.error('Update license error:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to update license' });
  }
};

export const deleteLicense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { licenseId } = req.params;
    const currentUserId = req.user.userId;

    const license = await License.findByPk(licenseId, { transaction: t });
    if (!license) {
      await t.rollback();
      return res.status(404).json({ error: 'License not found' });
    }

    const licenseData = {
      CompanyId: license.CompanyId,
      LicenseNo: license.LicenseNo,
      Type: license.Type,
      LicenseDate: license.LicenseDate,
      ExpireDate: license.ExpireDate,
      Status: license.Status,
    };

    await license.destroy({ transaction: t });

    await AuditLog.create({
      Action: 'Delete License',
      UserId: currentUserId,
      TargetId: licenseId,
      EntityId: licenseId,
      EntityType: 'License',
      Timestamp: new Date(),
      Details: JSON.stringify({ deleted: licenseData }),
    }, { transaction: t });

    await t.commit();
    res.status(200).json({ message: 'License deleted successfully' });
  } catch (error) {
    await t.rollback();
    console.error('Delete license error:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to delete license' });
  }
};