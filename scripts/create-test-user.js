const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🔧 Test kullanıcısı oluşturuluyor...\n');
    
    // Test kullanıcısı bilgileri
    const testUsers = [
      {
        email: 'test@drawtica.com',
        name: 'Test Kullanıcı',
        password: 'Test123!',
        role: 'FREE',
        credits: 3
      },
      {
        email: 'admin@drawtica.com',
        name: 'Admin Kullanıcı',
        password: 'Admin123!',
        role: 'PREMIUM',
        credits: 10
      },
      {
        email: 'demo@drawtica.com',
        name: 'Demo Kullanıcı',
        password: 'Demo123!',
        role: 'FREE',
        credits: 1
      }
    ];

    for (const userData of testUsers) {
      // Şifreyi hash'le
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      // Kullanıcıyı oluştur
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          password: hashedPassword,
          role: userData.role,
          credits: userData.credits,
          emailVerified: true
        }
      });

      console.log(`✅ Kullanıcı oluşturuldu:`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Ad: ${user.name}`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   Krediler: ${user.credits}`);
      console.log(`   Şifre: ${userData.password}`);
      console.log('');
    }

    console.log('🎉 Tüm test kullanıcıları oluşturuldu!');
    console.log('\n📝 Giriş bilgileri:');
    console.log('   test@drawtica.com / Test123!');
    console.log('   admin@drawtica.com / Admin123!');
    console.log('   demo@drawtica.com / Demo123!');

  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Bazı kullanıcılar zaten mevcut.');
    } else {
      console.error('❌ Hata:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser(); 