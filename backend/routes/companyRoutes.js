import express from 'express';
import {
  getCompanies,
  createCompany,
  updateCompany,
  createSubCompany,
  getAuditLogs,
  deleteCompany,
} from '../controllers/companyController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js';

const companyRouter = express.Router();

companyRouter.get('/companies', protect, restrictTo('SuperAdmin', 'Admin'), getCompanies);
companyRouter.post('/companies', protect, restrictTo('SuperAdmin', 'Admin'), upload.single('logoFile'), createCompany);
companyRouter.put('/companies/:companyId', protect, restrictTo('SuperAdmin', 'Admin'), upload.single('logoFile'), updateCompany);
companyRouter.post('/companies/:parentCompanyId/sub-companies', protect, restrictTo('SuperAdmin', 'Admin'), upload.single('logoFile'), createSubCompany);
companyRouter.get('/companies/:companyId/audit-logs', protect, restrictTo('SuperAdmin', 'Admin'), getAuditLogs);
companyRouter.delete('/companies/:companyId', protect, restrictTo('SuperAdmin', 'Admin'), deleteCompany);

export default companyRouter;