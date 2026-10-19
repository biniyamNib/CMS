import Role from '../models/roleModel.js';
import User from '../models/userModel.js';
import UserRoleMapping from '../models/userRoleMappingModel.js';
import AuditLog from '../models/auditLogModel.js';
import sequelize from '../config/database.js';

export const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      attributes: ['RoleId', 'RoleName', 'Description', 'CreatedDate', 'UpdatedDate', 'Status'],
      include: [
        {
          model: User,
          as: 'Creator',
          attributes: ['username'],
        },
      ],
    });
    res.status(200).json(roles);
  } catch (error) {
    console.error('Get roles error:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
};

export const getRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id, {
      attributes: ['RoleId', 'RoleName', 'Description', 'CreatedDate', 'UpdatedDate', 'Status'],
      include: [
        {
          model: User,
          as: 'Creator',
          attributes: ['username'],
        },
      ],
    });
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.status(200).json(role);
  } catch (error) {
    console.error('Get role error:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to fetch role' });
  }
};

export const createRole = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { RoleName, Description, Status } = req.body;
    const currentUserId = req.user?.userId;

    // Validate authentication
    if (!currentUserId) {
      await t.rollback();
      return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
    }

    // Validate input
    if (!RoleName) {
      await t.rollback();
      return res.status(400).json({ error: 'RoleName is required' });
    }
    const validStatuses = ['Active', 'Inactive'];
    if (Status && !validStatuses.includes(Status)) {
      await t.rollback();
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const existingRole = await Role.findOne({ where: { RoleName }, transaction: t });
    if (existingRole) {
      await t.rollback();
      return res.status(400).json({ error: 'RoleName already exists' });
    }

    // Verify CreatedByUserId exists
    const creator = await User.findByPk(currentUserId, { transaction: t });
    if (!creator) {
      await t.rollback();
      return res.status(400).json({ error: 'Invalid CreatedByUserId: User not found' });
    }

    const role = await Role.create({
      RoleName,
      Description,
      CreatedByUserId: currentUserId,
      CreatedDate: new Date(),
      UpdatedDate: new Date(),
      Status: Status || 'Active',
    }, { transaction: t });

    await AuditLog.create({
      Action: 'Create Role',
      UserId: currentUserId,
      TargetId: role.RoleId,
      EntityId: role.RoleId,
      EntityType: 'Role',
      Timestamp: new Date(),
      Details: JSON.stringify({ RoleName, Description, Status: Status || 'Active' }),
    }, { transaction: t });

    await t.commit();
    res.status(201).json({ message: 'Role created successfully', RoleId: role.RoleId });
  } catch (error) {
    await t.rollback();
    console.error('Create role error:', { message: error.message, stack: error.stack });
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ error: 'Invalid foreign key reference' });
    }
    res.status(500).json({ error: 'Failed to create role' });
  }
};

export const updateRole = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { RoleName, Description, Status } = req.body;
    const currentUserId = req.user?.userId;

    // Validate authentication
    if (!currentUserId) {
      await t.rollback();
      return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
    }

    const role = await Role.findByPk(id, { transaction: t });
    if (!role) {
      await t.rollback();
      return res.status(404).json({ error: 'Role not found' });
    }

    // Validate input
    if (RoleName && RoleName !== role.RoleName) {
      const existingRole = await Role.findOne({ where: { RoleName }, transaction: t });
      if (existingRole) {
        await t.rollback();
        return res.status(400).json({ error: 'RoleName already exists' });
      }
    }
    const validStatuses = ['Active', 'Inactive'];
    if (Status && !validStatuses.includes(Status)) {
      await t.rollback();
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const oldData = { RoleName: role.RoleName, Description: role.Description, Status: role.Status };
    await role.update({
      RoleName: RoleName || role.RoleName,
      Description: Description !== undefined ? Description : role.Description,
      Status: Status || role.Status,
      UpdatedDate: new Date(),
    }, { transaction: t });

    await AuditLog.create({
      Action: 'Update Role',
      UserId: currentUserId,
      TargetId: id,
      EntityId: id,
      EntityType: 'Role',
      Timestamp: new Date(),
      Details: JSON.stringify({
        old: oldData,
        new: { RoleName: RoleName || role.RoleName, Description: Description !== undefined ? Description : role.Description, Status: Status || role.Status },
      }),
    }, { transaction: t });

    await t.commit();
    res.status(200).json({ message: 'Role updated successfully' });
  } catch (error) {
    await t.rollback();
    console.error('Update role error:', { message: error.message, stack: error.stack });
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ error: 'Invalid foreign key reference' });
    }
    res.status(500).json({ error: 'Failed to update role' });
  }
};

export const deleteRole = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const currentUserId = req.user?.userId;

    // Validate authentication
    if (!currentUserId) {
      await t.rollback();
      return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
    }

    const role = await Role.findByPk(id, { transaction: t });
    if (!role) {
      await t.rollback();
      return res.status(404).json({ error: 'Role not found' });
    }

    if (role.RoleName === 'SuperAdmin') {
      await t.rollback();
      return res.status(403).json({ error: 'Cannot delete SuperAdmin role' });
    }

    const activeMappings = await UserRoleMapping.count({
      where: { RoleId: id, Status: 'Active' },
      transaction: t,
    });
    if (activeMappings > 0) {
      await t.rollback();
      return res.status(400).json({ error: 'Cannot delete role with active user assignments' });
    }

    const roleData = { RoleName: role.RoleName, Description: role.Description, Status: role.Status };
    await role.destroy({ transaction: t });

    await AuditLog.create({
      Action: 'Delete Role',
      UserId: currentUserId,
      TargetId: id,
      EntityId: id,
      EntityType: 'Role',
      Timestamp: new Date(),
      Details: JSON.stringify({ deleted: roleData }),
    }, { transaction: t });

    await t.commit();
    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    await t.rollback();
    console.error('Delete role error:', { message: error.message, stack: error.stack });
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ error: 'Invalid foreign key reference' });
    }
    res.status(500).json({ error: 'Failed to delete role' });
  }
};