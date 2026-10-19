import { Op } from 'sequelize';
import Company from '../models/companyModel.js';
import User from '../models/userModel.js';
import Shareholder from '../models/shareholderModel.js';
import License from '../models/licenseModel.js';
import AuditLog from '../models/auditLogModel.js';
import sequelize from '../config/database.js';

export const getDashboardStats = async (req, res) => {
  try {
    const companyCount = await Company.count();
    const activeUserCount = await User.count({ where: { status: 'Active' } });
    const shareholderCount = await Shareholder.count();
    const pendingLicenseCount = await License.count({ where: { Status: 'Suspended' } });

    const stats = [
      {
        title: 'Total Companies',
        value: companyCount,
        change: '+0%',
        trend: 'up',
        progress: Math.min((companyCount / 200) * 100, 100),
        color: '#1890ff',
      },
      {
        title: 'Active Users',
        value: activeUserCount,
        change: '+0%',
        trend: 'up',
        progress: Math.min((activeUserCount / 50) * 100, 100),
        color: '#52c41a',
      },
      {
        title: 'Total Shareholders',
        value: shareholderCount,
        change: '+0%',
        trend: 'down',
        progress: Math.min((shareholderCount / 200) * 100, 100),
        color: '#722ed1',
      },
      {
        title: 'Pending Licenses',
        value: pendingLicenseCount,
        change: '+0%',
        trend: 'up',
        progress: Math.min((pendingLicenseCount / 50) * 100, 100),
        color: '#f5222d',
      },
    ];

    res.status(200).json(stats);
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

export const getRecentActivities = async (req, res) => {
  try {
    const activities = await AuditLog.findAll({
      include: [{ model: User, as: 'Actor', attributes: ['username'] }],
      order: [['Timestamp', 'DESC']],
      limit: 5,
    });

    const formattedActivities = activities.map(activity => ({
      key: activity.AuditLogId,
      activity: activity.Action,
      time: new Date(activity.Timestamp).toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }),
      status: activity.Action.toLowerCase().includes('create') || activity.Action.toLowerCase().includes('update') ? 'completed' : 'pending',
    }));

    res.status(200).json(formattedActivities);
  } catch (error) {
    console.error('Get recent activities error:', error);
    res.status(500).json({ error: 'Failed to fetch recent activities' });
  }
};

export const getCompanyRegistrations = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const registrations = await Company.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('COUNT', sequelize.col('CompanyId')), 'count'],
      ],
      where: {
        createdAt: { [Op.gte]: sixMonthsAgo },
      },
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'ASC']],
    });

    const chartData = {
      labels: [],
      datasets: [
        {
          label: 'Company Registrations',
          data: [],
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };

    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push(date.toLocaleString('en-US', { month: 'short', year: 'numeric' }));
    }

    chartData.labels = months;
    chartData.datasets[0].data = months.map(month => {
      const reg = registrations.find(r =>
        new Date(r.get('month')).toLocaleString('en-US', { month: 'short', year: 'numeric' }) === month
      );
      return reg ? parseInt(reg.get('count')) : 0;
    });

    res.status(200).json(chartData);
  } catch (error) {
    console.error('Get company registrations error:', error);
    res.status(500).json({ error: 'Failed to fetch company registrations' });
  }
};

export const getLicenseDistribution = async (req, res) => {
  try {
    const licenseDistribution = await License.findAll({
      attributes: [
        'Status',
        [sequelize.fn('COUNT', sequelize.col('LicenseId')), 'count'],
      ],
      group: ['Status'],
    });

    const chartData = {
      labels: ['Active', 'Expired', 'Suspended'],
      data: [0, 0, 0],
    };

    licenseDistribution.forEach(item => {
      const index = chartData.labels.indexOf(item.Status);
      if (index !== -1) {
        chartData.data[index] = parseInt(item.get('count'));
      }
    });

    res.status(200).json(chartData);
  } catch (error) {
    console.error('Get license distribution error:', error);
    res.status(500).json({ error: 'Failed to fetch license distribution' });
  }
};