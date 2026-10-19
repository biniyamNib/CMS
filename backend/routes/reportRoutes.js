import express from 'express';
import { getDesignationSummary } from '../controllers/reportController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const reportRouter = express.Router();

reportRouter.use(protect);
reportRouter.use(restrictTo('SuperAdmin','Admin', 'HR'));

reportRouter.get('/reports/designation-summary', getDesignationSummary);

export default reportRouter;