import { Op } from 'sequelize';
import OrgStructure from '../models/orgStructureModel.js';
import AuditLog from '../models/auditLogModel.js';
import UserOrgStructure from '../models/userOrgStructureModel.js';

const checkExpiredOrgStructures = async () => {
  try {
    const expiredStructures = await OrgStructure.findAll({
      where: {
        StructureType: 'Temporary',
        ExpiryDate: { [Op.lte]: new Date() },
        Status: 'Active',
      },
    });

    for (const structure of expiredStructures) {
      await UserOrgStructure.destroy({ where: { OrgStructureId: structure.OrgStructureId } });
      await structure.update({ Status: 'Inactive' });

      await AuditLog.create({
        Action: 'Archive OrgStructure',
        EntityId: structure.OrgStructureId,
        EntityType: 'OrgStructure',
        Timestamp: new Date(),
        Details: JSON.stringify({ StructureName: structure.StructureName, ExpiryDate: structure.ExpiryDate }),
      });

      // Update parent isLeaf if no other active sub-units
      if (structure.ReportingToId) {
        const siblingStructures = await OrgStructure.count({
          where: { ReportingToId: structure.ReportingToId, Status: 'Active' },
        });
        if (siblingStructures === 0) {
          await OrgStructure.update(
            { isLeaf: true },
            { where: { OrgStructureId: structure.ReportingToId } }
          );
        }
      }
    }

    console.log(`Archived ${expiredStructures.length} expired organizational structures`);
  } catch (error) {
    console.error('Expiry check error:', { message: error.message, stack: error.stack });
  }
};

// Run every hour
setInterval(checkExpiredOrgStructures, 60 * 60 * 1000);

export default checkExpiredOrgStructures;

