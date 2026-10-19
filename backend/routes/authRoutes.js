// import express from 'express';
// import { login, register } from '../controllers/authController.js';

// const authRouter = express.Router();

// authRouter.post('/login', login);
// authRouter.post('/register', register);

// export default authRouter;








// Updated

// import express from 'express';
// import multer from 'multer';
// import { login, register, verifyEmail, createInvitations } from '../controllers/authController.js';
// import { protect } from '../middlewares/authMiddleware.js';

// const authRouter = express.Router();

// // Configure multer with disk storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'Uploads/'); // Matches the static route in server.js
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
//     cb(null, `${uniqueSuffix}-${file.originalname}`);
//   },
// });
// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     // Optional: Restrict to image files
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed'), false);
//     }
//   },
// });

// // Routes
// authRouter.post('/login', login);
// authRouter.post('/register', upload.single('logoFile'), register); 
// // authRouter.post('/register', register);
// authRouter.get('/verify', verifyEmail);
// authRouter.post('/invitations/bulk', protect, createInvitations);

// export default authRouter;



// Latest

import express from 'express';
import multer from 'multer';
import { login, register, createInvitations } from '../controllers/authController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const authRouter = express.Router();

// Configure multer with disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Routes
authRouter.post('/login', login);
authRouter.post('/register', upload.single('logoFile'), register);
authRouter.post('/invitations/bulk', protect, createInvitations);

export default authRouter;