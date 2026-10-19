import { syncDatabase } from '../models/index.js';

async function forceSync() {
  try {
    console.log('Starting database force sync...');
    await syncDatabase(true); // Force sync to recreate tables
    console.log('Database force synced successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error force syncing database:', {
      message: error.message,
      stack: error.stack,
      errors: error.errors || [],
    });
    process.exit(1);
  }
}

forceSync();