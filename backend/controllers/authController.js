// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { Op } from 'sequelize';
// import { v4 as uuidv4 } from 'uuid'; // Add this import
// import sequelize from '../config/database.js';
// import User from '../models/userModel.js';
// import Role from '../models/roleModel.js';
// import UserRoleMapping from '../models/userRoleMappingModel.js';
// import AuditLog from '../models/auditLogModel.js';

// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   // Validate input
//   if (!email || !password) {
//     return res.status(400).json({ error: 'Email and password are required' });
//   }
//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//     return res.status(400).json({ error: 'Invalid email format' });
//   }

//   try {
//     const user = await User.findOne({
//       where: { email, status: { [Op.ne]: 'Inactive' } },
//       include: [
//         {
//           model: Role,
//           as: 'PrimaryRole', // Single role via User.RoleId
//           attributes: ['RoleName'],
//         },
//         {
//           model: Role,
//           as: 'Roles', // Multiple roles via UserRoleMapping
//           through: { model: UserRoleMapping, attributes: [] },
//           attributes: ['RoleName'],
//         },
//       ],
//     });

//     if (!user) {
//       await AuditLog.create({
//         Action: 'Failed Login Attempt',
//         EntityType: 'User',
//         Timestamp: new Date(),
//         Details: JSON.stringify({ email, reason: 'User not found' }),
//       });
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       await AuditLog.create({
//         Action: 'Failed Login Attempt',
//         UserId: user.userId,
//         EntityType: 'User',
//         EntityId: user.userId,
//         Timestamp: new Date(),
//         Details: JSON.stringify({ email, reason: 'Invalid password' }),
//       });
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }

//     // Generate JWT with primaryRole and roles
//     const roles = user.Roles.map(role => role.RoleName);
//     const primaryRole = user.PrimaryRole?.RoleName || roles[0] || 'User';
//     const token = jwt.sign(
//       { userId: user.userId, email: user.email, primaryRole, roles },
//       process.env.JWT_SECRET,
//       { expiresIn: '90d' }
//     );

//     await AuditLog.create({
//       Action: 'Login',
//       UserId: user.userId,
//       EntityType: 'User',
//       EntityId: user.userId,
//       Timestamp: new Date(),
//       Details: JSON.stringify({ email, primaryRole, roles }),
//     });

//     res.status(200).json({
//       token,
//       user: {
//         userId: user.userId,
//         username: user.username,
//         email: user.email,
//         primaryRole,
//         roles,
//       },
//     });
//   } catch (error) {
//     console.error('Login error:', { message: error.message, stack: error.stack });
//     res.status(500).json({ error: 'Failed to login' });
//   }
// };

// export const register = async (req, res) => {
//   const { username, email, password, role = 'Company Representative' } = req.body;
//   const t = await sequelize.transaction();

//   try {
//     // Validate input
//     if (!username || !email || !password || !role) {
//       await t.rollback();
//       return res.status(400).json({ error: 'Username, email, password, and role are required' });
//     }
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       await t.rollback();
//       return res.status(400).json({ error: 'Invalid email format' });
//     }

//     const existingUser = await User.findOne({ where: { email }, transaction: t });
//     if (existingUser) {
//       await t.rollback();
//       return res.status(400).json({ error: 'Email already registered' });
//     }

//     const targetRole = await Role.findOne({ where: { RoleName: role }, transaction: t });
//     if (!targetRole) {
//       await t.rollback();
//       return res.status(400).json({ error: `Role ${role} not found` });
//     }
//     if (targetRole.RoleName === 'SuperAdmin') {
//       await t.rollback();
//       return res.status(403).json({ error: 'SuperAdmin role cannot be assigned' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       userId: uuidv4(), // Changed from require('uuid').v4()
//       username,
//       email,
//       password: hashedPassword,
//       RoleId: targetRole.RoleId,
//       status: 'Active',
//       IsPasswordChanged: false,
//       createdDate: new Date(),
//       updatedDate: new Date(),
//     }, { transaction: t });

//     await UserRoleMapping.create({
//       UserId: user.userId,
//       RoleId: targetRole.RoleId,
//       AssignedDate: new Date(),
//       Status: 'Active',
//     }, { transaction: t });

//     // Fetch roles for response
//     const createdUser = await User.findByPk(user.userId, {
//       include: [
//         {
//           model: Role,
//           as: 'PrimaryRole',
//           attributes: ['RoleName'],
//         },
//         {
//           model: Role,
//           as: 'Roles',
//           through: { model: UserRoleMapping, attributes: [] },
//           attributes: ['RoleName'],
//         },
//       ],
//       transaction: t,
//     });

//     const roles = createdUser.Roles.map(r => r.RoleName);
//     const primaryRole = createdUser.PrimaryRole?.RoleName || roles[0];

//     const token = jwt.sign(
//       { userId: user.userId, email: user.email, primaryRole, roles },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     await AuditLog.create({
//       Action: 'Register User',
//       UserId: user.userId,
//       EntityType: 'User',
//       EntityId: user.userId,
//       Timestamp: new Date(),
//       Details: JSON.stringify({ username, email, primaryRole, roles }),
//     }, { transaction: t });

//     await t.commit();
//     res.status(201).json({
//       token,
//       user: {
//         userId: user.userId,
//         username: user.username,
//         email: user.email,
//         primaryRole,
//         roles,
//       },
//     });
//   } catch (error) {
//     await t.rollback();
//     console.error('Register error:', { message: error.message, stack: error.stack });
//     res.status(500).json({ error: 'Failed to register user' });
//   }
// };


























// Updated

// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { Op } from 'sequelize';
// import { v4 as uuidv4 } from 'uuid';
// import sequelize from '../config/database.js';
// import User from '../models/userModel.js';
// import Role from '../models/roleModel.js';
// import UserRoleMapping from '../models/userRoleMappingModel.js';
// import AuditLog from '../models/auditLogModel.js';
// import Company from '../models/companyModel.js';
// import UserCompany from '../models/userCompanyModel.js';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: 'Email and password are required' });
//   }
//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//     return res.status(400).json({ error: 'Invalid email format' });
//   }

//   try {
//     const user = await User.findOne({
//       where: { email, status: { [Op.ne]: 'Inactive' } },
//       include: [
//         {
//           model: Role,
//           as: 'PrimaryRole',
//           attributes: ['RoleName'],
//         },
//         {
//           model: Role,
//           as: 'Roles',
//           through: { model: UserRoleMapping, attributes: [] },
//           attributes: ['RoleName'],
//         },
//       ],
//     });

//     if (!user) {
//       await AuditLog.create({
//         Action: 'Failed Login Attempt',
//         EntityType: 'User',
//         Timestamp: new Date(),
//         Details: JSON.stringify({ email, reason: 'User not found' }),
//       });
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }

//     if (!user.verified) {
//       await AuditLog.create({
//         Action: 'Failed Login Attempt',
//         UserId: user.userId,
//         EntityType: 'User',
//         EntityId: user.userId,
//         Timestamp: new Date(),
//         Details: JSON.stringify({ email, reason: 'Email not verified' }),
//       });
//       return res.status(401).json({ error: 'Please verify your email' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       await AuditLog.create({
//         Action: 'Failed Login Attempt',
//         UserId: user.userId,
//         EntityType: 'User',
//         EntityId: user.userId,
//         Timestamp: new Date(),
//         Details: JSON.stringify({ email, reason: 'Invalid password' }),
//       });
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }

//     const roles = user.Roles.map(role => role.RoleName);
//     const primaryRole = user.PrimaryRole?.RoleName || roles[0] || 'User';
//     const token = jwt.sign(
//       { userId: user.userId, email: user.email, primaryRole, roles },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     await AuditLog.create({
//       Action: 'Login',
//       UserId: user.userId,
//       EntityType: 'User',
//       EntityId: user.userId,
//       Timestamp: new Date(),
//       Details: JSON.stringify({ email }),
//     });

//     res.status(200).json({
//       token,
//       user: {
//         userId: user.userId,
//         email: user.email,
//         primaryRole,
//         roles,
//         verified: user.verified,
//       },
//     });
//   } catch (error) {
//     console.error('Login error:', { message: error.message, stack: error.stack });
//     res.status(500).json({ error: 'Failed to login' });
//   }
// };

// // export const register = async (req, res) => {
// //   const t = await sequelize.transaction();
// //   try {
// //     const {
// //       firstName,
// //       lastName,
// //       email,
// //       password,
// //       companyName,
// //       tin,
// //       registrationNumber,
// //       type,
// //       industry,
// //       fiscalYearStart,
// //       topPosition,
// //       phone,
// //       companyEmail,
// //       address = {},
// //       noOfShareholders,
// //       registeredCapital,
// //       subscribedCapital,
// //       registeredShareQt,
// //       subscribedShareQt,
// //       shareValue,
// //       parentCompanyId,
// //       enableMFA,
// //     } = req.body;

// //     const { streetAddress, city, country, postalCode, state } = address || {};
// //     const logoPath = req.file ? path.join('Uploads', req.file.filename) : null;

// //     const requiredFields = [
// //       firstName, lastName, email, password,
// //       companyName, tin, registrationNumber, type, industry,
// //       fiscalYearStart, topPosition, phone, companyEmail,
// //       streetAddress, city, country, postalCode,
// //     ];
// //     if (requiredFields.some((field) => field === undefined || field === null || field === '')) {
// //       await t.rollback();
// //       return res.status(400).json({
// //         error: 'All required fields must be provided and non-empty: firstName, lastName, email, password, companyName, tin, registrationNumber, type, industry, fiscalYearStart, topPosition, phone, companyEmail, streetAddress, city, country, postalCode',
// //       });
// //     }

// //     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
// //       await t.rollback();
// //       return res.status(400).json({ error: 'Invalid user email format' });
// //     }
// //     if (companyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyEmail)) {
// //       await t.rollback();
// //       return res.status(400).json({ error: 'Invalid company email format' });
// //     }
// //     if (phone && !/^\+?[\d\s-]{6,20}$/.test(phone)) {
// //       await t.rollback();
// //       return res.status(400).json({ error: 'Invalid phone number format' });
// //     }
// //     if (noOfShareholders && parseInt(noOfShareholders, 10) < 0) {
// //       await t.rollback();
// //       return res.status(400).json({ error: 'Number of shareholders cannot be negative' });
// //     }
// //     if (registeredCapital && parseFloat(registeredCapital) < 0 || subscribedCapital && parseFloat(subscribedCapital) < 0) {
// //       await t.rollback();
// //       return res.status(400).json({ error: 'Capital values cannot be negative' });
// //     }
// //     if (registeredShareQt && parseInt(registeredShareQt, 10) < 0 || subscribedShareQt && parseInt(subscribedShareQt, 10) < 0) {
// //       await t.rollback();
// //       return res.status(400).json({ error: 'Share quantities cannot be negative' });
// //     }
// //     if (shareValue && parseFloat(shareValue) <= 0) {
// //       await t.rollback();
// //       return res.status(400).json({ error: 'Share value must be positive' });
// //     }

// //     const existingUser = await User.findOne({ where: { email }, transaction: t });
// //     let userId;
// //     if (existingUser) {
// //       if (existingUser.verified) {
// //         userId = existingUser.userId;
// //       } else {
// //         await t.rollback();
// //         return res.status(400).json({ error: 'Email already registered but not verified. Please verify your email.' });
// //       }
// //     } else {
// //       let adminRole = await Role.findOne({ where: { RoleName: 'Admin' }, transaction: t });
// //       if (!adminRole) {
// //         adminRole = await Role.create(
// //           {
// //             RoleId: uuidv4(),
// //             RoleName: 'Admin',
// //             Description: 'Administrator role with full permissions',
// //             CreatedByUserId: null,
// //             Status: 'Active',
// //           },
// //           { transaction: t }
// //         );
// //       }

// //       userId = uuidv4();
// //       const hashedPassword = await bcrypt.hash(password, 10);
// //       const verificationToken = uuidv4();
// //       await User.create(
// //         {
// //           userId,
// //           firstName,
// //           lastName,
// //           username: email,
// //           email,
// //           password: hashedPassword,
// //           RoleId: adminRole.RoleId,
// //           verified: false,
// //           verificationToken,
// //           status: 'Pending',
// //         },
// //         { transaction: t }
// //       );
// //     }

// //     const companyId = uuidv4();
// //     await Company.create(
// //       {
// //         CompanyId: companyId,
// //         CompanyName: companyName,
// //         TinNo: tin,
// //         RegistrationNo: registrationNumber,
// //         Type: type,
// //         Industry: industry,
// //         FiscalYearStart: fiscalYearStart,
// //         TopPosition: topPosition,
// //         Phone: phone,
// //         Email: companyEmail,
// //         Address: `${streetAddress}, ${city}${state ? `, ${state}` : ''}, ${country}, ${postalCode}`,
// //         NoOfShareholders: parseInt(noOfShareholders, 10) || 0,
// //         RegisteredCapital: parseFloat(registeredCapital) || 0,
// //         SubscribedCapital: parseFloat(subscribedCapital) || 0,
// //         RegisteredShareQt: parseInt(registeredShareQt, 10) || 0,
// //         SubscribedShareQt: parseInt(subscribedShareQt, 10) || 0,
// //         ShareValue: parseFloat(shareValue) || 0,
// //         ParentCompanyId: parentCompanyId || null,
// //         Logo: logoPath,
// //       },
// //       { transaction: t }
// //     );

// //     await UserRoleMapping.create(
// //       { UserId: userId, RoleId: adminRole.RoleId },
// //       { transaction: t }
// //     );
// //     const existingCompanyMapping = await UserCompany.findOne(
// //       {
// //         where: { UserId: userId, CompanyId: companyId },
// //       },
// //       { transaction: t }
// //     );
// //     if (!existingCompanyMapping) {
// //       await UserCompany.create(
// //         { UserId: userId, CompanyId: companyId, Role: 'Admin' },
// //         { transaction: t }
// //       );
// //     }

// //     if (enableMFA) {
// //       // Implement MFA logic (e.g., using speakeasy) if needed
// //     }

// //     await AuditLog.create(
// //       {
// //         Action: 'Register User and Company',
// //         UserId: userId,
// //         EntityType: 'User and Company',
// //         EntityId: `${userId},${companyId}`,
// //         Timestamp: new Date(),
// //         Details: JSON.stringify({ email, companyName, role: 'Admin' }),
// //       },
// //       { transaction: t }
// //     );

// //     const verificationLink = `${process.env.APP_URL}/auth/verify?token=${verificationToken}`;
// //     // Add nodemailer or email service logic here

// //     await t.commit();
// //     res.status(201).json({
// //       token: jwt.sign(
// //         { userId, email, primaryRole: 'Admin', roles: ['Admin'] },
// //         process.env.JWT_SECRET,
// //         { expiresIn: '1d' }
// //       ),
// //       user: { userId, firstName, lastName, email, primaryRole: 'Admin', roles: ['Admin'], verified: false },
// //       message: 'Registration successful. Please verify your email.',
// //     });
// //   } catch (error) {
// //     await t.rollback();
// //     console.error('Register error:', {
// //       message: error.message,
// //       stack: error.stack,
// //       response: error.response?.data,
// //     });
// //     let errorMessage = 'Failed to register';
// //     if (error.name === 'SequelizeUniqueConstraintError') {
// //       errorMessage = 'Email, TIN, or registration number already exists';
// //     } else if (error.name === 'SequelizeValidationError') {
// //       errorMessage = error.errors.map((e) => e.message).join(', ');
// //     } else if (error.message) {
// //       errorMessage = error.message;
// //     }
// //     res.status(500).json({ error: errorMessage });
// //   }
// // };

// export const register = async (req, res) => {
//   console.log('req.body:', req.body);
//   console.log('req.file:', req.file);
//   const {
//     username, firstName, lastName, email, password,
//     companyName, tin, registrationNumber, type, industry,
//     fiscalYearStart, topPosition, phone, companyEmail,
//     streetAddress, city, country, postalCode, state,
//     noOfShareholders, registeredCapital, subscribedCapital,
//     registeredShareQt, subscribedShareQt, shareValue,
//     parentCompanyId
//   } = req.body;

//   const logoPath = req.file ? req.file.path : null;

//   const t = await sequelize.transaction();

//   try {
//     // Validate required fields
//     const requiredFields = {
//       username, firstName, lastName, email, password,
//       companyName, tin, registrationNumber, type, industry,
//       fiscalYearStart, topPosition, phone, companyEmail,
//       streetAddress, city, country, postalCode
//     };
//     const missingFields = Object.keys(requiredFields).filter(key => !requiredFields[key]);
//     if (missingFields.length > 0) {
//       await t.rollback();
//       return res.status(400).json({
//         error: `All required fields must be provided and non-empty: ${missingFields.join(', ')}`
//       });
//     }

//     // Validate email format
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       await t.rollback();
//       return res.status(400).json({ error: 'Invalid email format' });
//     }

//     // Check for existing user
//     const existingUser = await User.findOne({ where: { email }, transaction: t });
//     if (existingUser) {
//       await t.rollback();
//       return res.status(400).json({ error: 'Email already registered' });
//     }

//     // Find Admin role
//     const adminRole = await Role.findOne({ where: { RoleName: 'Admin' }, transaction: t });
//     if (!adminRole) {
//       await t.rollback();
//       return res.status(400).json({ error: 'Admin role not found' });
//     }

//     // Create user
//     const userId = uuidv4();
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const verificationToken = uuidv4();
//     await User.create({
//       userId,
//       firstName,
//       lastName,
//       username,
//       email,
//       password: hashedPassword,
//       RoleId: adminRole.RoleId,
//       verified: false,
//       verificationToken,
//       status: 'Pending'
//     }, { transaction: t });

//     // Create company
//     const companyId = uuidv4();
//     const address = `${streetAddress}, ${city}${state ? `, ${state}` : ''}, ${country}, ${postalCode}`;
//     await Company.create({
//       CompanyId: companyId,
//       CompanyName: companyName,
//       TinNo: tin,
//       RegistrationNo: registrationNumber,
//       Type: type,
//       Industry: industry,
//       FiscalYearStart: fiscalYearStart,
//       TopPosition: topPosition,
//       Phone: phone,
//       Email: companyEmail,
//       Address: address,
//       NoOfShareholders: parseInt(noOfShareholders) || 0,
//       RegisteredCapital: parseFloat(registeredCapital) || 0,
//       SubscribedCapital: parseFloat(subscribedCapital) || 0,
//       RegisteredShareQt: parseInt(registeredShareQt) || 0,
//       SubscribedShareQt: parseInt(subscribedShareQt) || 0,
//       ShareValue: parseFloat(shareValue) || 0,
//       ParentCompanyId: parentCompanyId || null,
//       Logo: logoPath
//     }, { transaction: t });

//     // Create user-company mapping
//     await UserCompany.create(
//       { UserId: userId, CompanyId: companyId, Role: 'Admin' },
//       { transaction: t }
//     );

//     // Create audit log with single UUID for EntityId
//     await AuditLog.create(
//       {
//         Action: 'Register User and Company',
//         UserId: userId,
//         EntityType: 'User and Company',
//         EntityId: userId, // Use userId as a single UUID
//         Timestamp: new Date(),
//         Details: JSON.stringify({ email, companyName, role: 'Admin', userId, companyId }) // Include both IDs in Details
//       },
//       { transaction: t }
//     );

//     const verificationLink = `${process.env.APP_URL}/auth/verify?token=${verificationToken}`;
//     // Implement email sending logic here (e.g., nodemailer)

//     await t.commit();
//     res.status(201).json({
//       token: jwt.sign(
//         { userId, email, primaryRole: 'Admin', roles: ['Admin'] },
//         process.env.JWT_SECRET,
//         { expiresIn: '1d' }
//       ),
//       user: { userId, firstName, lastName, email, primaryRole: 'Admin', roles: ['Admin'], verified: false },
//       message: 'Registration successful. Please verify your email.'
//     });
//   } catch (error) {
//     await t.rollback();
//     console.error('Register error:', {
//       message: error.message,
//       stack: error.stack,
//       response: error.response?.data,
//     });
//     let errorMessage = 'Failed to register';
//     if (error.name === 'SequelizeUniqueConstraintError') {
//       errorMessage = 'Email, TIN, or registration number already exists';
//     } else if (error.name === 'SequelizeValidationError') {
//       errorMessage = error.errors.map((e) => e.message).join(', ');
//     } else if (error.message) {
//       errorMessage = error.message;
//     }
//     res.status(400).json({ error: errorMessage });
//   }
// };

// export const verifyEmail = async (req, res) => {
//   const { token } = req.query;
//   const t = await sequelize.transaction();

//   try {
//     if (!token) {
//       await t.rollback();
//       return res.status(400).json({ error: 'Verification token is required' });
//     }

//     const user = await User.findOne({ where: { verificationToken: token }, transaction: t });
//     if (!user) {
//       await t.rollback();
//       return res.status(400).json({ error: 'Invalid or expired verification token' });
//     }

//     await user.update({ verified: true, verificationToken: null, status: 'Active' }, { transaction: t });

//     await AuditLog.create({
//       Action: 'Verify Email',
//       UserId: user.userId,
//       EntityType: 'User',
//       EntityId: user.userId,
//       Timestamp: new Date(),
//       Details: JSON.stringify({ email: user.email }),
//     }, { transaction: t });

//     await t.commit();
//     res.status(200).json({ message: 'Email verified successfully' });
//   } catch (error) {
//     await t.rollback();
//     console.error('Verify email error:', { message: error.message, stack: error.stack });
//     res.status(500).json({ error: 'Failed to verify email' });
//   }
// };

// export const createInvitations = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const invitations = req.body;
//     const userId = req.user.userId;

//     for (const { email, role, companyId, shareholderId } of invitations) {
//       if (!email || !role || !companyId) {
//         await t.rollback();
//         return res.status(400).json({ error: 'Email, role, and companyId are required' });
//       }
//       const invitationId = uuidv4();
//       const token = uuidv4();
//       await sequelize.models.Invitation.create({
//         id: invitationId,
//         email,
//         companyId,
//         roleId: role === 'hr' ? 'role_hr' : 'role_shareholder',
//         shareholderId,
//         token,
//         status: 'Pending',
//         created_by: userId,
//       }, { transaction: t });

//       // Send invitation email (e.g., using nodemailer) omitted for brevity
//       await AuditLog.create({
//         Action: 'Create Invitation',
//         UserId: userId,
//         EntityType: 'Invitation',
//         EntityId: invitationId,
//         Timestamp: new Date(),
//         Details: JSON.stringify({ email, role, companyId, shareholderId }),
//       }, { transaction: t });
//     }

//     await t.commit();
//     res.status(201).json({ message: 'Invitations sent successfully' });
//   } catch (error) {
//     await t.rollback();
//     console.error('Create invitations error:', { message: error.message, stack: error.stack });
//     res.status(500).json({ error: 'Failed to send invitations' });
//   }
// };


// Latest

// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { Op } from 'sequelize';
// import { v4 as uuidv4 } from 'uuid';
// import sequelize from '../config/database.js';
// import User from '../models/userModel.js';
// import Role from '../models/roleModel.js';
// import UserRoleMapping from '../models/userRoleMappingModel.js';
// import AuditLog from '../models/auditLogModel.js';
// import Company from '../models/companyModel.js';
// import UserCompany from '../models/userCompanyModel.js';

// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   // Validate input
//   if (!email || !password) {
//     return res.status(400).json({ error: 'Email and password are required' });
//   }
//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//     return res.status(400).json({ error: 'Invalid email format' });
//   }

//   try {
//     const user = await User.findOne({
//       where: { email, status: { [Op.ne]: 'Inactive' } },
//       include: [
//         {
//           model: Role,
//           as: 'PrimaryRole',
//           attributes: ['RoleName'],
//         },
//         {
//           model: Role,
//           as: 'Roles',
//           through: { model: UserRoleMapping, attributes: [] },
//           attributes: ['RoleName'],
//         },
//       ],
//     });

//     if (!user) {
//       await AuditLog.create({
//         Action: 'Failed Login Attempt',
//         EntityType: 'User',
//         Timestamp: new Date(),
//         Details: JSON.stringify({ email, reason: 'User not found' }),
//       });
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       await AuditLog.create({
//         Action: 'Failed Login Attempt',
//         UserId: user.userId,
//         EntityType: 'User',
//         EntityId: user.userId,
//         Timestamp: new Date(),
//         Details: JSON.stringify({ email, reason: 'Invalid password' }),
//       });
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }

//     const roles = user.Roles.map(role => role.RoleName);
//     const primaryRole = user.PrimaryRole?.RoleName || roles[0] || 'User';
//     const token = jwt.sign(
//       { userId: user.userId, email: user.email, primaryRole, roles },
//       process.env.JWT_SECRET,
//       { expiresIn: '90d' }
//     );

//     await AuditLog.create({
//       Action: 'Login',
//       UserId: user.userId,
//       EntityType: 'User',
//       EntityId: user.userId,
//       Timestamp: new Date(),
//       Details: JSON.stringify({ email, primaryRole, roles }),
//     });

//     res.status(200).json({
//       token,
//       user: {
//         userId: user.userId,
//         username: user.username,
//         email: user.email,
//         primaryRole,
//         roles,
//       },
//     });
//   } catch (error) {
//     console.error('Login error:', { message: error.message, stack: error.stack });
//     res.status(500).json({ error: 'Failed to login' });
//   }
// };

// export const register = async (req, res) => {
//   const {
//     username, firstName, lastName, email, password, companyName, tin, registrationNumber,
//     type, industry, fiscalYearStart, parentCompanyId, topPosition, phone, companyEmail,
//     streetAddress, city, state, country, postalCode, noOfShareholders, registeredCapital,
//     subscribedCapital, registeredShareQt, subscribedShareQt, shareValue,
//   } = req.body;
//   const logoFile = req.file ? req.file.path : null;
//   const t = await sequelize.transaction();

//   try {
//     // Validate input
//     const requiredFields = {
//       username, firstName, lastName, email, password, companyName, tin, registrationNumber,
//       type, topPosition, phone, companyEmail, streetAddress, city, country, postalCode,
//     };
//     const missingFields = Object.keys(requiredFields).filter(key => !requiredFields[key]);
//     if (missingFields.length > 0) {
//       await t.rollback();
//       return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
//     }
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       await t.rollback();
//       return res.status(400).json({ error: 'Invalid email format' });
//     }

//     const existingUser = await User.findOne({ where: { email }, transaction: t });
//     if (existingUser) {
//       await t.rollback();
//       return res.status(400).json({ error: 'Email already registered' });
//     }

//     const existingCompany = await Company.findOne({
//       where: { [Op.or]: [{ TinNo: tin }, { RegistrationNo: registrationNumber }] },
//       transaction: t,
//     });
//     if (existingCompany) {
//       await t.rollback();
//       return res.status(400).json({ error: 'TIN or registration number already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const userId = uuidv4();
//     const targetRole = await Role.findOne({ where: { RoleName: 'Admin' }, transaction: t });
//     if (!targetRole) {
//       await t.rollback();
//       return res.status(400).json({ error: 'Role Admin not found' });
//     }

//     const user = await User.create({
//       userId,
//       firstName,
//       lastName,
//       username,
//       email,
//       password: hashedPassword,
//       RoleId: targetRole.RoleId,
//       status: 'Active',
//     }, { transaction: t });

//     const companyId = uuidv4();
//     await Company.create({
//       CompanyId: companyId,
//       ParentCompanyId: parentCompanyId || null,
//       CompanyName: companyName,
//       Phone: phone,
//       Email: companyEmail,
//       Address: `${streetAddress}, ${city}${state ? `, ${state}` : ''}, ${country}, ${postalCode}`,
//       TopPosition: topPosition,
//       Type: type,
//       EstablishedDate: fiscalYearStart,
//       TinNo: tin,
//       Logo: logoFile,
//       RegistrationNo: registrationNumber,
//       NoOfShareholders: parseInt(noOfShareholders) || 0,
//       RegisteredCapital: parseFloat(registeredCapital) || 0,
//       SubscribedCapital: parseFloat(subscribedCapital) || 0,
//       RegisteredShareQt: parseInt(registeredShareQt) || 0,
//       SubscribedShareQt: parseInt(subscribedShareQt) || 0,
//       ShareValue: parseFloat(shareValue) || 0,
//     }, { transaction: t });

//     await UserCompany.create({
//       UserId: userId,
//       CompanyId: companyId,
//     }, { transaction: t });

//     await UserRoleMapping.create({
//       UserId: userId,
//       RoleId: targetRole.RoleId,
//     }, { transaction: t });

//     await AuditLog.create({
//       Action: 'Register User and Company',
//       UserId: userId,
//       EntityType: 'User and Company',
//       EntityId: userId,
//       Timestamp: new Date(),
//       Details: JSON.stringify({ email, companyName, role: 'Admin', userId, companyId }),
//     }, { transaction: t });

//     const token = jwt.sign(
//       { userId, email, primaryRole: 'Admin', roles: ['Admin'] },
//       process.env.JWT_SECRET,
//       { expiresIn: '90d' }
//     );

//     await t.commit();
//     res.status(201).json({
//       token,
//       user: { userId, firstName, lastName, email, primaryRole: 'Admin', roles: ['Admin'] },
//       message: 'Registration successful. You can now log in.',
//     });
//   } catch (error) {
//     await t.rollback();
//     console.error('Register error:', {
//       message: error.message,
//       stack: error.stack,
//       response: error.response?.data,
//     });
//     let errorMessage = 'Failed to register';
//     if (error.name === 'SequelizeUniqueConstraintError') {
//       errorMessage = 'Email, TIN, or registration number already exists';
//     } else if (error.name === 'SequelizeValidationError') {
//       errorMessage = error.errors.map((e) => e.message).join(', ');
//     } else if (error.message) {
//       errorMessage = error.message;
//     }
//     res.status(400).json({ error: errorMessage });
//   }
// };

// export const createInvitations = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const invitations = req.body;
//     const userId = req.user.userId;

//     for (const { email, role, companyId, shareholderId } of invitations) {
//       if (!email || !role || !companyId) {
//         await t.rollback();
//         return res.status(400).json({ error: 'Email, role, and companyId are required' });
//       }
//       const invitationId = uuidv4();
//       const token = uuidv4();
//       await sequelize.models.Invitation.create({
//         id: invitationId,
//         email,
//         companyId,
//         roleId: role === 'hr' ? 'role_hr' : 'role_shareholder',
//         shareholderId,
//         token,
//         status: 'Pending',
//         created_by: userId,
//       }, { transaction: t });

//       await AuditLog.create({
//         Action: 'Create Invitation',
//         UserId: userId,
//         EntityType: 'Invitation',
//         EntityId: invitationId,
//         Timestamp: new Date(),
//         Details: JSON.stringify({ email, role, companyId, shareholderId }),
//       }, { transaction: t });
//     }

//     await t.commit();
//     res.status(201).json({ message: 'Invitations sent successfully' });
//   } catch (error) {
//     await t.rollback();
//     console.error('Create invitations error:', { message: error.message, stack: error.stack });
//     res.status(500).json({ error: 'Failed to send invitations' });
//   }
// };



// Very Latest

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

// export const register = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const { username, email, password, RoleId, Status, companies } = req.body;
//     const logoFile = req.file ? req.file.path : null;

//     if (!username || !email || !password || !RoleId || !Status) {
//       await t.rollback();
//       return res.status(400).json({ error: 'All required fields must be provided' });
//     }

//     const existingUser = await User.findOne({ where: { email }, transaction: t });
//     if (existingUser) {
//       await t.rollback();
//       return res.status(400).json({ error: 'Email already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const userId = uuidv4();
//     const user = await User.create({
//       userId,
//       username,
//       email,
//       password: hashedPassword,
//       RoleId,
//       status: Status,
//       profilePic: logoFile,
//     }, { transaction: t });

//     await UserRoleMapping.create({
//       UserId: userId,
//       RoleId,
//     }, { transaction: t });

//     if (companies && Array.isArray(companies)) {
//       for (const companyId of companies) {
//         await UserCompany.create({
//           UserId: userId,
//           CompanyId: companyId,
//           Status: 'Active',
//         }, { transaction: t });
//       }
//     }

//     await AuditLog.create({
//       Action: 'Register User',
//       UserId: userId,
//       EntityType: 'User',
//       EntityId: userId,
//       Timestamp: new Date(),
//       Details: JSON.stringify({ username, email, RoleId, Status, companies }),
//     }, { transaction: t });

//     await t.commit();
//     res.status(201).json({ message: 'User registered successfully', userId });
//   } catch (error) {
//     await t.rollback();
//     console.error('Register error:', {
//       message: error.message,
//       stack: error.stack,
//     });
//     let errorMessage = 'Failed to register';
//     if (error.name === 'SequelizeUniqueConstraintError') {
//       errorMessage = 'Email already exists';
//     } else if (error.name === 'SequelizeValidationError') {
//       errorMessage = error.errors.map((e) => e.message).join(', ');
//     }
//     res.status(400).json({ error: errorMessage });
//   }
// };


// export const register = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const {
//       firstName, lastName, email, password, companyName, tin, registrationNumber,
//       type, industry, fiscalYearStart, parentCompanyId, topPosition, phone, companyEmail,
//       streetAddress, city, state, country, postalCode, noOfShareholders,
//       registeredCapital, subscribedCapital, registeredShareQt, subscribedShareQt, shareValue
//     } = req.body;
//     const logoFile = req.file ? req.file.path : null;

//     if (!firstName || !lastName || !email || !password || !companyName || !tin || !registrationNumber) {
//       await t.rollback();
//       return res.status(400).json({ error: 'All required fields must be provided' });
//     }

//     const existingUser = await User.findOne({ where: { email }, transaction: t });
//     if (existingUser) {
//       await t.rollback();
//       return res.status(400).json({ error: 'Email already exists' });
//     }

//     const existingCompany = await Company.findOne({
//       where: {
//         [Op.or]: [{ TinNo: tin }, { RegistrationNo: registrationNumber }],
//       },
//       transaction: t,
//     });
//     if (existingCompany) {
//       await t.rollback();
//       return res.status(400).json({ error: 'TIN or Registration Number already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const userId = uuidv4();
//     const companyId = uuidv4();

//     const targetRole = await Role.findOne({ where: { RoleName: 'Admin' }, transaction: t });
//     if (!targetRole) {
//       await t.rollback();
//       return res.status(400).json({ error: 'Admin role not found' });
//     }

//     const user = await User.create({
//       userId,
//       username: `${firstName} ${lastName}`,
//       email,
//       password: hashedPassword,
//       RoleId: targetRole.RoleId,
//       status: 'Pending',
//       verified: false,
//     }, { transaction: t });

//     await Company.create({
//       CompanyId: companyId,
//       Name: companyName,
//       Type: type,
//       Industry: industry,
//       EstablishedDate: fiscalYearStart,
//       TinNo: tin,
//       RegistrationNo: registrationNumber,
//       Logo: logoFile,
//       NoOfShareholders: parseInt(noOfShareholders) || 0,
//       RegisteredCapital: parseFloat(registeredCapital) || 0,
//       SubscribedCapital: parseFloat(subscribedCapital) || 0,
//       RegisteredShareQt: parseInt(registeredShareQt) || 0,
//       SubscribedShareQt: parseInt(subscribedShareQt) || 0,
//       ShareValue: parseFloat(shareValue) || 0,
//     }, { transaction: t });

//     await UserCompany.create({
//       UserId: userId,
//       CompanyId: companyId,
//     }, { transaction: t });

//     await UserRoleMapping.create({
//       UserId: userId,
//       RoleId: targetRole.RoleId,
//     }, { transaction: t });

//     await AuditLog.create({
//       Action: 'Register User and Company',
//       UserId: userId,
//       EntityType: 'User and Company',
//       EntityId: userId,
//       Timestamp: new Date(),
//       Details: JSON.stringify({ email, companyName, role: 'Admin', userId, companyId }),
//     }, { transaction: t });

//     const token = jwt.sign(
//       { userId, email, primaryRole: 'Admin', roles: ['Admin'] },
//       process.env.JWT_SECRET,
//       { expiresIn: '90d' }
//     );

//     await t.commit();
//     res.status(201).json({
//       token,
//       user: { userId, firstName, lastName, email, primaryRole: 'Admin', roles: ['Admin'] },
//       message: 'Registration successful. You can now log in.',
//     });
//   } catch (error) {
//     await t.rollback();
//     console.error('Register error:', {
//       message: error.message,
//       stack: error.stack,
//       response: error.response?.data,
//     });
//     let errorMessage = 'Failed to register';
//     if (error.name === 'SequelizeUniqueConstraintError') {
//       errorMessage = 'Email, TIN, or registration number already exists';
//     } else if (error.name === 'SequelizeValidationError') {
//       errorMessage = error.errors.map((e) => e.message).join(', ');
//     } else if (error.message) {
//       errorMessage = error.message;
//     }
//     res.status(400).json({ error: errorMessage });
//   }
// };

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