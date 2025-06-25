import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { sendEmail } from '@/lib/sendEmail';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: 'E-posta gerekli' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Güvenlik için her zaman başarılı yanıt dön
    return NextResponse.json({ message: 'Eğer bu e-posta sistemde varsa, sıfırlama linki gönderildi.' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 saat geçerli

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpires },
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

  await sendEmail({
    to: email,
    subject: 'Drawtica Şifre Sıfırlama',
    html: `<p>Şifrenizi sıfırlamak için <a href="${resetUrl}">buraya tıklayın</a>. Bu link 1 saat geçerlidir.</p>`
  });

  return NextResponse.json({ message: 'Eğer bu e-posta sistemde varsa, sıfırlama linki gönderildi.' });
} 