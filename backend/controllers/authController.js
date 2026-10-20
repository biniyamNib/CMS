import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database.js';
import User from '../models/userModel.js';
import Role from '../models/roleModel.js';
import UserRoleMapping from '../models/userRoleMappingModel.js';
import AuditLog from '../models/auditLogModel.js';
import UserCompany from '../models/userCompanyModel.js';
import Company from '../models/companyModel.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const user = await User.findOne({
      where: { email, status: { [Op.ne]: 'Inactive' } },
      include: [
        {
          model: Role,
          as: 'PrimaryRole',
          attributes: ['RoleName'],
        },
        {
          model: Role,
          as: 'Roles',
          through: { model: UserRoleMapping, attributes: [] },
          attributes: ['RoleName'],
        },
        {
          model: Company,
          as: 'Companies',
          through: { model: UserCompany, attributes: [] },
          attributes: ['CompanyId'],
        },
      ],
    });

    if (!user) {
      await AuditLog.create({
        Action: 'Failed Login Attempt',
        EntityType: 'User',
        Timestamp: new Date(),
        Details: JSON.stringify({ email, reason: 'User not found' }),
      });
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await AuditLog.create({
        Action: 'Failed Login Attempt',
        UserId: user.userId,
        EntityType: 'User',
        EntityId: user.userId,
        Timestamp: new Date(),
        Details: JSON.stringify({ email, reason: 'Invalid password' }),
      });
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.userId },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      user: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        primaryRole: user.PrimaryRole?.RoleName || user.Roles[0]?.RoleName,
        roles: user.Roles.map(r => r.RoleName),
        CompanyId: user.Companies[0]?.CompanyId || null,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to login' });
  }
};

export const register = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      firstName, lastName, email, password, companyName, tin, registrationNumber,
      type, industry, fiscalYearStart, parentCompanyId, topPosition, phone, companyEmail,
      streetAddress, city, state, country, postalCode, noOfShareholders,
      registeredCapital, subscribedCapital, registeredShareQt, subscribedShareQt, shareValue
    } = req.body;
    const logoFile = req.file ? req.file.path : null;

    if (!firstName || !lastName || !email || !password || !companyName || !tin || !registrationNumber) {
      await t.rollback();
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const existingUser = await User.findOne({ where: { email }, transaction: t });
    if (existingUser) {
      await t.rollback();
      return res.status(400).json({ error: 'Email already exists' });
    }

    const existingCompany = await Company.findOne({
      where: {
        [Op.or]: [{ TinNo: tin }, { RegistrationNo: registrationNumber }],
      },
      transaction: t,
    });
    if (existingCompany) {
      await t.rollback();
      return res.status(400).json({ error: 'TIN or Registration Number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const companyId = uuidv4();

    const targetRole = await Role.findOne({ where: { RoleName: 'Admin' }, transaction: t });
    if (!targetRole) {
      await t.rollback();
      return res.status(400).json({ error: 'Admin role not found' });
    }

    // Create user with firstName and lastName
    const user = await User.create({
      userId,
      firstName, // Add this
      lastName,  // Add this
      username: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      RoleId: targetRole.RoleId,
      status: 'Active',
      verified: false,
    }, { transaction: t });

    // Create company - check if your Company model uses 'CompanyName' or 'Name'
    await Company.create({
      CompanyId: companyId,
      CompanyName: companyName, // Changed from Name to CompanyName if that's what your model expects
      Type: type,
      Industry: industry,
      FiscalYearStart: fiscalYearStart, // Changed from EstablishedDate if that's what your model expects
      TinNo: tin,
      RegistrationNo: registrationNumber,
      Logo: logoFile,
      NoOfShareholders: parseInt(noOfShareholders) || 0,
      RegisteredCapital: parseFloat(registeredCapital) || 0,
      SubscribedCapital: parseFloat(subscribedCapital) || 0,
      RegisteredShareQt: parseInt(registeredShareQt) || 0,
      SubscribedShareQt: parseInt(subscribedShareQt) || 0,
      ShareValue: parseFloat(shareValue) || 0,
      // Add other required fields for Company model
      Phone: phone,
      Email: companyEmail,
      Address: `${streetAddress}, ${city}${state ? `, ${state}` : ''}, ${country}, ${postalCode}`,
      TopPosition: topPosition,
      ParentCompanyId: parentCompanyId || null,
    }, { transaction: t });

    await UserCompany.create({
      UserId: userId,
      CompanyId: companyId,
    }, { transaction: t });

    await UserRoleMapping.create({
      UserId: userId,
      RoleId: targetRole.RoleId,
    }, { transaction: t });

    await AuditLog.create({
      Action: 'Register User and Company',
      UserId: userId,
      EntityType: 'User and Company',
      EntityId: userId,
      Timestamp: new Date(),
      Details: JSON.stringify({ email, companyName, role: 'Admin', userId, companyId }),
    }, { transaction: t });

    const token = jwt.sign(
      { userId, email, primaryRole: 'Admin', roles: ['Admin'] },
      process.env.JWT_SECRET,
      { expiresIn: '90d' }
    );

    await t.commit();
    res.status(201).json({
      token,
      user: { 
        userId, 
        firstName, 
        lastName, 
        email, 
        primaryRole: 'Admin', 
        roles: ['Admin'] 
      },
      message: 'Registration successful. You can now log in.',
    });
  } catch (error) {
    await t.rollback();
    console.error('Register error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });
    let errorMessage = 'Failed to register';
    if (error.name === 'SequelizeUniqueConstraintError') {
      errorMessage = 'Email, TIN, or registration number already exists';
    } else if (error.name === 'SequelizeValidationError') {
      errorMessage = error.errors.map((e) => e.message).join(', ');
    } else if (error.message) {
      errorMessage = error.message;
    }
    res.status(400).json({ error: errorMessage });
  }
};

export const createInvitations = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const invitations = req.body;
    const userId = req.user.userId;

    for (const { email, role, companyId, shareholderId } of invitations) {
      if (!email || !role || !companyId) {
        await t.rollback();
        return res.status(400).json({ error: 'Email, role, and companyId are required' });
      }
      const invitationId = uuidv4();
      const token = uuidv4();
      await sequelize.models.Invitation.create({
        id: invitationId,
        email,
        companyId,
        roleId: role === 'hr' ? 'role_hr' : 'role_shareholder',
        shareholderId,
        token,
        status: 'Pending',
        created_by: userId,
      }, { transaction: t });

      await AuditLog.create({
        Action: 'Create Invitation',
        UserId: userId,
        EntityType: 'Invitation',
        EntityId: invitationId,
        Timestamp: new Date(),
        Details: JSON.stringify({ email, role, companyId, shareholderId }),
      }, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ message: 'Invitations sent successfully' });
  } catch (error) {
    await t.rollback();
    console.error('Create invitations error:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to send invitations' });
  }
};