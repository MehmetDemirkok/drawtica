# Vercel Deployment Checklist

## Environment Variables (Vercel Dashboard'da ayarlanmalı)

### Zorunlu Environment Variables:
```
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your_secure_jwt_secret_here
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

### Opsiyonel Environment Variables:
```
RESEND_API_KEY=your_resend_api_key
GEMINI_API_KEY=your_gemini_api_key
IYZICO_API_KEY=your_iyzico_api_key
IYZICO_SECRET_KEY=your_iyzico_secret_key
```

## Database Setup

1. **PostgreSQL Database**: Vercel Postgres veya external PostgreSQL kullanın
2. **Prisma Migration**: Deploy sonrası migration çalıştırın:
   ```bash
   npx prisma migrate deploy
   ```

## Deployment Sonrası Kontroller

1. **Health Check**: `https://your-domain.vercel.app/api/health` endpoint'ini kontrol edin
2. **Database Connection**: Health check'te database status'ü "connected" olmalı
3. **Login/Register**: Test kullanıcısı ile login/register işlemlerini test edin

## Troubleshooting

### Login/Register Butonları Çalışmıyor

1. **Browser Console**: F12 ile console'da hata mesajlarını kontrol edin
2. **Network Tab**: API çağrılarının başarılı olup olmadığını kontrol edin
3. **Environment Variables**: Vercel dashboard'da tüm environment variable'ların doğru ayarlandığından emin olun

### Database Connection Error

1. **DATABASE_URL**: PostgreSQL connection string'in doğru olduğundan emin olun
2. **SSL**: Vercel Postgres kullanıyorsanız SSL gerekli olabilir
3. **Firewall**: External database kullanıyorsanız IP whitelist'i kontrol edin

### CORS Errors

1. **API Routes**: CORS headers'ın doğru ayarlandığından emin olun
2. **Domain**: NEXT_PUBLIC_BASE_URL'in doğru domain'i gösterdiğinden emin olun

## Common Issues

### "Database connection error"
- DATABASE_URL environment variable'ını kontrol edin
- Database'in erişilebilir olduğundan emin olun

### "JWT_SECRET is not defined"
- JWT_SECRET environment variable'ını ayarlayın
- Production'da güçlü bir secret kullanın

### "Network error"
- Internet bağlantısını kontrol edin
- API endpoint'lerinin doğru URL'de olduğundan emin olun

## Performance Optimization

1. **Prisma**: Connection pooling kullanın
2. **Caching**: Redis veya Vercel KV kullanmayı düşünün
3. **CDN**: Static assets için CDN kullanın 