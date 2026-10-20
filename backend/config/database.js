import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Validate environment variables
const requiredEnvVars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS'];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

if (typeof process.env.DB_PASS !== 'string') {
  throw new Error('DB_PASS must be a string');
}

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Required for Neon and Render connections
    },
  },
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    throw error;
  }
}

testConnection();

export default sequelize;