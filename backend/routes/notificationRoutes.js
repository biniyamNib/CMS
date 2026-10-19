import express from 'express';
import { getAllNotifications, markAsRead, deleteNotification } from '../controllers/notificationController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const notificationRouter = express.Router();

notificationRouter.use(protect);
notificationRouter.use(restrictTo('SuperAdmin','Admin', 'HR'));

notificationRouter.get('/notifications', getAllNotifications);
notificationRouter.put('/notifications/:notificationId/read', markAsRead);
notificationRouter.delete('/notifications/:notificationId', deleteNotification);

export default notificationRouter;