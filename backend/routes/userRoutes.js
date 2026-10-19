import express from 'express';
// import { getCurrentUser } from '../controllers/authController.js';
// import { protect, restrictTo } from '../middlewares/auth.js';
import multer from 'multer';
import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  assignUserToCompany,
  getUserCompanies,
  // requestPasswordReset,
  // resetPassword,
  // enable2FA,
  // verify2FA,
  // getRoles,
  // updateProfile
} from '../controllers/userController.js';
// import { enable2FA, requestPasswordReset, resetPassword, verify2FA } from '../controllers/userControllerAdditional.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile-pics/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});


const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory as Buffer
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
  // fileFilter: (req, file, cb) => {
  //   if (file.mimetype.startsWith('image/')) {
  //     cb(null, true);
  //   } else {
  //     cb(new Error('Only image files are allowed!'), false);
  //   }
  // },
});


userRouter.get('/users', protect, restrictTo('SuperAdmin', 'Admin', 'HR' ), getUsers);
// userRouter.get('/users/me', protect, getCurrentUser);
userRouter.get('/users/:id', protect, restrictTo('SuperAdmin', 'Admin', 'HR'), getUser);
userRouter.post('/users', protect, restrictTo('SuperAdmin', 'Admin'), createUser);
userRouter.patch('/users/:id', protect, restrictTo('SuperAdmin', 'Admin', ),upload.single('profilePic'), updateUser);
userRouter.delete('/users/:id', protect, restrictTo('SuperAdmin', 'Admin'), deleteUser);
// userRouter.post('/users/reset-password-request', requestPasswordReset);
// userRouter.post('/users/reset-password', resetPassword);
// userRouter.post('/users/:id/enable-2fa', protect, enable2FA);
// userRouter.post('/users/verify-2fa', protect, verify2FA);
//userRouter.get('/roles', protect, restrictTo('Admin'), getRoles);
userRouter.post('/users/assign-company', protect, restrictTo('SuperAdmin', 'Admin'), assignUserToCompany);
userRouter.get('/users/:id/companies', protect, restrictTo('SuperAdmin', 'Admin', 'HR'), getUserCompanies);

export default userRouter;