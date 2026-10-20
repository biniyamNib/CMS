import Company from '../models/companyModel.js';
import UserCompany from '../models/userCompanyModel.js';
import AuditLog from '../models/auditLogModel.js';
import License from '../models/licenseModel.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getCompanies = async (req, res) => {
  try {
    const userId = req.user.userId;
    // const isSuperAdmin = req.user.role === 'SuperAdmin';
    const isSuperAdmin = req.user.primaryRole === 'SuperAdmin' || req.user.roles?.includes('SuperAdmin');

    let companies;
    if (isSuperAdmin) {
      companies = await Company.findAll({
        include: [
          { model: Company, as: 'SubCompanies' },
          { model: Company, as: 'ParentCompany' },
        ],
      });
    } else {
      companies = await Company.findAll({
        include: [
          { model: Company, as: 'SubCompanies' },
          { model: Company, as: 'ParentCompany' },
          {
            model: UserCompany,
            where: { UserId: userId },
            attributes: [],
          },
        ],
      });
    }

    console.log('Fetched companies:', companies);
    res.status(200).json(companies);
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
};

export const createCompany = async (req, res) => {
  try {
    const {
      CompanyId,
      CompanyName,
      TopPosition,
      Type,
      EstablishedDate,
      TinNo,
      RegistrationNo,
      NoOfShareholders,
      RegisteredCapital,
      SubscribedCapital,
      RegisteredShareQt,
      SubscribedShareQt,
      ShareValue,
      Address,
      Phone,
      Email,
    } = req.body;
    const userId = req.user.userId;
    const isSuperAdmin = req.user.role === 'SuperAdmin';

    if (!isSuperAdmin) {
      return res.status(403).json({ error: 'Only SuperAdmin can create top-level companies' });
    }

    // Validate and parse EstablishedDate
    let parsedDate = null;
    if (EstablishedDate && EstablishedDate !== '') {
      parsedDate = new Date(EstablishedDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid EstablishedDate format' });
      }
    }

    // Handle logo upload
    let logoPath = null;
    if (req.file) {
      logoPath = `/Uploads/${req.file.filename}`;
    }

    const company = await Company.create({
      CompanyId,
      CompanyName,
      TopPosition,
      Type,
      EstablishedDate: parsedDate,
      TinNo,
      Logo: logoPath,
      RegistrationNo,
      NoOfShareholders: parseInt(NoOfShareholders) || 0,
      RegisteredCapital: parseFloat(RegisteredCapital) || 0,
      SubscribedCapital: parseFloat(SubscribedCapital) || 0,
      RegisteredShareQt: parseInt(RegisteredShareQt) || null,
      SubscribedShareQt: parseInt(SubscribedShareQt) || null,
      ShareValue: parseFloat(ShareValue) || null,
      Address,
      Phone,
      Email,
    });

    await UserCompany.create({ UserId: userId, CompanyId: company.CompanyId });

    await AuditLog.create({
      Action: 'CREATE',
      EntityId: company.CompanyId,
      EntityType: 'Company',
      UserId: userId,
      Details: JSON.stringify({
        new: {
          CompanyId,
          CompanyName,
          TopPosition,
          Type,
          EstablishedDate: parsedDate,
          TinNo,
          Logo: logoPath,
          RegistrationNo,
          NoOfShareholders,
          RegisteredCapital,
          SubscribedCapital,
          RegisteredShareQt,
          SubscribedShareQt,
          ShareValue,
          Address,
          Phone,
          Email,
        },
      }),
    });

    res.status(201).json(company);
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({
      error: 'Failed to create company',
      details: error.message,
    });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const {
      CompanyName,
      TopPosition,
      Type,
      EstablishedDate,
      TinNo,
      RegistrationNo,
      NoOfShareholders,
      RegisteredCapital,
      SubscribedCapital,
      RegisteredShareQt,
      SubscribedShareQt,
      ShareValue,
      Address,
      Phone,
      Email,
    } = req.body;
    const userId = req.user.userId;
    const isSuperAdmin = req.user.role === 'SuperAdmin';

    const company = await Company.findByPk(companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    if (!isSuperAdmin) {
      const userCompany = await UserCompany.findOne({
        where: { UserId: userId, CompanyId: companyId },
      });
      if (!userCompany) {
        return res.status(403).json({ error: 'Unauthorized to update this company' });
      }
    }

    // Handle logo upload
    let logoPath = company.Logo;
    if (req.file) {
      if (company.Logo) {
        const oldPath = path.join(__dirname, '../public', company.Logo);
        try {
          await fs.access(oldPath);
          await fs.unlink(oldPath);
        } catch (err) {
          console.warn(`Failed to delete old logo at ${oldPath}: ${err.message}`);
        }
      }
      logoPath = `/Uploads/${req.file.filename}`;
    }

    // Validate and parse EstablishedDate
    let parsedDate = company.EstablishedDate;
    if (EstablishedDate && EstablishedDate !== '') {
      parsedDate = new Date(EstablishedDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid EstablishedDate format' });
      }
    } else if (EstablishedDate === '') {
      parsedDate = null;
    }

    const oldData = { ...company.dataValues };
    await company.update({
      CompanyName,
      TopPosition,
      Type,
      EstablishedDate: parsedDate,
      TinNo,
      Logo: logoPath,
      RegistrationNo,
      NoOfShareholders: parseInt(NoOfShareholders) || 0,
      RegisteredCapital: parseFloat(RegisteredCapital) || 0,
      SubscribedCapital: parseFloat(SubscribedCapital) || 0,
      RegisteredShareQt: parseInt(RegisteredShareQt) || null,
      SubscribedShareQt: parseInt(SubscribedShareQt) || null,
      ShareValue: parseFloat(ShareValue) || null,
      Address,
      Phone,
      Email,
    });

    await AuditLog.create({
      Action: 'UPDATE',
      EntityId: companyId,
      EntityType: 'Company',
      UserId: userId,
      Details: JSON.stringify({
        old: oldData,
        new: {
          CompanyName,
          TopPosition,
          Type,
          EstablishedDate: parsedDate,
          TinNo,
          Logo: logoPath,
          RegistrationNo,
          NoOfShareholders,
          RegisteredCapital,
          SubscribedCapital,
          RegisteredShareQt,
          SubscribedShareQt,
          ShareValue,
          Address,
          Phone,
          Email,
        },
      }),
    });

    res.status(200).json(company);
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({ error: 'Failed to update company' });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const userId = req.user.userId;
    const isSuperAdmin = req.user.role === 'SuperAdmin';

    const company = await Company.findByPk(companyId, {
      include: [
        { model: Company, as: 'SubCompanies' },
        { model: UserCompany, as: 'UserCompanies' },
        { model: License, as: 'Licenses' },
      ],
    });

    if (!company) {
      return res.status(404).json({ 
        error: 'Company not found',
        details: `No company found with ID ${companyId}`
      });
    }

    if (!isSuperAdmin) {
      const userCompany = await UserCompany.findOne({
        where: { UserId: userId, CompanyId: companyId },
      });
      if (!userCompany) {
        return res.status(403).json({ 
          error: 'Unauthorized', 
          details: 'You are not authorized to delete this company' 
        });
      }
    }

    // Check for sub-companies
    if (company.SubCompanies && company.SubCompanies.length > 0) {
      const subCompanyNames = company.SubCompanies.map(sub => sub.CompanyName).join(', ');
      return res.status(400).json({
        error: 'Cannot delete company with sub-companies',
        details: `This company has ${company.SubCompanies.length} sub-companies: ${subCompanyNames}. Please delete them first.`,
        subCompaniesCount: company.SubCompanies.length,
        subCompanies: company.SubCompanies.map(sub => ({
          id: sub.CompanyId,
          name: sub.CompanyName
        }))
      });
    }

    // Check for licenses
    if (company.Licenses && company.Licenses.length > 0) {
      const licenseNames = company.Licenses.map(license => license.LicenseName).join(', ');
      return res.status(400).json({
        error: 'Cannot delete company with licenses',
        details: `This company has ${company.Licenses.length} licenses: ${licenseNames}. Please delete them first.`,
        licensesCount: company.Licenses.length,
        licenses: company.Licenses.map(license => ({
          id: license.LicenseId,
          name: license.LicenseName
        }))
      });
    }

    // Rest of the delete logic...
    const companyData = company.get({ plain: true });

    // Delete logo file if it exists
    if (company.Logo) {
      const logoPath = path.join(__dirname, '../public', company.Logo);
      try {
        await fs.access(logoPath);
        await fs.unlink(logoPath);
      } catch (err) {
        console.warn(`Failed to delete logo at ${logoPath}: ${err.message}`);
      }
    }

    await UserCompany.destroy({
      where: { CompanyId: companyId },
    });

    await company.destroy();

    await AuditLog.create({
      Action: 'DELETE',
      EntityId: companyId,
      EntityType: 'Company',
      UserId: userId,
      Details: JSON.stringify({
        deleted: companyData,
      }),
    });

    res.status(200).json({
      message: 'Company deleted successfully',
      deletedCompanyId: companyId,
      deletedCompanyName: company.CompanyName
    });
  } catch (error) {
    console.error('Delete company error:', error);
    let errorMessage = 'Failed to delete company';
    let details = error.message;
    
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      errorMessage = 'Cannot delete company due to database constraints';
      details = 'This company is referenced by other records in the database';
    }

    res.status(500).json({
      error: errorMessage,
      details: details,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


export const createSubCompany = async (req, res) => {
  try {
    const { parentCompanyId } = req.params;
    const {
      companyName,
      topPosition,
      type,
      establishedDate,
      tinNo,
      registrationNo,
      noOfShareholders,
      registeredCapital,
      subscribedCapital,
      registeredShareQt,
      subscribedShareQt,
      shareValue,
      address,
      phone,
      email,
    } = req.body;
    const userId = req.user.userId;
    const isSuperAdmin = req.user.role === 'SuperAdmin';

    if (!companyName || !topPosition || !type || !registrationNo) {
      return res.status(400).json({
        error: 'Company name, top position, type, and registration number are required',
      });
    }

    const parentCompany = await Company.findByPk(parentCompanyId);
    if (!parentCompany) {
      return res.status(404).json({ error: 'Parent company not found' });
    }

    if (!isSuperAdmin) {
      const userCompany = await UserCompany.findOne({
        where: { UserId: userId, CompanyId: parentCompanyId },
      });
      if (!userCompany) {
        return res.status(403).json({ error: 'Unauthorized to create sub-company' });
      }
    }

    // Handle logo upload
    let logoPath = null;
    if (req.file) {
      logoPath = `/Uploads/${req.file.filename}`;
    }

    // Validate and parse establishedDate
    let parsedDate = null;
    if (establishedDate && establishedDate !== '') {
      parsedDate = new Date(establishedDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid establishedDate format' });
      }
    }

    const subCompany = await Company.create({
      CompanyName: companyName,
      TopPosition: topPosition,
      Type: type,
      EstablishedDate: parsedDate,
      TinNo: tinNo,
      Logo: logoPath,
      RegistrationNo: registrationNo,
      NoOfShareholders: parseInt(noOfShareholders) || 0,
      RegisteredCapital: parseFloat(registeredCapital) || 0,
      SubscribedCapital: parseFloat(subscribedCapital) || 0,
      RegisteredShareQt: parseInt(registeredShareQt) || null,
      SubscribedShareQt: parseInt(subscribedShareQt) || null,
      ShareValue: parseFloat(shareValue) || null,
      Address: address,
      Phone: phone,
      Email: email,
      ParentCompanyId: parentCompanyId,
    });

    await UserCompany.create({ UserId: userId, CompanyId: subCompany.CompanyId });

    await AuditLog.create({
      Action: 'CREATE',
      EntityId: subCompany.CompanyId,
      EntityType: 'Company',
      UserId: userId,
      Details: JSON.stringify({
        new: {
          companyName,
          topPosition,
          type,
          establishedDate: parsedDate,
          tinNo,
          logo: logoPath,
          registrationNo,
          noOfShareholders,
          registeredCapital,
          subscribedCapital,
          registeredShareQt,
          subscribedShareQt,
          shareValue,
          address,
          phone,
          email,
          parentCompanyId,
        },
      }),
    });

    res.status(201).json(subCompany);
  } catch (error) {
    console.error('Create sub-company error:', error);
    let errorMessage = 'Failed to create sub-company';
    if (error.name === 'SequelizeUniqueConstraintError') {
      errorMessage = 'Registration number or TIN already exists';
    } else if (error.name === 'SequelizeValidationError') {
      errorMessage = error.errors.map((e) => e.message).join(', ');
    }
    res.status(500).json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};


export const getAuditLogs = async (req, res) => {
  try {
    const { companyId } = req.params;
    const userId = req.user.userId;
    const isSuperAdmin = req.user.role === 'SuperAdmin';

    if (!isSuperAdmin) {
      const userCompany = await UserCompany.findOne({
        where: { UserId: userId, CompanyId: companyId },
      });
      if (!userCompany) {
        return res.status(403).json({ error: 'Unauthorized to view audit logs' });
      }
    }

    const logs = await AuditLog.findAll({
      where: { EntityId: companyId, EntityType: 'Company' },
      include: [{ model: User, as: 'Actor', attributes: ['username'] }],
      order: [['Timestamp', 'DESC']],
    });

    res.status(200).json(logs);
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
};
