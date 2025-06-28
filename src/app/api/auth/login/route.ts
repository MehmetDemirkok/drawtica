import { NextResponse } from 'next/server';
import { findUserByEmail, verifyPassword, createToken } from '@/lib/auth';

// Basit rate limit (örnek amaçlı, production için önerilmez)
const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 dakika
const RATE_LIMIT_MAX = 5;

export async function POST(request: Request) {
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
      return NextResponse.json({ error: 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin.' }, { status: 429 });
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email ve şifre gerekli' },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Email veya şifre hatalı' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Email veya şifre hatalı' },
        { status: 401 }
      );
    }

    const token = createToken(user.id);

    return NextResponse.json({
      user,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Giriş işlemi başarısız' },
      { status: 500 }
    );
  }
} 