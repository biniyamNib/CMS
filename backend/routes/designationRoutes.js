import express from 'express';
import { getAllDesignations, getDesignation, createDesignation, updateDesignation, deleteDesignation } from '../controllers/designationController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const designationRouter = express.Router();

designationRouter.use(protect);
designationRouter.use(restrictTo('SuperAdmin','Admin', 'HR'));

designationRouter.get('/designations', getAllDesignations);
designationRouter.get('/designations/:designationId', getDesignation);
designationRouter.post('/designations', createDesignation);
designationRouter.put('/designations/:designationId', updateDesignation);
designationRouter.delete('/designations/:designationId', deleteDesignation);

export default designationRouter;