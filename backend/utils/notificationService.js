import cron from 'node-cron';
import { Op } from 'sequelize';
import Notification from '../models/notificationModel.js';
import License from '../models/licenseModel.js';
import OrgStructure from '../models/orgStructureModel.js';
import Company from '../models/companyModel.js';
import UserOrgStructure from '../models/userOrgStructureModel.js';
import AuditLog from '../models/auditLogModel.js';
import sequelize from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

// Default system user ID for system-generated notifications
const SYSTEM_USER_ID = '52c245df-c433-442e-bab8-e4ff94b8a151';

// Check licenses and organizational structures daily at midnight
const scheduleNotifications = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running notification check for licenses and organizational structures...');
    const t = await sequelize.transaction();
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to start of day
      const thirtyDaysFromNow = new Date(today);
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      thirtyDaysFromNow.setHours(23, 59, 59, 999); // End of day

      // --- License Notifications ---
      const licenses = await License.findAll({
        where: {
          ExpireDate: {
            [Op.lte]: thirtyDaysFromNow.toISOString().split('T')[0], // DATEONLY comparison
          },
        },
        include: [{ model: Company, attributes: ['CompanyName'] }],
        transaction: t,
      });

      const licenseNotifications = [];
      for (const license of licenses) {
        const expiryDate = new Date(license.ExpireDate);
        const isExpired = expiryDate < today;
        const action = isExpired ? 'LicenseExpired' : 'LicenseExpiringSoon';
        const message = isExpired
          ? `License No. ${license.LicenseNo} (${license.Type}) for ${license.Company?.CompanyName || 'Unknown Company'} has expired on ${license.ExpireDate}.`
          : `License No. ${license.LicenseNo} (${license.Type}) for ${license.Company?.CompanyName || 'Unknown Company'} is expiring soon on ${license.ExpireDate}.`;

        // Check for existing notification
        const existingNotification = await Notification.findOne({
          where: {
            EntityType: 'License',
            EntityId: license.LicenseId,
            Action: action,
          },
          transaction: t,
        });

        if (!existingNotification) {
          licenseNotifications.push({
            NotificationId: uuidv4(),
            CompanyId: license.CompanyId,
            UserId: SYSTEM_USER_ID,
            Message: message,
            EntityType: 'License',
            EntityId: license.LicenseId,
            Action: action,
            Timestamp: new Date(),
            ReadStatus: false,
          });
        }
      }

      // --- OrgStructure Notifications ---
      const orgStructures = await OrgStructure.findAll({
        where: {
          StructureType: 'Temporary',
          ExpiryDate: {
            [Op.lte]: thirtyDaysFromNow,
          },
          Status: 'Active',
        },
        include: [{ model: Company, attributes: ['CompanyName'] }],
        transaction: t,
      });

      const orgStructureNotifications = [];
      for (const structure of orgStructures) {
        const expiryDate = new Date(structure.ExpiryDate);
        const isExpired = expiryDate < today;
        const action = isExpired ? 'OrgStructureExpired' : 'OrgStructureExpiringSoon';
        const message = isExpired
          ? `Organizational Structure "${structure.StructureName}" for ${structure.Company?.CompanyName || 'Unknown Company'} has expired on ${structure.ExpiryDate.toISOString().split('T')[0]}.`
          : `Organizational Structure "${structure.StructureName}" for ${structure.Company?.CompanyName || 'Unknown Company'} is expiring soon on ${structure.ExpiryDate.toISOString().split('T')[0]}.`;

        // Check for existing notification
        const existingNotification = await Notification.findOne({
          where: {
            EntityType: 'OrgStructure',
            EntityId: structure.OrgStructureId,
            Action: action,
          },
          transaction: t,
        });

        if (!existingNotification) {
          orgStructureNotifications.push({
            NotificationId: uuidv4(),
            CompanyId: structure.CompanyId,
            UserId: SYSTEM_USER_ID,
            Message: message,
            EntityType: 'OrgStructure',
            EntityId: structure.OrgStructureId,
            Action: action,
            Timestamp: new Date(),
            ReadStatus: false,
          });
        }

        // Archive expired structures
        if (isExpired) {
          await UserOrgStructure.destroy({
            where: { OrgStructureId: structure.OrgStructureId },
            transaction: t,
          });
          await structure.update({ Status: 'Inactive' }, { transaction: t });

          // Update parent isLeaf
          if (structure.ReportingToId) {
            const siblingStructures = await OrgStructure.count({
              where: { ReportingToId: structure.ReportingToId, Status: 'Active' },
              transaction: t,
            });
            if (siblingStructures === 0) {
              await OrgStructure.update(
                { isLeaf: true },
                { where: { OrgStructureId: structure.ReportingToId }, transaction: t }
              );
            }
          }
        }
      }

      // Create notifications
      const notifications = [...licenseNotifications, ...orgStructureNotifications];
      if (notifications.length > 0) {
        await Notification.bulkCreate(notifications, { transaction: t });

        // Log notification creation
        for (const notification of notifications) {
          await AuditLog.create({
            Action: 'Create Notification',
            UserId: SYSTEM_USER_ID,
            TargetId: notification.NotificationId,
            EntityId: notification.EntityId,
            EntityType: notification.EntityType,
            Timestamp: new Date(),
            Details: JSON.stringify({ Message: notification.Message, Action: notification.Action }),
          }, { transaction: t });
        }
      }

      // Log archiving of expired structures
      for (const structure of orgStructures.filter(s => new Date(s.ExpiryDate) < today)) {
        await AuditLog.create({
          Action: 'Archive OrgStructure',
          UserId: SYSTEM_USER_ID,
          EntityId: structure.OrgStructureId,
          EntityType: 'OrgStructure',
          Timestamp: new Date(),
          Details: JSON.stringify({ StructureName: structure.StructureName, ExpiryDate: structure.ExpiryDate }),
        }, { transaction: t });
      }

      await t.commit();
      console.log(`Generated ${notifications.length} notifications (${licenseNotifications.length} licenses, ${orgStructureNotifications.length} org structures).`);
    } catch (error) {
      await t.rollback();
      console.error('Notification check error:', error);
    }
  });
};

// Start the scheduler
const startNotificationScheduler = () => {
  scheduleNotifications();
  console.log('Notification scheduler started.');
};

export { startNotificationScheduler };