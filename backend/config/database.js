// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient({
//   log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
//   errorFormat: 'colorless'
// });


// process.on('SIGINT', async () => {
//   console.log('🔌 Menutup koneksi database...');
//   await prisma.$disconnect();
//   process.exit(0);
// });

// process.on('SIGTERM', async () => {
//   console.log('🔌 Menutup koneksi database...');
//   await prisma.$disconnect();
//   process.exit(0);
// });

// export default prisma;

import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

// Prisma Client Configuration
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error'] 
    : ['error'],
  errorFormat: 'colorless',
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase configuration. Please check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const testDatabaseConnection = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.log('⚠️  Supabase Storage warning:', error.message);
    } else {
      console.log('✅ Supabase connection successful');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

const gracefulShutdown = async () => {
  console.log('🔌 Closing database connections...');
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.error('❌ Error during database disconnect:', error);
  }
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown();
});

export default prisma;