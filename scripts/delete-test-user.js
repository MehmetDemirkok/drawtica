const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteTestUser() {
  try {
    const email = 'test@drawtica.com';
    const deleted = await prisma.user.deleteMany({ where: { email } });
    if (deleted.count > 0) {
      console.log(`✅ ${deleted.count} adet test kullanıcısı silindi: ${email}`);
    } else {
      console.log('❌ test@drawtica.com kullanıcısı bulunamadı.');
    }
  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteTestUser(); 