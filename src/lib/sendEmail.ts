import { Resend } from 'resend';

// Resend API key'i yoksa mock response döndür
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    // Resend API key'i yoksa mock response döndür
    if (!resend) {
      console.log('Resend API key not configured. Mock email sent:', { to, subject });
      return { id: 'mock-email-id' };
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@drawtica.com',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

export async function sendVerificationEmail(to: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Drawtica</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #333; margin-bottom: 20px;">E-posta Adresinizi Doğrulayın</h2>
        <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
          Drawtica hesabınızı aktifleştirmek için aşağıdaki butona tıklayın:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    display: inline-block; 
                    font-weight: bold;">
            E-posta Adresimi Doğrula
          </a>
        </div>
        <p style="color: #999; font-size: 14px; margin-top: 30px;">
          Bu e-posta otomatik olarak gönderilmiştir. Eğer bu işlemi siz yapmadıysanız, 
          bu e-postayı görmezden gelebilirsiniz.
        </p>
        <p style="color: #999; font-size: 14px;">
          Sorun yaşıyorsanız, butona tıklamak yerine şu linki tarayıcınıza kopyalayabilirsiniz:<br>
          <a href="${verifyUrl}" style="color: #667eea;">${verifyUrl}</a>
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to,
    subject: 'Drawtica - E-posta Doğrulama',
    html,
  });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Drawtica</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #333; margin-bottom: 20px;">Şifre Sıfırlama</h2>
        <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
          Şifrenizi sıfırlamak için aşağıdaki butona tıklayın. Bu link 1 saat geçerlidir.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    display: inline-block; 
                    font-weight: bold;">
            Şifremi Sıfırla
          </a>
        </div>
        <p style="color: #999; font-size: 14px; margin-top: 30px;">
          Bu e-posta otomatik olarak gönderilmiştir. Eğer şifre sıfırlama talebinde bulunmadıysanız, 
          bu e-postayı görmezden gelebilirsiniz.
        </p>
        <p style="color: #999; font-size: 14px;">
          Sorun yaşıyorsanız, butona tıklamak yerine şu linki tarayıcınıza kopyalayabilirsiniz:<br>
          <a href="${resetUrl}" style="color: #667eea;">${resetUrl}</a>
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to,
    subject: 'Drawtica - Şifre Sıfırlama',
    html,
  });
} 