import express from 'express';
import {
  getOrgStructures,
  getOrgStructure,
  createOrgStructure,
  updateOrgStructure,
  deleteOrgStructure,
  getOrgChart,
  assignUserToOrgStructure,
//  getOrgStructureApprovals,
//  respondApprovalRequest,
  getOrgStructureHistory
} from '../controllers/orgStructureController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const orgStructureRouter = express.Router();

orgStructureRouter.use((req, res, next) => {
  console.log(`OrgStructureRouter: ${req.method} ${req.originalUrl}`);
  next();
});

// Specific routes first
//orgStructureRouter.get('/orgStructures/approvals', protect, restrictTo('SuperAdmin'), getOrgStructureApprovals);
//orgStructureRouter.put('/orgStructures/approvals/:approvalId', protect, restrictTo('SuperAdmin'), respondApprovalRequest);
orgStructureRouter.post('/orgStructures/assign', protect, restrictTo('SuperAdmin', 'Admin'), assignUserToOrgStructure);
orgStructureRouter.get('/orgStructures/:orgStructureId/history', protect, restrictTo('SuperAdmin', 'Admin'),getOrgStructureHistory);

// Dynamic routes last
orgStructureRouter.get('/orgStructures', protect, restrictTo('SuperAdmin', 'Admin'), getOrgStructures);
orgStructureRouter.get('/orgStructures/:orgStructureId', protect, restrictTo('SuperAdmin', 'Admin'),getOrgStructure);
orgStructureRouter.post('/orgStructures', protect, restrictTo('SuperAdmin', 'Admin'), createOrgStructure);
orgStructureRouter.put('/orgStructures/:orgStructureId', protect, restrictTo('SuperAdmin', 'Admin'), updateOrgStructure);
orgStructureRouter.delete('/orgStructures/:orgStructureId', protect, restrictTo('SuperAdmin', 'Admin'), deleteOrgStructure);
orgStructureRouter.get('/companies/:companyId/orgChart', protect, restrictTo('SuperAdmin', 'Admin'),getOrgChart);

export default orgStructureRouter;