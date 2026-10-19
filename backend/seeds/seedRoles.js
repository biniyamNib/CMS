import Role from '../models/roleModel.js';
import User from '../models/userModel.js';
import UserRoleMapping from '../models/userRoleMappingModel.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

async function seedRoles() {
  try {
    console.log('Starting role and SuperAdmin seeding...');
    const roles = [
      { RoleId: uuidv4(), RoleName: 'SuperAdmin', Description: 'Full system access', Status: 'Active' },
      { RoleId: uuidv4(), RoleName: 'Admin', Description: 'Administrative access', Status: 'Active' },
      { RoleId: uuidv4(), RoleName: 'Company Representative', Description: 'Represents company interests', Status: 'Active' },
      { RoleId: uuidv4(), RoleName: 'HR', Description: 'Human resources management', Status: 'Active' },
      { RoleId: uuidv4(), RoleName: 'Legal', Description: 'Handles legal and compliance issues', Status: 'Active' },
      { RoleId: uuidv4(), RoleName: 'Auditor', Description: 'Conducts audits', Status: 'Active' },
      { RoleId: uuidv4(), RoleName: 'Finance', Description: 'Manages financial operations', Status: 'Active' },
      { RoleId: uuidv4(), RoleName: 'Shareholder', Description: 'Company shareholder', Status: 'Active' },
    ];

    // Seed valid roles
    for (const role of roles) {
      const existingRole = await Role.findOne({ where: { RoleName: role.RoleName } });
      if (!existingRole) {
        await Role.create(role);
        console.log(`Seeded role: ${role.RoleName}`);
      } else {
        console.log(`Role already exists: ${role.RoleName}`);
      }
    }

    // Fix invalid 'User' role
    const invalidRole = await Role.findOne({ where: { RoleName: 'User' } });
    if (invalidRole) {
      const defaultRole = await Role.findOne({ where: { RoleName: 'Company Representative' } });
      if (!defaultRole) {
        console.error('Default role Company Representative not found');
        throw new Error('Default role missing');
      }

      const usersWithInvalidRole = await User.findAll({ where: { RoleId: invalidRole.RoleId } });
      for (const user of usersWithInvalidRole) {
        console.log(`Updating user: ${user.email} from User to Company Representative`);
        await User.update(
          { RoleId: defaultRole.RoleId },
          { where: { userId: user.userId } }
        );
        const mapping = await UserRoleMapping.findOne({ where: { UserId: user.userId, RoleId: invalidRole.RoleId } });
        if (mapping) {
          await UserRoleMapping.update(
            { RoleId: defaultRole.RoleId },
            { where: { UserId: user.userId, RoleId: invalidRole.RoleId } }
          );
        } else {
          await UserRoleMapping.create({
            UserRoleMappingId: uuidv4(),
            UserId: user.userId,
            RoleId: defaultRole.RoleId,
            AssignedDate: new Date(),
            Status: 'Active',
          });
        }
      }

      await Role.destroy({ where: { RoleName: 'User' } });
      console.log('Removed invalid role: User');
    }

    // Seed SuperAdmin user
    const superAdminRole = await Role.findOne({ where: { RoleName: 'SuperAdmin' } });
    if (!superAdminRole) {
      throw new Error('SuperAdmin role not found');
    }

    const superAdminEmail = 'superadmin@cms.com';
    const existingSuperAdmin = await User.findOne({ where: { email: superAdminEmail } });
    if (!existingSuperAdmin) {
      const hashedPassword = await bcrypt.hash('SuperAdmin123!', 10);
      const superAdminUser = await User.create({
        userId: uuidv4(),
        username: 'superadmin',
        email: superAdminEmail,
        password: hashedPassword,
        RoleId: superAdminRole.RoleId,
        status: 'Active',
        IsPasswordChanged: false,
        createdDate: new Date(),
        updatedDate: new Date(),
      });

      await UserRoleMapping.create({
        UserRoleMappingId: uuidv4(),
        UserId: superAdminUser.userId,
        RoleId: superAdminRole.RoleId,
        AssignedDate: new Date(),
        Status: 'Active',
      });

      console.log(`Seeded SuperAdmin user: ${superAdminEmail}`);
    } else {
      console.log(`SuperAdmin user already exists: ${superAdminEmail}`);
    }

    console.log('Role and SuperAdmin seeding complete');
  } catch (error) {
    console.error('Error seeding roles and SuperAdmin:', {
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
}

export default seedRoles;
