import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ error: 'Token missing' }, { status: 400 });
  }

  const user = await prisma.user.findFirst({ where: { resetToken: token } });
  if (!user) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      resetToken: null,
      resetTokenExpires: null,
    },
  });

  return NextResponse.json({ message: 'Email verified successfully' });
} 