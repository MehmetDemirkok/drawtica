import Stripe from 'stripe';
import prisma from './prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-05-28.basil',
});

export async function createPaymentIntent(amount: number, userId: string) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'try',
    metadata: {
      userId,
    },
  });

  await prisma.transaction.create({
    data: {
      userId,
      amount,
      credits: calculateCredits(amount),
      status: 'PENDING',
    },
  });

  return paymentIntent;
}

export async function handlePaymentSuccess(paymentIntentId: string) {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  const userId = paymentIntent.metadata.userId;
  const amount = paymentIntent.amount / 100; // Convert from cents

  const credits = calculateCredits(amount);
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) throw new Error('User not found');

  // Update transaction status
  await prisma.transaction.updateMany({
    where: {
      userId,
      amount,
      status: 'PENDING',
    },
    data: {
      status: 'COMPLETED',
    },
  });

  // Update user credits and role
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      credits: user.credits + credits,
      role: 'PREMIUM',
      premiumUntil: calculatePremiumExpiry(amount),
    },
  });

  return updatedUser;
}

function calculateCredits(amount: number): number {
  // Örnek kredi hesaplama mantığı
  if (amount === 29.99) return 100; // Aylık plan
  if (amount === 299.99) return 1500; // Yıllık plan
  return Math.floor(amount * 3); // Varsayılan: Her 1 TL için 3 kredi
}

function calculatePremiumExpiry(amount: number): Date {
  const now = new Date();
  if (amount === 299.99) {
    // Yıllık plan
    return new Date(now.setFullYear(now.getFullYear() + 1));
  }
  // Aylık plan
  return new Date(now.setMonth(now.getMonth() + 1));
} 