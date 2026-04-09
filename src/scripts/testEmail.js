import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env') });

import nodemailer from 'nodemailer';

async function testEmailConfiguration() {
  console.log('🔍 Testing Email Configuration...\n');
  
  console.log('Configuration:');
  console.log('- SMTP Host:', process.env.SMTP_HOST);
  console.log('- SMTP Port:', process.env.SMTP_PORT);
  console.log('- SMTP User:', process.env.SMTP_USER);
  console.log('- SMTP Pass:', process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-4) : 'NOT SET');
  console.log('');

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    console.log('✅ Transporter created successfully\n');

    // Verify connection
    console.log('🔌 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified!\n');

    // Send test email
    console.log('📧 Sending test email...');
    const info = await transporter.sendMail({
      from: `"UpDownLive Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to yourself
      subject: 'Newsletter System Test Email',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .success { color: #10b981; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">Newsletter System Test</h1>
            </div>
            <div class="content">
              <p class="success">✅ Email configuration is working correctly!</p>
              <p>Your newsletter system is ready to send emails.</p>
              <p><strong>Configuration Details:</strong></p>
              <ul>
                <li>SMTP Host: ${process.env.SMTP_HOST}</li>
                <li>SMTP Port: ${process.env.SMTP_PORT}</li>
                <li>From Email: ${process.env.SMTP_USER}</li>
              </ul>
              <p>You can now send newsletters to your subscribers.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log('📬 Message ID:', info.messageId);
    console.log('📧 Check your inbox:', process.env.SMTP_USER);
    console.log('\n🎉 Email system is working correctly!\n');

  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check your SMTP credentials in .env file');
    console.error('2. If using Gmail, enable "App Passwords" in Google Account settings');
    console.error('3. Make sure SMTP_PASS is a valid App Password (not your regular password)');
    console.error('4. Check if your firewall is blocking port 587');
    console.error('\nFull error:', error);
  }
}

testEmailConfiguration();
