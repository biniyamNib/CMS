import User from "../models/userModel.js";
import Role from "../models/roleModel.js";
import UserRoleMapping from "../models/userRoleMappingModel.js";
import UserCompany from "../models/userCompanyModel.js";
import AuditLog from "../models/auditLogModel.js";
import Company from "../models/companyModel.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';
import sequelize from "../config/database.js";

export const getUsers = async (req, res) => {
  try {
    const isSuperAdmin = req.user.primaryRole === 'SuperAdmin';
    const companyId = req.user.CompanyId;

    const include = [
      {
        model: Role,
        as: 'PrimaryRole',
        attributes: ['RoleName'],
        required: false,
      },
      {
        model: Role,
        as: 'Roles',
        through: { model: UserRoleMapping, attributes: [] },
        attributes: ['RoleName'],
        required: false,
      },
      {
        model: Company,
        as: 'Companies',
        through: { model: UserCompany, attributes: [] },
        attributes: ['CompanyId', 'CompanyName'],
        required: false,
      },
    ];

    const where = isSuperAdmin ? {} : {
      '$Companies.CompanyId$': companyId,
    };

    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include,
      where,
    });

    const formattedUsers = users.map(user => ({
      ...user.toJSON(),
      primaryRole: user.PrimaryRole?.RoleName || user.Roles[0]?.RoleName || null,
      roles: user.Roles.map(role => role.RoleName),
      companies: user.Companies.map(company => company.CompanyName).join(', ') || 'None',
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error('Get users error:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const isSuperAdmin = req.user.primaryRole === 'SuperAdmin';
    const companyId = req.user.CompanyId;

    const include = [
      {
        model: Role,
        as: 'PrimaryRole',
        attributes: ['RoleName'],
        required: false,
      },
      {
        model: Role,
        as: 'Roles',
        through: { model: UserRoleMapping, attributes: [] },
        attributes: ['RoleName'],
        required: false,
      },
      {
        model: Company,
        as: 'Companies',
        through: { model: UserCompany, attributes: [] },
        attributes: ['CompanyId', 'CompanyName'],
        required: false,
      },
    ];

    const where = isSuperAdmin ? { userId: id } : {
      userId: id,
      '$Companies.CompanyId$': companyId,
    };

    const user = await User.findOne({
      attributes: { exclude: ['password'] },
      include,
      where,
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found or not in your company' });
    }

    const formattedUser = {
      ...user.toJSON(),
      primaryRole: user.PrimaryRole?.RoleName || user.Roles[0]?.RoleName || null,
      roles: user.Roles.map(role => role.RoleName),
      companies: user.Companies.map(company => company.CompanyName).join(', ') || 'None',
    };

    res.status(200).json(formattedUser);
  } catch (error) {
    console.error('Get user error:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const createUser = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { firstName, lastName, username, email, password, RoleId, Status, companies } = req.body;
    const currentUserId = req.user.userId;
    const companyId = req.user.CompanyId;
    const isSuperAdmin = req.user.primaryRole === 'SuperAdmin';

    if (!firstName || !lastName || !username || !email || !password || !RoleId || !Status) {
      await t.rollback();
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const existingUser = await User.findOne({ where: { email }, transaction: t });
    if (existingUser) {
      await t.rollback();
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const user = await User.create({
      userId,
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      RoleId,
      status: Status,
    }, { transaction: t });

    await UserRoleMapping.create({
      UserId: userId,
      RoleId,
    }, { transaction: t });

    const companyIds = isSuperAdmin ? (companies || []) : [companyId];
    for (const compId of companyIds) {
      await UserCompany.create({
        UserId: userId,
        CompanyId: compId,
        Status: 'Active',
      }, { transaction: t });
    }

    await AuditLog.create({
      Action: 'Create User',
      UserId: currentUserId,
      EntityType: 'User',
      EntityId: userId,
      Timestamp: new Date(),
      Details: JSON.stringify({ firstName, lastName, username, email, RoleId, Status, companyIds }),
    }, { transaction: t });

    await t.commit();
    res.status(201).json({ message: 'User created successfully', userId });
  } catch (error) {
    await t.rollback();
    console.error('Create user error:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const updateUser = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { firstName, lastName, username, email, RoleId, status, enable2FA, companies } = req.body;
    const profilePic = req.file ? req.file.buffer : null;
    const currentUserId = req.user.userId;
    const companyId = req.user.CompanyId;
    const isSuperAdmin = req.user.primaryRole === 'SuperAdmin';

    const user = await User.findByPk(id, { transaction: t });
    if (!user) {
      await t.rollback();
      return res.status(404).json({ error: 'User not found' });
    }

    if (!isSuperAdmin) {
      const userCompany = await UserCompany.findOne({
        where: { UserId: id, CompanyId: companyId },
        transaction: t,
      });
      if (!userCompany) {
        await t.rollback();
        return res.status(403).json({ error: 'Not authorized to update this user' });
      }
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (RoleId) updateData.RoleId = RoleId;
    if (status) updateData.status = status;
    if (profilePic) updateData.profilePic = profilePic;
    if (enable2FA !== undefined) updateData.twoFactorSecret = enable2FA ? 'some-secret' : null;

    await user.update(updateData, { transaction: t });

    if (RoleId) {
      await UserRoleMapping.update(
        { RoleId },
        { where: { UserId: id }, transaction: t }
      );
    }

    if (isSuperAdmin && companies) {
      await UserCompany.destroy({ where: { UserId: id }, transaction: t });
      for (const compId of companies) {
        await UserCompany.create({
          UserId: id,
          CompanyId: compId,
          Status: 'Active',
        }, { transaction: t });
      }
    }

    await AuditLog.create({
      Action: 'Update User',
      UserId: currentUserId,
      EntityType: 'User',
      EntityId: id,
      Timestamp: new Date(),
      Details: JSON.stringify({ firstName, lastName, username, email, RoleId, status, enable2FA, companies }),
    }, { transaction: t });

    await t.commit();
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    await t.rollback();
    console.error('Update user error:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const currentUserId = req.user.userId;
    const companyId = req.user.CompanyId;
    const isSuperAdmin = req.user.primaryRole === 'SuperAdmin';

    const user = await User.findByPk(id, { transaction: t });
    if (!user) {
      await t.rollback();
      return res.status(404).json({ error: 'User not found' });
    }

    if (!isSuperAdmin) {
      const userCompany = await UserCompany.findOne({
        where: { UserId: id, CompanyId: companyId },
        transaction: t,
      });
      if (!userCompany) {
        await t.rollback();
        return res.status(403).json({ error: 'Not authorized to delete this user' });
      }
    }

    await user.destroy({ transaction: t });

    await AuditLog.create({
      Action: 'Delete User',
      UserId: currentUserId,
      EntityType: 'User',
      EntityId: id,
      Timestamp: new Date(),
      Details: JSON.stringify({ deletedUserId: id }),
    }, { transaction: t });

    await t.commit();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    await t.rollback();
    console.error('Delete user error:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

export const assignUserToCompany = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { userId, companyId, role } = req.body;
    const currentUserId = req.user.userId;

    const user = await User.findByPk(userId, { transaction: t });
    const company = await Company.findByPk(companyId, { transaction: t });
    if (!user || !company) {
      await t.rollback();
      return res.status(404).json({ error: 'User or company not found' });
    }

    const existingMapping = await UserCompany.findOne({
      where: { UserId: userId, CompanyId: companyId },
      transaction: t,
    });
    if (existingMapping) {
      await t.rollback();
      return res.status(400).json({ error: 'User is already assigned to this company' });
    }

    const mapping = await UserCompany.create({
      UserId: userId,
      CompanyId: companyId,
      Status: 'Active',
    }, { transaction: t });

    await AuditLog.create({
      Action: 'Assign User to Company',
      UserId: currentUserId,
      EntityType: 'Company',
      EntityId: companyId,
      Timestamp: new Date(),
      Details: JSON.stringify({ userId, companyId, role: role || 'Member' }),
    }, { transaction: t });

    await t.commit();
    res.status(201).json({ message: 'User assigned to company', mapping });
  } catch (error) {
    await t.rollback();
    console.error('Assign user to company error:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to assign user to company' });
  }
};

export const getUserCompanies = async (req, res) => {
  try {
    const { id } = req.params;
    const mappings = await UserCompany.findAll({
      where: { UserId: id },
      include: [
        {
          model: Company,
          attributes: ['CompanyId', 'CompanyName'],
        },
      ],
    });
    const formattedMappings = mappings.map(mapping => ({
      CompanyId: mapping.CompanyId,
      CompanyName: mapping.Company?.CompanyName,
    }));
    res.status(200).json(formattedMappings);
  } catch (error) {
    console.error('Get user companies error:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to fetch user companies' });
  }
};