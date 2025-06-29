# Neon Database Setup for Vercel

## Environment Variables (Vercel Dashboard)

### Zorunlu Variables:
```
DATABASE_URL=postgres://neondb_owner:npg_9Lvc3JUekgnh@ep-lucky-truth-a4c9ikz6-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your_secure_jwt_secret_here_minimum_32_characters
NEXT_PUBLIC_BASE_URL=https://your-vercel-domain.vercel.app
```

### Opsiyonel Variables:
```
RESEND_API_KEY=your_resend_api_key
GEMINI_API_KEY=your_gemini_api_key
```

## Neon Database Özellikleri

✅ **Connection Pooling**: Neon otomatik olarak connection pooling sağlar
✅ **SSL Required**: `sslmode=require` parametresi zorunlu
✅ **Serverless**: Vercel ile mükemmel uyum
✅ **Auto-scaling**: Otomatik ölçeklendirme

## Deployment Adımları

1. **Vercel Dashboard'da Environment Variables Ayarlayın:**
   - Project Settings > Environment Variables
   - DATABASE_URL, JWT_SECRET, NEXT_PUBLIC_BASE_URL ekleyin

2. **Deploy Edin:**
   ```bash
   git add .
   git commit -m "Neon database optimization"
   git push
   ```

3. **Migration Çalıştırın (Vercel'de otomatik):**
   - Build script'te `prisma generate` zaten var
   - Migration'lar otomatik çalışacak

## Test Etme

1. **Health Check:**
   ```
   https://your-domain.vercel.app/api/health
   ```

2. **Database Connection Test:**
   - Health check'te "database: connected" görmeli

3. **Login/Register Test:**
   - Test kullanıcısı oluşturun
   - Login/register işlemlerini test edin

## Troubleshooting

### "Database connection error"
- DATABASE_URL'in doğru olduğundan emin olun
- SSL mode'un `require` olduğunu kontrol edin

### "Connection timeout"
- Neon'un connection pooling kullandığından emin olun
- Pooler URL'ini kullandığınızı kontrol edin

### "SSL connection error"
- `sslmode=require` parametresinin URL'de olduğundan emin olun

## Performance Tips

1. **Connection Pooling**: Neon otomatik sağlar
2. **Read Replicas**: Gerekirse Neon'da read replica ekleyin
3. **Caching**: Vercel KV veya Redis kullanmayı düşünün

## Neon Dashboard

- [Neon Console](https://console.neon.tech)
- Connection string'leri buradan alabilirsiniz
- Database metrics'leri takip edebilirsiniz 