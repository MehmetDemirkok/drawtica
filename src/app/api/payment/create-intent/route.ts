import { NextResponse } from 'next/server';
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

    const { amount, planId } = await request.json();
    if (!amount || !planId) {
      return NextResponse.json(
        { error: 'Tutar ve plan ID gerekli' },
        { status: 400 }
      );
    }

    // Dinamik import ile iyzipay fonksiyonunu çağır
    const { createPaymentForm } = await import('../iyzicoServer');
    const paymentForm = await createPaymentForm(amount, payload.userId, planId) as {
      token: string;
      checkoutFormContent: string;
    };

    return NextResponse.json({
      token: paymentForm.token,
      checkoutFormContent: paymentForm.checkoutFormContent,
    });
  } catch (error) {
    console.error('Payment form error:', error);
    return NextResponse.json(
      { error: 'Ödeme formu oluşturulamadı' },
      { status: 500 }
    );
  }
} 