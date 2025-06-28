import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const token = formData.get('token') as string;

    if (!token) {
      return NextResponse.json(
        { error: 'Token gerekli' },
        { status: 400 }
      );
    }

    // Dinamik import ile iyzipay fonksiyonunu çağır
    const { handlePaymentCallback } = await import('../iyzicoServer');
    const updatedUser = await handlePaymentCallback(token);

    // Başarılı ödeme sonrası kullanıcıyı yönlendir
    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/?payment=success`;
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Payment callback error:', error);
    
    // Hata durumunda kullanıcıyı yönlendir
    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/?payment=error`;
    return NextResponse.redirect(redirectUrl);
  }
} 