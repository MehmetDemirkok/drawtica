import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function hashPassword(password: string) {
  return hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword);
}

export function createToken(userId: string) {
  return sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function createUser(email: string, password: string, name?: string, resetToken?: string, resetTokenExpires?: Date) {
  const hashedPassword = await hashPassword(password);
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      ...(resetToken && { resetToken }),
      ...(resetTokenExpires && { resetTokenExpires }),
    },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function updateUserCredits(userId: string, credits: number) {
  return prisma.user.update({
    where: { id: userId },
    data: { credits },
  });
}

export async function updateUserRole(userId: string, role: 'FREE' | 'PREMIUM', premiumUntil?: Date) {
  return prisma.user.update({
    where: { id: userId },
    data: { 
      role,
      premiumUntil,
    },
  });
}

// Şifre karmaşıklık kontrolü
export function isPasswordStrong(password: string): boolean {
  // En az 8 karakter, bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
} 