export async function createPaymentForm() {
  return {
    token: 'dummy-token',
    checkoutFormContent: '<div style="padding:2rem;text-align:center;color:#fff;background:#222;border-radius:1rem;">Ödeme sistemi yakında eklenecektir.</div>'
  };
}

export async function handlePaymentCallback() {
  return { success: false, message: 'Ödeme sistemi yakında eklenecektir.' };
} 