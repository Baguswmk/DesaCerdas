import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  errorFormat: 'colorless'
});


process.on('SIGINT', async () => {
  console.log('🔌 Menutup koneksi database...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔌 Menutup koneksi database...');
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;