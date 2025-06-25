import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  if (!token || !password) {
    return NextResponse.json({ error: 'Token ve yeni şifre gerekli' }, { status: 400 });
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