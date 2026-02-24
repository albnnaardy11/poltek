import nodemailer from 'nodemailer';
import { getPublicSettings } from '@/actions/public';

// Setup Nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export async function sendAutoReply(name: string, email: string) {
  try {
    const settings = await getPublicSettings();
    const campusName = settings.campus_name || "Politeknik Prestasi Prima";
    
    // Check if SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('SMTP setup missing. Mocking auto-reply email to:', email);
      return { success: true, mocked: true };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"${campusName}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: `Konfirmasi Penerimaan Pesan - ${campusName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #1D234E; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${campusName}</h1>
          </div>
          <div style="padding: 30px; background-color: #ffffff;">
            <p style="font-size: 16px; color: #333;">Yth. Bapak/Ibu <strong>${name}</strong>,</p>
            <p style="font-size: 16px; color: #333; line-height: 1.5;">
              Terima kasih telah menghubungi kami. Pesan Anda telah kami terima dengan baik. 
              Tim Customer Service kami akan segera menindaklanjuti dan merespon pertanyaan Anda dalam waktu maksimal 1x24 jam kerja.
            </p>
            <p style="font-size: 16px; color: #333; line-height: 1.5;">
              Jika Anda memiliki keperluan mendesak, silakan hubungi Hotline kami di: 
              <strong>${settings.contact_phone || "0813-8000-8079"}</strong>.
            </p>
            <br/>
            <p style="font-size: 14px; color: #666;">
              Hormat kami,<br/>
              <strong>Tim Admisi & Layanan<br/>${campusName}</strong>
            </p>
          </div>
          <div style="background-color: #f8fafc; padding: 15px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">
              Pesan ini dibuat otomatis oleh sistem, mohon untuk tidak membalas email ini.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending auto-reply email:", error);
    return { success: false, error };
  }
}

export async function sendAdminNotification(data: { name: string, email: string, category: string, subject: string, message: string }) {
  try {
    const settings = await getPublicSettings();
    const campusName = settings.campus_name || "Politeknik Prestasi Prima";
    // Send to notification_email from settings, fallback to contact_email, then fallback to SMTP_USER
    const adminEmail = settings.notification_email || settings.contact_email || process.env.SMTP_USER;

    if (!adminEmail || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Admin email or SMTP missing. Mocking admin notification to:', adminEmail);
      return { success: true, mocked: true };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"${campusName} System" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `[INBOX BARU] ${data.category || 'Pesan'}: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #f15a24; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px;">INBOX MASUK BARU</h1>
          </div>
          <div style="padding: 30px; background-color: #ffffff;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; width: 120px;"><strong>Pengirim</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>Email</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                  <a href="mailto:${data.email}" style="color: #f15a24;">${data.email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>Kategori</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><span style="background-color: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${data.category || '-'}</span></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>Subjek</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${data.subject || '-'}</td>
              </tr>
            </table>
            <div style="margin-top: 20px;">
              <strong>Pesan Lengkap:</strong>
              <div style="margin-top: 10px; padding: 15px; background-color: #f8fafc; border-left: 4px solid #f15a24; border-radius: 4px; white-space: pre-wrap;">${data.message}</div>
            </div>
            <div style="margin-top: 30px; text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/inbox" style="display: inline-block; padding: 12px 24px; background-color: #1D234E; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Buka Admin Inbox</a>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending admin notification:", error);
    return { success: false, error };
  }
}
