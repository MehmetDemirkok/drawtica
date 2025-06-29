const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listUsers() {
  try {
    console.log('🔍 Kullanıcılar listeleniyor...\n');
    
    const users = await prisma.user.findMany({
      include: {
        images: true,
        transactions: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (users.length === 0) {
      console.log('❌ Henüz hiç kullanıcı yok.');
      return;
    }

    console.log(`📊 Toplam ${users.length} kullanıcı bulundu:\n`);

    users.forEach((user, index) => {
      console.log(`👤 Kullanıcı ${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Ad: ${user.name || 'Belirtilmemiş'}`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   Krediler: ${user.credits}`);
      console.log(`   Email Doğrulandı: ${user.emailVerified ? '✅' : '❌'}`);
      console.log(`   Kayıt Tarihi: ${user.createdAt.toLocaleString('tr-TR')}`);
      console.log(`   Son Güncelleme: ${user.updatedAt.toLocaleString('tr-TR')}`);
      console.log(`   Oluşturulan Resimler: ${user.images.length}`);
      console.log(`   İşlemler: ${user.transactions.length}`);
      
      if (user.premiumUntil) {
        console.log(`   Premium Bitiş: ${user.premiumUntil.toLocaleString('tr-TR')}`);
      }
      
      console.log('');
    });

    // İstatistikler
    const totalImages = users.reduce((sum, user) => sum + user.images.length, 0);
    const totalTransactions = users.reduce((sum, user) => sum + user.transactions.length, 0);
    const verifiedUsers = users.filter(user => user.emailVerified).length;
    const premiumUsers = users.filter(user => user.role === 'PREMIUM').length;

    console.log('📈 İstatistikler:');
    console.log(`   Toplam Kullanıcı: ${users.length}`);
    console.log(`   Email Doğrulayan: ${verifiedUsers}`);
    console.log(`   Premium Kullanıcı: ${premiumUsers}`);
    console.log(`   Toplam Resim: ${totalImages}`);
    console.log(`   Toplam İşlem: ${totalTransactions}`);

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers(); 