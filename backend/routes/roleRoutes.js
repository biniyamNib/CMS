import express from 'express';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
} from '../controllers/roleController.js';

const roleRouter = express.Router();

roleRouter
  .route('/roles')
  .get(protect, restrictTo('SuperAdmin','Admin'), getRoles)
  .post(protect, restrictTo('SuperAdmin','Admin'), createRole);

roleRouter
  .route('/roles/:id')
  .get(protect, restrictTo('SuperAdmin','Admin'), getRole)
  .patch(protect, restrictTo('SuperAdmin','Admin'), updateRole)
  .delete(protect, restrictTo('SuperAdmin','Admin'), deleteRole);

export default roleRouter;