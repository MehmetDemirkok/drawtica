import { NextResponse } from 'next/server';
import { findUserByEmail, verifyPassword, createToken } from '@/lib/auth';

// Basit rate limit (örnek amaçlı, production için önerilmez)
const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 dakika
const RATE_LIMIT_MAX = 5;

export async function POST(request: Request) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers });
  }

  try {
    // IP adresini al
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const entry = rateLimitMap.get(ip) || { count: 0, lastRequest: now };
    if (now - entry.lastRequest > RATE_LIMIT_WINDOW) {
      entry.count = 0;
      entry.lastRequest = now;
    }
    entry.count++;
    entry.lastRequest = now;
    rateLimitMap.set(ip, entry);
    if (entry.count > RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin.' }, 
        { status: 429, headers }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email ve şifre gerekli' },
        { status: 400, headers }
      );
    }

    // Database bağlantısını kontrol et
    let user;
    try {
      user = await findUserByEmail(email);
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database bağlantı hatası. Lütfen daha sonra tekrar deneyin.' },
        { status: 500, headers }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Email veya şifre hatalı' },
        { status: 401, headers }
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Email veya şifre hatalı' },
        { status: 401, headers }
      );
    }

    const token = createToken(user.id);

    return NextResponse.json({
      user,
      token,
    }, { headers });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Giriş işlemi başarısız. Lütfen daha sonra tekrar deneyin.' },
      { status: 500, headers }
    );
  }
} 