import { NextResponse } from 'next/server';
import { createUser, findUserByEmail, createToken, isPasswordStrong } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/sendEmail';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email ve şifre gerekli' },
        { status: 400 }
      );
    }

    if (!isPasswordStrong(password)) {
      return NextResponse.json(
        { error: 'Şifre en az 8 karakter, bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir.' },
        { status: 400 }
      );
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kullanımda' },
        { status: 400 }
      );
    }

    // Doğrulama tokenı oluştur
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 saat geçerli

    // Kullanıcıyı token ile oluştur
    const user = await createUser(email, password, name, verificationToken, verificationTokenExpires);

    // E-posta doğrulama gönder
    await sendVerificationEmail(email, verificationToken);

    const token = createToken(user.id);

    return NextResponse.json({
      user: user,
      token,
      message: 'Kayıt başarılı! E-posta adresinizi kontrol edin.'
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Kayıt işlemi başarısız' },
      { status: 500 }
    );
  }
} 