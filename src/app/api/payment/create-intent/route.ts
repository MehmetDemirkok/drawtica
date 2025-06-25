import { NextResponse } from 'next/server';
import { createPaymentIntent } from '@/lib/payment';
import { verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization) {
      return NextResponse.json(
        { error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    const token = authorization.replace('Bearer ', '');
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Geçersiz token' },
        { status: 401 }
      );
    }

    const { amount } = await request.json();
    if (!amount) {
      return NextResponse.json(
        { error: 'Tutar gerekli' },
        { status: 400 }
      );
    }

    const paymentIntent = await createPaymentIntent(amount, payload.userId);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    return NextResponse.json(
      { error: 'Ödeme başlatılamadı' },
      { status: 500 }
    );
  }
} 