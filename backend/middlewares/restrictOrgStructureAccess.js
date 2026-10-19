import UserOrgStructure from '../models/userOrgStructureModel.js';

const restrictOrgStructureAccess = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const isSuperAdmin = req.user.role === 'SuperAdmin';
    const { orgStructureId } = req.params;

    if (isSuperAdmin) {
      return next();
    }

    const userOrgStructure = await UserOrgStructure.findOne({ where: { UserId: userId, OrgStructureId: orgStructureId, Status: 'Active' } });
    if (!userOrgStructure) {
      return res.status(403).json({ error: 'Unauthorized to access this organizational structure' });
    }

    next();
  } catch (error) {
    console.error('Restrict org structure access error:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to verify access' });
  }
};

export default restrictOrgStructureAccess;