import express from 'express';
import {
  getShareholders,
  getShareholder,
  createShareholder,
  updateShareholder,
  deleteShareholder,
  assignShareholderToCompany,
  getShareholderHistory,
} from '../controllers/shareholderController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const shareholderRouter = express.Router();

shareholderRouter.use((req, res, next) => {
  console.log(`ShareholderRouter: ${req.method} ${req.originalUrl}`);
  next();
});

// Specific routes
shareholderRouter.post('/shareholders/assign', protect, restrictTo('SuperAdmin', 'Admin'), assignShareholderToCompany);
shareholderRouter.get('/shareholders/:shareholderId/history', protect, getShareholderHistory);

// General routes
shareholderRouter.get('/shareholders', protect, getShareholders);
shareholderRouter.get('/shareholders/:shareholderId', protect, getShareholder);
shareholderRouter.post('/shareholders', protect, restrictTo('SuperAdmin', 'Admin'), createShareholder);
shareholderRouter.put('/shareholders/:shareholderId', protect, restrictTo('SuperAdmin', 'Admin'), updateShareholder);
shareholderRouter.delete('/shareholders/:shareholderId', protect, restrictTo('SuperAdmin', 'Admin'), deleteShareholder);

export default shareholderRouter;