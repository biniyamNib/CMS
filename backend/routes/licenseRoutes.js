import express from 'express';
import {
  getAllLicenses,
  getLicenses,
  getLicense,
  createLicense,
  updateLicense,
  deleteLicense,
} from '../controllers/licenseController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const licenseRouter = express.Router();

licenseRouter.get('/licenses', protect, restrictTo('SuperAdmin', 'Admin'), getAllLicenses);
licenseRouter.get('/companies/:companyId/licenses', protect, restrictTo('SuperAdmin', 'Admin'), getLicenses);
licenseRouter.get('/licenses/:licenseId', protect, restrictTo('SuperAdmin', 'Admin'), getLicense);
licenseRouter.post('/licenses', protect, restrictTo('SuperAdmin', 'Admin'), createLicense);
licenseRouter.put('/licenses/:licenseId', protect, restrictTo('SuperAdmin', 'Admin'), updateLicense);
licenseRouter.delete('/licenses/:licenseId', protect, restrictTo('SuperAdmin', 'Admin'), deleteLicense);

export default licenseRouter;