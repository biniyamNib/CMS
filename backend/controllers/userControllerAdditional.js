// //import Role from "../models/roleModel.js";
// import User from "../models/userModel.js";
// import AuditLog from "../models/auditLogModel.js";
// import bcrypt from "bcryptjs";
// import crypto from "crypto";
// import { sendEmail } from "../utils/email.js"; // Assumed utility
// import speakeasy from "speakeasy";

// // export const getRoles = async (req, res) => {
// //   try {
// //     const roles = await Role.findAll({
// //       where: { Status: 'Active' },
// //       attributes: ['RoleId', 'RoleName', 'Description'],
// //     });
// //     res.status(200).json(roles);
// //   } catch (error) {
// //     console.error('Get roles error:', error);
// //     res.status(500).json({ error: 'Server error' });
// //   }
// // };

// export const requestPasswordReset = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const resetToken = crypto.randomBytes(32).toString('hex');
//     const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
//     const resetTokenExpires = Date.now() + 3600000; // 1 hour

//     await user.update({
//       resetToken: resetTokenHash,
//       resetTokenExpires,
//       updatedDate: new Date(),
//     });

//     const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
//     await sendEmail({
//       to: user.email,
//       subject: 'Password Reset Request',
//       text: `Click here to reset your password: ${resetUrl}`,
//     });

//     await AuditLog.create({
//       Action: 'Request Password Reset',
//       UserId: user.userId,
//       TargetId: user.userId,
//       Timestamp: new Date(),
//     });

//     res.status(200).json({ message: 'Password reset email sent' });
//   } catch (error) {
//     console.error('Request password reset error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// export const resetPassword = async (req, res) => {
//   try {
//     const { token, newPassword } = req.body;
//     const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

//     const user = await User.findOne({
//       where: {
//         resetToken: resetTokenHash,
//         resetTokenExpires: { [Op.gt]: Date.now() },
//       },
//     });

//     if (!user) {
//       return res.status(400).json({ error: 'Invalid or expired token' });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     await user.update({
//       password: hashedPassword,
//       IsPasswordChanged: true,
//       resetToken: null,
//       resetTokenExpires: null,
//       updatedDate: new Date(),
//     });

//     await AuditLog.create({
//       Action: 'Reset Password',
//       UserId: user.userId,
//       TargetId: user.userId,
//       Timestamp: new Date(),
//     });

//     res.status(200).json({ message: 'Password reset successfully' });
//   } catch (error) {
//     console.error('Reset password error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// export const enable2FA = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findByPk(id);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const secret = speakeasy.generateSecret({ length: 20 });
//     await user.update({
//       twoFactorSecret: secret.base32,
//       updatedDate: new Date(),
//     });

//     await AuditLog.create({
//       Action: 'Enable 2FA',
//       UserId: req.user.userId,
//       TargetId: id,
//       Timestamp: new Date(),
//     });

//     res.status(200).json({
//       message: '2FA enabled',
//       qrCode: secret.otpauth_url, // For QR code generation
//     });
//   } catch (error) {
//     console.error('Enable 2FA error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// export const verify2FA = async (req, res) => {
//   try {
//     const { token } = req.body;
//     const user = await User.findByPk(req.user.userId);
//     if (!user || !user.twoFactorSecret) {
//       return res.status(400).json({ error: '2FA not enabled' });
//     }

//     const verified = speakeasy.totp.verify({
//       secret: user.twoFactorSecret,
//       encoding: 'base32',
//       token,
//     });

//     if (!verified) {
//       return res.status(400).json({ error: 'Invalid 2FA token' });
//     }

//     await AuditLog.create({
//       Action: 'Verify 2FA',
//       UserId: user.userId,
//       TargetId: user.userId,
//       Timestamp: new Date(),
//     });

//     res.status(200).json({ message: '2FA verified successfully' });
//   } catch (error) {
//     console.error('Verify 2FA error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };