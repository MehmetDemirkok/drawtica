import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { hashPassword, isPasswordStrong } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  if (!token || !password) {
    return NextResponse.json({ error: 'Token ve yeni şifre gerekli' }, { status: 400 });
  }

  if (!isPasswordStrong(password)) {
    return NextResponse.json({ error: 'Şifre en az 8 karakter, bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir.' }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpires: { gt: new Date() },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş token' }, { status: 400 });
  }

  const hashedPassword = await hashPassword(password);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpires: null,
    },
  });

  return NextResponse.json({ message: 'Şifre başarıyla güncellendi.' });
} 