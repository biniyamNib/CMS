import Notification from '../models/notificationModel.js';
import Company from '../models/companyModel.js';
import User from '../models/userModel.js';
import UserCompany from '../models/userCompanyModel.js';
import sequelize from '../config/database.js';

export const getAllNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { entityType } = req.query;

    const userCompanies = await UserCompany.findAll({
      where: { UserId: userId },
      attributes: ['CompanyId'],
      raw: true,
    });

    if (!userCompanies.length) {
      return res.status(200).json([]);
    }

    const companyIds = userCompanies.map(uc => uc.CompanyId);
    const where = { CompanyId: companyIds };
    if (entityType) where.EntityType = entityType;

    const notifications = await Notification.findAll({
      where,
      include: [
        {
          model: Company,
          attributes: ['CompanyName'],
        },
        {
          model: User,
          as: 'User',
          attributes: ['userId', 'username'],
        },
      ],
      order: [['Timestamp', 'DESC']],
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Get all notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { notificationId } = req.params;
    const userId = req.user.userId;

    const notification = await Notification.findOne({
      where: { NotificationId: notificationId },
      include: [{
        model: Company,
        include: [{
          model: UserCompany,
          where: { UserId: userId },
          attributes: [],
          required: true,
        }],
      }],
      transaction: t,
    });

    if (!notification) {
      await t.rollback();
      return res.status(404).json({ error: 'Notification not found or access denied' });
    }

    await notification.update({ ReadStatus: true }, { transaction: t });
    await t.commit();
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    await t.rollback();
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

export const deleteNotification = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { notificationId } = req.params;
    const userId = req.user.userId;

    const notification = await Notification.findOne({
      where: { NotificationId: notificationId },
      include: [{
        model: Company,
        include: [{
          model: UserCompany,
          where: { UserId: userId },
          attributes: [],
          required: true,
        }],
      }],
      transaction: t,
    });

    if (!notification) {
      await t.rollback();
      return res.status(404).json({ error: 'Notification not found or access denied' });
    }

    await notification.destroy({ transaction: t });
    await t.commit();
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    await t.rollback();
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

export const getNotificationReport = async (req, res) => {
  try {
    const { CompanyId, entityType, isRead } = req.query;
    const userId = req.user.userId;

    const userCompanies = await UserCompany.findAll({
      where: { UserId: userId },
      attributes: ['CompanyId'],
      raw: true,
    });

    if (!userCompanies.length) {
      return res.status(200).json([]);
    }

    const companyIds = userCompanies.map(uc => uc.CompanyId);
    const where = { CompanyId: companyIds };
    if (CompanyId) where.CompanyId = CompanyId;
    if (entityType && entityType !== 'All') where.EntityType = entityType;
    if (isRead !== undefined) where.ReadStatus = isRead === 'true';

    const notifications = await Notification.findAll({
      where,
      attributes: [
        'EntityType',
        'Action',
        'ReadStatus',
        [sequelize.fn('COUNT', sequelize.col('NotificationId')), 'Count'],
      ],
      include: [{ model: Company, attributes: ['CompanyName'] }],
      group: ['EntityType', 'Action', 'ReadStatus', 'Company.CompanyName'],
      order: [['EntityType', 'ASC'], ['Action', 'ASC']],
    });

    await AuditLog.create({
      Action: 'Generate Notification Report',
      UserId: userId,
      EntityType: 'Report',
      Timestamp: new Date(),
      Details: JSON.stringify({ filters: { CompanyId, entityType, isRead } }),
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Get notification report error:', error);
    res.status(500).json({ error: 'Failed to generate notification report' });
  }
};