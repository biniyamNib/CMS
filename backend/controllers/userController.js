// import User from "../models/userModel.js";
// import Role from "../models/roleModel.js";
// import UserRoleMapping from "../models/userRoleMappingModel.js";
// import UserCompany from "../models/userCompanyModel.js";
// import AuditLog from "../models/auditLogModel.js";
// import Company from "../models/companyModel.js";
// import bcrypt from "bcryptjs";
// import { v4 as uuidv4 } from 'uuid';
// import sequelize from "../config/database.js";
// // import path from 'path';
// // import fs from 'fs';
// // import { fileURLToPath } from 'url';

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// export const getUsers = async (req, res) => {
//   try {
//     const users = await User.findAll({
//       attributes: { exclude: ['password'] },
//       include: [
//         {
//           model: Role,
//           as: 'PrimaryRole',
//           attributes: ['RoleName'],
//           required: false,
//         },
//         {
//           model: Role,
//           as: 'Roles',
//           through: { model: UserRoleMapping, attributes: [] },
//           attributes: ['RoleName'],
//           required: false,
//         },
//       ],
//     });

//     // Transform response to include primaryRole and roles
//     const formattedUsers = users.map(user => ({
//       ...user.toJSON(),
//       primaryRole: user.PrimaryRole?.RoleName || user.Roles[0]?.RoleName || null,
//       roles: user.Roles.map(role => role.RoleName),
//     }));

//     res.status(200).json(formattedUsers);
//   } catch (error) {
//     console.error('Get users error:', { message: error.message, stack: error.stack });
//     res.status(500).json({ error: 'Failed to fetch users' });
//   }
// };

// export const getUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findByPk(id, {
//       attributes: { exclude: ['password'] },
//       include: [
//         {
//           model: Role,
//           as: 'PrimaryRole',
//           attributes: ['RoleName'],
//           required: false,
//         },
//         {
//           model: Role,
//           as: 'Roles',
//           through: { model: UserRoleMapping, attributes: [] },
//           attributes: ['RoleName'],
//           required: false,
//         },
//       ],
//     });

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Transform response to include primaryRole and roles
//     const formattedUser = {
//       ...user.toJSON(),
//       primaryRole: user.PrimaryRole?.RoleName || user.Roles[0]?.RoleName || null,
//       roles: user.Roles.map(role => role.RoleName),
//     };

//     res.status(200).json(formattedUser);
//   } catch (error) {
//     console.error('Get user by ID error:', { message: error.message, stack: error.stack });
//     res.status(500).json({ error: 'Failed to fetch user' });
//   }
// };

// export const createUser = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const { username, email, password, RoleId, status } = req.body;
//     const currentUserId = req.user.userId;

//     // Validate required fields
//     if (!username || !email || !password || !RoleId) {
//       await t.rollback();
//       return res.status(400).json({ error: 'Username, email, password, and RoleId are required' });
//     }

//     const existingUser = await User.findOne({ where: { email }, transaction: t });
//     if (existingUser) {
//       await t.rollback();
//       return res.status(400).json({ error: 'Email already exists' });
//     }

//     const role = await Role.findByPk(RoleId, { transaction: t });
//     if (!role) {
//       await t.rollback();
//       return res.status(400).json({ error: 'Invalid RoleId' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       userId: uuidv4(),
//       username,
//       email,
//       password: hashedPassword,
//       IsPasswordChanged: false,
//       RoleId,
//       WhoUpdateUserId: currentUserId,
//       createdDate: new Date(),
//       updatedDate: new Date(),
//       status: status || 'Active',
//     }, { transaction: t });

//     await UserRoleMapping.create({
//       UserId: user.userId,
//       RoleId,
//       AssignedDate: new Date(),
//       Status: 'Active',
//     }, { transaction: t });

//     await AuditLog.create({
//       Action: 'Create User',
//       UserId: currentUserId,
//       TargetId: user.userId,
//       EntityId: user.userId,
//       EntityType: 'User',
//       Timestamp: new Date(),
//       Details: JSON.stringify({ username, email, RoleId, status }),
//     }, { transaction: t });

//     await t.commit();
//     res.status(201).json({ message: 'User created successfully', userId: user.userId });
//   } catch (error) {
//     await t.rollback();
//     console.error('Create user error:', { message: error.message, stack: error.stack });
//     res.status(500).json({ error: 'Failed to create user' });
//   }
// };

// export const updateUser = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const { id } = req.params;
//     const { username, email, status, RoleId, password } = req.body;
//     const currentUserId = req.user.userId;

//     // Debug: Log entire req.body and password specifically
//     console.log('Received updateUser request:', {
//       id,
//       body: req.body,
//       password: req.body.password,
//       hasFile: !!req.file,
//     });

//     let profilePicUrl = '';
//     if (req.file) {
//       console.log('Processing file upload:', {
//         mimetype: req.file.mimetype,
//         size: req.file.size,
//       });
//       const fileBuffer = req.file.buffer;
//       const base64Image = fileBuffer.toString('base64');
//       profilePicUrl = `data:${req.file.mimetype};base64,${base64Image}`;
//     }

//     const user = await User.findByPk(id, { transaction: t });
//     if (!user) {
//       await t.rollback();
//       console.log('User not found:', { id });
//       return res.status(404).json({ error: 'User not found' });
//     }

//     if (email && email !== user.email) {
//       const existingUser = await User.findOne({ where: { email }, transaction: t });
//       if (existingUser) {
//         await t.rollback();
//         console.log('Email already exists:', { email });
//         return res.status(400).json({ error: 'Email already exists' });
//       }
//     }

//     if (RoleId && RoleId !== user.RoleId) {
//       console.log('Updating RoleId:', { oldRoleId: user.RoleId, newRoleId: RoleId });
//       const role = await Role.findByPk(RoleId, { transaction: t });
//       if (!role) {
//         await t.rollback();
//         console.log('Invalid RoleId:', { RoleId });
//         return res.status(400).json({ error: 'Invalid RoleId' });
//       }
//       await UserRoleMapping.update(
//         { Status: 'Inactive' },
//         { where: { UserId: id, Status: 'Active' }, transaction: t }
//       );
//       await UserRoleMapping.create({
//         UserId: id,
//         RoleId,
//         AssignedDate: new Date(),
//         Status: 'Active',
//       }, { transaction: t });
//     }

//     const oldData = {
//       username: user.username,
//       email: user.email,
//       status: user.status,
//       profilePic: user.profilePic,
//       RoleId: user.RoleId,
//     };

//     const updateData = {
//       WhoUpdateUserId: currentUserId,
//       updatedDate: new Date(),
//     };

//     if (username) updateData.username = username;
//     if (email) updateData.email = email;
//     if (status) updateData.status = status;
//     if (profilePicUrl) updateData.profilePic = profilePicUrl;
//     if (RoleId) updateData.RoleId = RoleId;

//     // Password update
//     const passwordValue = req.body.password; // Explicitly access password
//     if (passwordValue && passwordValue.length >= 6) {
//       console.log('Updating password for user:', { id, password: passwordValue });
//       const hashedPassword = await bcrypt.hash(passwordValue, 10);
//       updateData.password = hashedPassword;
//       updateData.IsPasswordChanged = true;
//     } else if (passwordValue) {
//       await t.rollback();
//       console.log('Password too short:', { passwordLength: passwordValue.length });
//       return res.status(400).json({ error: 'Password must be at least 6 characters' });
//     } else {
//       console.log('No password provided in request');
//     }

//     // Debug: Log updateData before updating
//     console.log('Updating user with data:', updateData);

//     await user.update(updateData, { transaction: t });

//     await AuditLog.create({
//       Action: 'Update User',
//       UserId: currentUserId,
//       TargetId: id,
//       EntityId: id,
//       EntityType: 'User',
//       Timestamp: new Date(),
//       Details: JSON.stringify({
//         old: oldData,
//         new: {
//           username: username || user.username,
//           email: email || user.email,
//           status: status || user.status,
//           profilePic: profilePicUrl || user.profilePic,
//           RoleId: RoleId || user.RoleId,
//           password: passwordValue && passwordValue.length >= 6 ? 'updated' : 'unchanged',
//         },
//       }),
//     }, { transaction: t });

//     await t.commit();
//     const response = {
//       message: 'Profile updated successfully',
//       user: {
//         userId: user.userId,
//         username: username || user.username,
//         email: email || user.email,
//         status: status || user.status,
//         profilePic: profilePicUrl || user.profilePic,
//         RoleId: RoleId || user.RoleId,
//         IsPasswordChanged: passwordValue && passwordValue.length >= 6 ? true : user.IsPasswordChanged,
//       },
//     };
//     console.log('Sending response:', response);
//     res.status(200).json(response);
//   } catch (error) {
//     await t.rollback();
//     console.error('Update user error:', {
//       message: error.message,
//       stack: error.stack,
//       errors: error.errors || [],
//     });
//     if (error.name === 'SequelizeValidationError') {
//       return res.status(400).json({ error: error.errors.map((e) => e.message).join(', ') });
//     }
//     res.status(500).json({ error: 'Failed to update profile' });
//   }
// };

// export const deleteUser = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const { id } = req.params;
//     const currentUserId = req.user.userId;

//     const user = await User.findByPk(id, { transaction: t });
//     if (!user) {
//       await t.rollback();
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const role = await Role.findByPk(user.RoleId, { transaction: t });
//     if (role && role.RoleName === 'SuperAdmin') {
//       await t.rollback();
//       return res.status(403).json({ error: 'Cannot delete SuperAdmin user' });
//     }

//     // Delete related AuditLog records
//     await AuditLog.destroy({
//       where: { UserId: id },
//       transaction: t,
//     });

//     await UserRoleMapping.destroy({
//       where: { UserId: id },
//       transaction: t,
//     });

//     await UserCompany.destroy({
//       where: { UserId: id },
//       transaction: t,
//     });

//     const userData = { username: user.username, email: user.email, RoleId: user.RoleId, status: user.status };
//     await user.destroy({ transaction: t });

//     await AuditLog.create({
//       Action: 'Delete User',
//       UserId: currentUserId,
//       TargetId: id,
//       EntityId: id,
//       EntityType: 'User',
//       Timestamp: new Date(),
//       Details: JSON.stringify({ deleted: userData }),
//     }, { transaction: t });

//     await t.commit();
//     res.status(200).json({ message: 'User deleted successfully' });
//   } catch (error) {
//     await t.rollback();
//     console.error('Delete user error:', { message: error.message, stack: error.stack });
//     res.status(500).json({ error: 'Failed to delete user' });
//   }
// };



// export const assignUserToCompany = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const { userId, companyId, role } = req.body;
//     const currentUserId = req.user.userId;

//     const user = await User.findByPk(userId, { transaction: t });
//     const company = await Company.findByPk(companyId, { transaction: t });
//     if (!user || !company) {
//       await t.rollback();
//       return res.status(404).json({ error: 'User or company not found' });
//     }

//     const existingMapping = await UserCompany.findOne({
//       where: { UserId: userId, CompanyId: companyId },
//       transaction: t,
//     });
//     if (existingMapping) {
//       await t.rollback();
//       return res.status(400).json({ error: 'User is already assigned to this company' });
//     }

//     const mapping = await UserCompany.create({
//       UserId: userId,
//       CompanyId: companyId,
//       Role: role || 'Member',
//       CreatedDate: new Date(),
//       Status: 'Active',
//     }, { transaction: t });

//     await AuditLog.create({
//       Action: 'Assign User to Company',
//       UserId: currentUserId,
//       TargetId: userId,
//       EntityId: companyId,
//       EntityType: 'Company',
//       Timestamp: new Date(),
//       Details: JSON.stringify({ userId, companyId, role: role || 'Member' }),
//     }, { transaction: t });

//     await t.commit();
//     res.status(201).json({ message: 'User assigned to company', mapping });
//   } catch (error) {
//     await t.rollback();
//     console.error('Assign user to company error:', { message: error.message, stack: error.stack });
//     res.status(500).json({ error: 'Failed to assign user to company' });
//   }
// };

// export const getUserCompanies = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const mappings = await UserCompany.findAll({
//       where: { UserId: id, Status: 'Active' },
//       include: [
//         {
//           model: Company,
//           attributes: ['CompanyId', 'companyName'],
//         },
//       ],
//     });
//     res.status(200).json(mappings);
//   } catch (error) {
//     console.error('Get user companies error:', { message: error.message, stack: error.stack });
//     res.status(500).json({ error: 'Failed to fetch user companies' });
//   }
// };
















// Updated

// import User from "../models/userModel.js";
// import Role from "../models/roleModel.js";
// import UserRoleMapping from "../models/userRoleMappingModel.js";
// import UserCompany from "../models/userCompanyModel.js";
// import AuditLog from "../models/auditLogModel.js";
// import Company from "../models/companyModel.js";
// import bcrypt from "bcryptjs";
// import { v4 as uuidv4 } from 'uuid';
// import sequelize from "../config/database.js";

// export const getUsers = async (req, res) => {
//   try {
//     const users = await User.findAll({
//       attributes: { exclude: ['password'] },
//       include: [
//         {
//           model: Role,
//           as: 'PrimaryRole',
//           attributes: ['RoleName'],
//           required: false,
//         },
//         {
//           model: Role,
//           as: 'Roles',
//           through: { model: UserRoleMapping, attributes: [] },
//           attributes: ['RoleName'],
//           required: false,
//         },
//         {
//           model: Company,
//           as: 'Companies',
//           through: { model: UserCompany, attributes: [] },
//           attributes: ['CompanyId', 'CompanyName'],
//           required: false,
//         },
//       ],
//     });

//     const formattedUsers = users.map(user => ({
//       ...user.toJSON(),
//       primaryRole: user.PrimaryRole?.RoleName || user.Roles[0]?.RoleName || null,
//       roles: user.Roles.map(role => role.RoleName),
//       companies: user.Companies?.map(company => company.CompanyName).join(', ') || 'None',
//     }));

//     res.status(200).json(formattedUsers);
//   } catch (error) {
//     console.error('Get users error:', { message: error.message, stack: error.stack });
//     res.status(500).json({ error: 'Failed to fetch users' });
//   }
// };

// export const getUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findByPk(id, {
//       attributes: { exclude: ['password'] },
//       include: [
//         {
//           model: Role,
//           as: 'PrimaryRole',
//           attributes: ['RoleName'],
//           required: false,
//         },
//         {
//           model: Role,
//           as: 'Roles',
//           through: { model: UserRoleMapping, attributes: [] },
//           attributes: ['RoleName'],
//           required: false,
//         },
//         {
//           model: Company,
//           as: 'Companies',
//           through: { model: UserCompany, attributes: [] },
//           attributes: ['CompanyId', 'CompanyName'],
//           required: false,
//         },
//       ],
//     });

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const formattedUser = {
//       ...user.toJSON(),
//       primaryRole: user.PrimaryRole?.RoleName || user.Roles[0]?.RoleName || null,
//       roles: user.Roles.map(role => role.RoleName),
//       companies: user.Companies?.map(company => company.CompanyName).join(', ') || 'None',
//     };

//     res.status(200).json(formattedUser);
//   } catch (error) {
//     console.error('Get user error:', { message: error.message, stack: error.stack });
//     res.status(500).json({ error: 'Failed to fetch user' });
//   }
// };

// export const createUser = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const { firstName, lastName, username, email, password, RoleId, Status, companies } = req.body;
//     const currentUserId = req.user.userId;

//     if (!firstName || !lastName || !username || !email || !password || !RoleId || !Status) {
//       await t.rollback();
//       return res.status(400).json({ error: 'All required fields (firstName, lastName, username, email, password, RoleId, Status) must be provided' });
//     }

//     const existingUser = await User.findOne({ where: { email }, transaction: t });
//     if (existingUser) {
//       await t.rollback();
//       return res.status(400).json({ error: 'Email already exists' });
//     }

//     const role = await Role.findByPk(RoleId, { transaction: t });
//     if (!role) {
//       await t.rollback();
//       return res.status(400).json({ error: 'Invalid RoleId' });
//     }

//     if (Array.isArray(companies) && companies.length > 0) {
//       const validCompanies = await Company.findAll({ where: { CompanyId: companies }, attributes: ['CompanyId'], transaction: t });
//       if (validCompanies.length !== companies.length) {
//         await t.rollback();
//         return res.status(400).json({ error: 'One or more company IDs are invalid' });
//       }
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const userId = uuidv4();
//     const user = await User.create({
//       userId,
//       firstName,
//       lastName,
//       username,
//       email,
//       password: hashedPassword,
//       RoleId,
//       status: Status,
//       WhoUpdateUserId: currentUserId,
//       createdDate: new Date(),
//       updatedDate: new Date(),
//     }, { transaction: t });

//     await UserRoleMapping.create({
//       UserId: userId,
//       RoleId,
//     }, { transaction: t });

//     if (Array.isArray(companies) && companies.length > 0) {
//       const companyMappings = companies.map(companyId => ({
//         UserId: userId,
//         CompanyId: companyId,
//       }));
//       await UserCompany.bulkCreate(companyMappings, { transaction: t });
//     }

//     await AuditLog.create({
//       Action: 'Create User',
//       UserId: currentUserId,
//       EntityType: 'User',
//       EntityId: userId,
//       Timestamp: new Date(),
//       Details: JSON.stringify({ firstName, lastName, username, email, RoleId, Status, companies }),
//     }, { transaction: t });

//     await t.commit();
//     res.status(201).json({ message: 'User created successfully', userId });
//   } catch (error) {
//     await t.rollback();
//     console.error('Create user error:', { message: error.message, stack: error.stack });
//     res.status(500).json({ error: error.message || 'Failed to create user' });
//   }
// };

// // export const updateUser = async (req, res) => {
// //   const t = await sequelize.transaction();
// //   try {
// //     const { id } = req.params;
// //     const { firstName, lastName, username, email, RoleId, status, enable2FA, companies } = req.body;
// //     const profilePic = req.file ? req.file.buffer.toString('base64') : null;
// //     const currentUserId = req.user.userId;

// //     const user = await User.findByPk(id, { transaction: t });
// //     if (!user) {
// //       await t.rollback();
// //       return res.status(404).json({ error: 'User not found' });
// //     }

// //     if (email && email !== user.email) {
// //       const existingUser = await User.findOne({ where: { email }, transaction: t });
// //       if (existingUser) {
// //         await t.rollback();
// //         return res.status(400).json({ error: 'Email already exists' });
// //       }
// //     }

// //     if (RoleId) {
// //       const role = await Role.findByPk(RoleId, { transaction: t });
// //       if (!role) {
// //         await t.rollback();
// //         return res.status(400).json({ error: 'Invalid RoleId' });
// //       }
// //     }

// //     if (Array.isArray(companies) && companies.length > 0) {
// //       const validCompanies = await Company.findAll({ where: { CompanyId: companies }, attributes: ['CompanyId'], transaction: t });
// //       if (validCompanies.length !== companies.length) {
// //         await t.rollback();
// //         return res.status(400).json({ error: 'One or more company IDs are invalid' });
// //       }
// //     }

// //     const updateData = {};
// //     if (firstName) updateData.firstName = firstName;
// //     if (lastName) updateData.lastName = lastName;
// //     if (username) updateData.username = username;
// //     if (email) updateData.email = email;
// //     if (RoleId) updateData.RoleId = RoleId;
// //     if (status) updateData.status = status;
// //     if (profilePic) updateData.profilePic = profilePic;
// //     if (enable2FA !== undefined) updateData.twoFactorSecret = enable2FA ? 'some-secret' : null;
// //     updateData.WhoUpdateUserId = currentUserId;
// //     updateData.updatedDate = new Date();

// //     await user.update(updateData, { transaction: t });

// //     if (RoleId) {
// //       await UserRoleMapping.destroy({ where: { UserId: id }, transaction: t });
// //       await UserRoleMapping.create({ UserId: id, RoleId }, { transaction: t });
// //     }

// //     if (Array.isArray(companies)) {
// //       await UserCompany.destroy({ where: { UserId: id }, transaction: t });
// //       if (companies.length > 0) {
// //         const companyMappings = companies.map(companyId => ({
// //           UserId: id,
// //           CompanyId: companyId,
// //         }));
// //         await UserCompany.bulkCreate(companyMappings, { transaction: t });
// //       }
// //     }

// //     await AuditLog.create({
// //       Action: 'Update User',
// //       UserId: currentUserId,
// //       EntityType: 'User',
// //       EntityId: id,
// //       Timestamp: new Date(),
// //       Details: JSON.stringify({ firstName, lastName, username, email, RoleId, status, enable2FA, companies }),
// //     }, { transaction: t });

// //     await t.commit();
// //     const updatedUser = await User.findByPk(id, {
// //       attributes: { exclude: ['password'] },
// //       include: [
// //         { model: Role, as: 'PrimaryRole', attributes: ['RoleName'] },
// //         { model: Role, as: 'Roles', through: { model: UserRoleMapping, attributes: [] }, attributes: ['RoleName'] },
// //         { model: Company, as: 'Companies', through: { model: UserCompany, attributes: [] }, attributes: ['CompanyId', 'CompanyName'] },
// //       ],
// //       transaction: t,
// //     });

// //     const formattedUser = {
// //       ...updatedUser.toJSON(),
// //       primaryRole: updatedUser.PrimaryRole?.RoleName || updatedUser.Roles[0]?.RoleName || null,
// //       roles: updatedUser.Roles.map(role => role.RoleName),
// //       companies: updatedUser.Companies?.map(company => company.CompanyName).join(', ') || 'None',
// //     };

// //     res.status(200).json({ message: 'User updated successfully', user: formattedUser });
// //   } catch (error) {
// //     await t.rollback();
// //     console.error('Update user error:', { message: error.message, stack: error.stack });
// //     res.status(500).json({ error: error.message || 'Failed to update user' });
// //   }
// // };

// export const updateUser = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const { id } = req.params;
//     const { firstName, lastName, username, email, RoleId, status, enable2FA, companies } = req.body;
//     const profilePic = req.file ? req.file.buffer.toString('base64') : null;
//     const currentUserId = req.user.userId;

//     console.log('Update user request body:', req.body); // Debug: Log incoming data

//     const user = await User.findByPk(id, { transaction: t });
//     if (!user) {
//       await t.rollback();
//       return res.status(404).json({ error: 'User not found' });
//     }

//     if (email && email !== user.email) {
//       const existingUser = await User.findOne({ where: { email }, transaction: t });
//       if (existingUser) {
//         await t.rollback();
//         return res.status(400).json({ error: 'Email already exists' });
//       }
//     }

//     if (RoleId) {
//       const role = await Role.findByPk(RoleId, { transaction: t });
//       if (!role) {
//         await t.rollback();
//         return res.status(400).json({ error: 'Invalid RoleId' });
//       }
//     }

//     if (Array.isArray(companies) && companies.length > 0) {
//       const validCompanies = await Company.findAll({ where: { CompanyId: companies }, attributes: ['CompanyId'], transaction: t });
//       if (validCompanies.length !== companies.length) {
//         await t.rollback();
//         return res.status(400).json({ error: 'One or more company IDs are invalid' });
//       }
//     }

//     const updateData = {
//       WhoUpdateUserId: currentUserId,
//       updatedDate: new Date(),
//     };
//     // Allow empty strings or null to update fields
//     if (firstName !== undefined) updateData.firstName = firstName || null;
//     if (lastName !== undefined) updateData.lastName = lastName || null;
//     if (username !== undefined) updateData.username = username || null;
//     if (email !== undefined) updateData.email = email || null;
//     if (RoleId !== undefined) updateData.RoleId = RoleId || null;
//     if (status !== undefined) updateData.status = status || 'Active';
//     if (profilePic !== undefined) updateData.profilePic = profilePic || null;
//     if (enable2FA !== undefined) {
//       updateData.twoFactorSecret = enable2FA ? generate2FASecret() : null; // Implement generate2FASecret
//     }

//     await user.update(updateData, { transaction: t });

//     if (RoleId !== undefined) {
//       await UserRoleMapping.destroy({ where: { UserId: id }, transaction: t });
//       if (RoleId) {
//         await UserRoleMapping.create({ UserId: id, RoleId }, { transaction: t });
//       }
//     }

//     if (Array.isArray(companies)) {
//       await UserCompany.destroy({ where: { UserId: id }, transaction: t });
//       if (companies.length > 0) {
//         const companyMappings = companies.map(companyId => ({
//           UserId: id,
//           CompanyId: companyId,
//         }));
//         await UserCompany.bulkCreate(companyMappings, { transaction: t });
//       }
//     }

//     await AuditLog.create({
//       Action: 'Update User',
//       UserId: currentUserId,
//       EntityType: 'User',
//       EntityId: id,
//       Timestamp: new Date(),
//       Details: JSON.stringify({ firstName, lastName, username, email, RoleId, status, enable2FA, companies }),
//     }, { transaction: t });

//     await t.commit();

//     // Fetch updated user outside the transaction
//     const updatedUser = await User.findByPk(id, {
//       attributes: { exclude: ['password'] },
//       include: [
//         { model: Role, as: 'PrimaryRole', attributes: ['RoleName'] },
//         { model: Role, as: 'Roles', through: { model: UserRoleMapping, attributes: [] }, attributes: ['RoleName'] },
//         { model: Company, as: 'Companies', through: { model: UserCompany, attributes: [] }, attributes: ['CompanyId', 'CompanyName'] },
//       ],
//     }).catch(err => {
//       console.error('Error fetching updated user:', { message: err.message, stack: err.stack });
//       throw err;
//     });

//     if (!updatedUser) {
//       return res.status(404).json({ error: 'Updated user not found' });
//     }

//     const formattedUser = {
//       ...updatedUser.toJSON(),
//       primaryRole: updatedUser.PrimaryRole?.RoleName || updatedUser.Roles[0]?.RoleName || null,
//       roles: updatedUser.Roles.map(role => role.RoleName),
//       companies: updatedUser.Companies?.map(company => company.CompanyName).join(', ') || 'None',
//     };

//     res.status(200).json({ message: 'User updated successfully', user: formattedUser });
//   } catch (error) {
//     if (!t.finished) {
//       await t.rollback();
//     }
//     console.error('Update user error:', { message: error.message, stack: error.stack });
//     res.status(500).json({ error: error.message || 'Failed to update user' });
//   }
// };

// // Placeholder for 2FA secret generation
// // function generate2FASecret() {
// //   return 'some-secret'; // Replace with actual 2FA secret generation (e.g., using speakeasy or otpauth)
// // }

// export const deleteUser = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const { id } = req.params;
//     const currentUserId = req.user.userId;

//     const user = await User.findByPk(id, { transaction: t });
//     if (!user) {
//       await t.rollback();
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Delete dependent records
//     await AuditLog.destroy({ where: { UserId: id }, transaction: t });
//     await UserCompany.destroy({ where: { UserId: id }, transaction: t });
//     await UserRoleMapping.destroy({ where: { UserId: id }, transaction: t });
//     await user.destroy({ transaction: t });

//     await AuditLog.create({
//       Action: 'Delete User',
//       UserId: currentUserId,
//       EntityType: 'User',
//       EntityId: id,
//       Timestamp: new Date(),
//       Details: JSON.stringify({ deletedUserId: id }),
//     }, { transaction: t });

//     await t.commit();
//     res.status(200).json({ message: 'User deleted successfully' });
//   } catch (error) {
//     await t.rollback();
//     console.error('Delete user error:', { message: error.message, stack: error.stack });
//     res.status(500).json({ error: error.message || 'Failed to delete user' });
//   }
// };

// export const assignUserToCompany = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const { userId, companyId, role } = req.body;
//     const currentUserId = req.user.userId;

//     const user = await User.findByPk(userId, { transaction: t });
//     const company = await Company.findByPk(companyId, { transaction: t });
//     if (!user || !company) {
//       await t.rollback();
//       return res.status(404).json({ error: 'User or company not found' });
//     }

//     const existingMapping = await UserCompany.findOne({
//       where: { UserId: userId, CompanyId: companyId },
//       transaction: t,
//     });
//     if (existingMapping) {
//       await t.rollback();
//       return res.status(400).json({ error: 'User is already assigned to this company' });
//     }

//     const mapping = await UserCompany.create({
//       UserId: userId,
//       CompanyId: companyId,
//     }, { transaction: t });

//     await AuditLog.create({
//       Action: 'Assign User to Company',
//       UserId: currentUserId,
//       TargetId: userId,
//       EntityId: companyId,
//       EntityType: 'Company',
//       Timestamp: new Date(),
//       Details: JSON.stringify({ userId, companyId, role: role || 'Member' }),
//     }, { transaction: t });

//     await t.commit();
//     res.status(201).json({ message: 'User assigned to company', mapping });
//   } catch (error) {
//     await t.rollback();
//     console.error('Assign user to company error:', { message: error.message, stack: error.stack });
//     res.status(500).json({ error: 'Failed to assign user to company' });
//   }
// };

// export const getUserCompanies = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const mappings = await UserCompany.findAll({
//       where: { UserId: id },
//       include: [
//         {
//           model: Company,
//           attributes: ['CompanyId', 'CompanyName'],
//         },
//       ],
//     });
//     const formattedMappings = mappings.map(mapping => ({
//       CompanyId: mapping.CompanyId,
//       CompanyName: mapping.Company?.CompanyName,
//     }));
//     res.status(200).json(formattedMappings);
//   } catch (error) {
//     console.error('Get user companies error:', { message: error.message, stack: error.stack });
//     res.status(500).json({ error: 'Failed to fetch user companies' });
//   }
// };




// Latest

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