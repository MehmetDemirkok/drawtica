export async function createPaymentForm(amount: number, userId: string, planId: string) {
  return {
    token: 'dummy-token',
    checkoutFormContent: '<div style="padding:2rem;text-align:center;color:#fff;background:#222;border-radius:1rem;">Ödeme sistemi yakında eklenecektir.</div>'
  };
}

export async function handlePaymentCallback(token: string) {
  return { success: false, message: 'Ödeme sistemi yakında eklenecektir.' };
}

function getPlanName(planId: string): string {
  switch (planId) {
    case 'premium-monthly':
      return 'Premium Aylık Plan';
    case 'premium-yearly':
      return 'Premium Yıllık Plan';
    default:
      return 'Premium Plan';
  }
}

function calculateCredits(amount: number): number {
  if (amount === 29.99) return 100; // Aylık plan
  if (amount === 299.99) return 1500; // Yıllık plan
  return Math.floor(amount * 3); // Varsayılan: Her 1 TL için 3 kredi
}

function calculatePremiumExpiry(amount: number): Date {
  const now = new Date();
  if (amount === 299.99) {
    return new Date(now.setFullYear(now.getFullYear() + 1));
  }
  return new Date(now.setMonth(now.getMonth() + 1));
} 