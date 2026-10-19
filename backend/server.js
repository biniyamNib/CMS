import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path'
import { syncDatabase } from './models/index.js';
import seedRoles from './seeds/seedRoles.js';
import dashboardRouter from './routes/dashboardRoutes.js'
import userRouter from './routes/userRoutes.js';
import roleRouter from './routes/roleRoutes.js';
import authRouter from './routes/authRoutes.js';
import companyRouter from './routes/companyRoutes.js';
import licenseRouter from './routes/licenseRoutes.js';
import orgStructureRouter from './routes/orgStructureRoutes.js';
import shareholderRouter from './routes/shareholderRoutes.js'
import designationRouter from './routes/designationRoutes.js'
import notificationRouter from './routes/notificationRoutes.js'
import reportRouter from './routes/reportRoutes.js'
import { startNotificationScheduler } from './utils/notificationService.js';
// import checkExpiredOrgStructures from './utils/expiryCheck.js';


// Load environment variables
const result = dotenv.config();
if (result.error) {
  console.error('Failed to load .env file:', result.error);
  process.exit(1);
}

if (process.env.NODE_ENV === 'development') {
  console.log('Environment variables loaded:', {
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS ? '[REDACTED]' : undefined,
    PORT: process.env.PORT,
  });
}

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'PUT','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/', userRouter);
app.use('/api/', roleRouter);
app.use('/api/', companyRouter);
app.use('/api/', orgStructureRouter);
app.use('/api/', shareholderRouter);
app.use('/api/', licenseRouter);
app.use('/api/', designationRouter);
app.use('/api/', notificationRouter);
app.use('/api/', reportRouter);
app.use('/api/', dashboardRouter);


// start scheduler
// checkExpiredOrgStructures();

// Start notification scheduler
startNotificationScheduler();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error:', {
    message: err.message,
    stack: err.stack,
  });
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Start server
async function startServer() {
  try {
    console.log('Initializing server...');
    await syncDatabase();
    console.log('Database initialization complete');
    try {
      await seedRoles();
      console.log('Role and SuperAdmin seeding complete');
    } catch (seedError) {
      console.warn('Role and SuperAdmin seeding failed, continuing server startup:', {
        message: seedError.message,
        stack: seedError.stack,
      });
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', {
      message: error.message,
      stack: error.stack,
      errors: error.errors || [],
    });
    process.exit(1);
  }
}

startServer();

