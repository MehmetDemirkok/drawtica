# Drawtica - AI Powered Coloring Page Generator

Drawtica, fotoğraflarınızı yapay zeka ile boyama sayfalarına dönüştüren modern bir web uygulamasıdır. Stripe entegrasyonu ile güvenli ödeme sistemi içerir.

## 🚀 Özellikler

- 🤖 **AI Destekli Dönüştürme**: Google Gemini API ile fotoğrafları boyama sayfalarına dönüştürme
- 💳 **Güvenli Ödeme**: Stripe entegrasyonu ile premium üyelik sistemi
- 🎨 **Yüksek Kalite**: PNG ve PDF formatlarında indirme
- 🔒 **Güvenli**: Kullanıcı verileri güvenli şekilde işlenir
- 📱 **Responsive**: Tüm cihazlarda mükemmel deneyim

## 🛠️ Teknolojiler

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL, Prisma ORM
- **Payment**: iyzico (Türkiye'de en popüler ödeme sistemi)
- **AI**: Google Gemini API
- **Authentication**: JWT
- **Email**: Nodemailer

## 📋 Kurulum

### 1. Repository'yi Klonlayın

```bash
git clone https://github.com/yourusername/drawtica.git
cd drawtica
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Environment Variables

`.env.local` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
# iyzico Configuration (Türkiye'de en popüler ödeme sistemi)
IYZICO_API_KEY=your_iyzico_api_key_here
IYZICO_SECRET_KEY=your_iyzico_secret_key_here
IYZICO_URI=https://sandbox-api.iyzipay.com

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/drawtica"

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password_here

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Database Kurulumu

```bash
# Prisma migration'ları çalıştırın
npx prisma migrate dev

# Database seed (opsiyonel)
npx prisma db seed
```

### 5. iyzico Kurulumu

1. [iyzico Dashboard](https://merchant.iyzipay.com)'a gidin
2. Test API key'lerini alın
3. Callback URL'ini ayarlayın: `https://yourdomain.com/api/payment/callback`
4. Sandbox modunda test edin

### 6. Development Server'ı Başlatın

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) adresinde uygulamayı görüntüleyin.

## 💳 Ödeme Sistemi (iyzico)

### Planlar

- **Ücretsiz**: 3 kredi (ücretsiz dönüştürme)
- **Premium Aylık**: ₺29.99 - 100 kredi
- **Premium Yıllık**: ₺299.99 - 1500 kredi

### Ödeme Akışı

1. Kullanıcı plan seçer
2. iyzico checkout form oluşturulur
3. Güvenli ödeme sayfasında kart bilgileri girilir
4. 3D Secure ile doğrulama
5. Callback ile kullanıcı kredileri güncellenir

### iyzico Avantajları

- ✅ Türkiye'de en popüler ödeme sistemi
- ✅ Türk Lirası desteği
- ✅ 3D Secure zorunlu (güvenlik)
- ✅ Taksit seçenekleri
- ✅ Kolay entegrasyon
- ✅ 7/24 destek

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/request-password-reset` - Şifre sıfırlama isteği
- `POST /api/auth/reset-password` - Şifre sıfırlama
- `POST /api/auth/verify-email` - Email doğrulama

### Payment
- `POST /api/payment/create-intent` - Ödeme intent oluşturma
- `POST /api/payment/webhook` - Stripe webhook handler

### Upload
- `POST /api/upload` - Fotoğraf yükleme ve dönüştürme

## 🚀 Deployment

### Vercel (Önerilen)

1. Vercel'e projeyi deploy edin
2. Environment variables'ları Vercel dashboard'da ayarlayın
3. Stripe webhook URL'ini güncelleyin
4. Database connection string'ini production'a göre ayarlayın

### Diğer Platformlar

- **Railway**: PostgreSQL hosting
- **Supabase**: Database ve authentication
- **Netlify**: Static hosting (SSR gerekli)

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

- Email: your-email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/) - React framework
- [Stripe](https://stripe.com/) - Payment processing
- [Google Gemini](https://ai.google.dev/) - AI API
- [Prisma](https://prisma.io/) - Database ORM
