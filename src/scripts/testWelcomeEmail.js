import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env') });

import { sendEmail } from '../config/emailService.js';
import { generateWelcomeEmail, generateWelcomeEmailText } from '../templates/welcomeEmail.js';

async function testWelcomeEmail() {
  console.log('🔍 Testing Welcome Email Template...\n');
  
  const testUserName = 'John Doe';
  const testEmail = process.env.SMTP_USER || 'test@example.com';
  
  console.log('Configuration:');
  console.log('- Test User Name:', testUserName);
  console.log('- Test Email:', testEmail);
  console.log('- Frontend URL:', process.env.FRONTEND_URL || 'http://localhost:3000');
  console.log('');

  try {
    console.log('📧 Sending welcome email...');
    
    await sendEmail({
      to: testEmail,
      subject: '🎉 Welcome to UpDownLive - Your Market Journey Starts Here!',
      text: generateWelcomeEmailText(testUserName),
      html: generateWelcomeEmail(testUserName),
    });

    console.log('✅ Welcome email sent successfully!');
    console.log('📬 Check your inbox:', testEmail);
    console.log('\n🎉 Welcome email template is working correctly!\n');

  } catch (error) {
    console.error('❌ Welcome email test failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure your SMTP configuration is correct in .env');
    console.error('2. Run "node src/scripts/testEmail.js" first to verify basic email setup');
    console.error('3. Check if the email template has any syntax errors');
    console.error('\nFull error:', error);
  }
}

testWelcomeEmail();
