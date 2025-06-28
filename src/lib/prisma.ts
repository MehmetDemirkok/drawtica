import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Database bağlantısını test et
prisma.$connect()
  .then(() => {
    console.log('✅ Database bağlantısı başarılı');
  })
  .catch((error) => {
    console.error('❌ Database bağlantı hatası:', error);
  });

export default prisma; 