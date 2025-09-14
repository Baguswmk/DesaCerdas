import dotenv from 'dotenv';
import app from './src/app.js';
import { testDatabaseConnection } from './config/database.js';
import { initializeStorage } from './src/utils/supabaseStorage.js';

dotenv.config();

const requiredEnvVars = [
  'DATABASE_URL',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('📋 Please check your .env file and ensure all required variables are set');
  process.exit(1);
}

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const startServer = async () => {
  try {
    console.log('🚀 Starting Desa Cerdas Backend Server...');
    console.log(`📍 Environment: ${NODE_ENV}`);
    console.log(`🔧 Node Version: ${process.version}`);
    
    console.log('🔍 Testing database connection...');
    await testDatabaseConnection();
    
    console.log('📦 Initializing Supabase storage...');
    await initializeStorage();
    
    const server = app.listen(PORT, () => {
      console.log('✅ Server started successfully!');
      console.log(`🌐 Backend running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API docs: http://localhost:${PORT}/api`);
      console.log('🎯 Ready to accept connections!');
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        console.log('💡 Try using a different port or kill the process using this port');
      } else {
        console.error('❌ Server error:', error.message);
      }
      process.exit(1);
    });

    const gracefulShutdown = () => {
      console.log('\n🛑 Received shutdown signal, closing server gracefully...');
      
      server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
      });

      setTimeout(() => {
        console.log('❌ Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
});

startServer();  