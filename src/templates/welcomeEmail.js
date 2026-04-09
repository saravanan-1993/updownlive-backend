export const generateWelcomeEmail = (userName) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to UpDownLive</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f7fa;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); overflow: hidden;">
          
          <!-- Header with Brand -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                <span style="color: #60a5fa;">Up</span><span style="color: #ffffff;">Down</span><span style="color: #ef4444;">Live</span>
              </h1>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #e0e7ff; font-weight: 500;">Global Market & News Portal</p>
            </td>
          </tr>

          <!-- Welcome Message -->
          <tr>
            <td style="padding: 50px 40px 30px 40px;">
              <h2 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 700; color: #1e293b; line-height: 1.3;">
                Welcome to UpDownLive, ${userName}! 🎉
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #475569;">
                Thank you for joining our community of traders and investors. We're thrilled to have you on board!
              </p>
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #475569;">
                Your account has been successfully created, and you now have access to our comprehensive suite of market tools and real-time financial data.
              </p>
            </td>
          </tr>

          <!-- Features Section -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 30px; border-left: 4px solid #3b82f6;">
                <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #1e293b;">
                  What You Can Do Now:
                </h3>
                
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 12px 0; vertical-align: top;">
                      <span style="display: inline-block; width: 28px; height: 28px; background-color: #3b82f6; border-radius: 50%; text-align: center; line-height: 28px; color: #ffffff; font-weight: bold; font-size: 14px; margin-right: 12px;">📊</span>
                      <span style="font-size: 15px; color: #334155; font-weight: 600;">Access Real-Time Market Data</span>
                      <p style="margin: 5px 0 0 40px; font-size: 14px; color: #64748b; line-height: 1.5;">Track Forex, Gold, Oil, Crypto, and Stock markets live.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; vertical-align: top;">
                      <span style="display: inline-block; width: 28px; height: 28px; background-color: #3b82f6; border-radius: 50%; text-align: center; line-height: 28px; color: #ffffff; font-weight: bold; font-size: 14px; margin-right: 12px;">📰</span>
                      <span style="font-size: 15px; color: #334155; font-weight: 600;">Stay Updated with Breaking News</span>
                      <p style="margin: 5px 0 0 40px; font-size: 14px; color: #64748b; line-height: 1.5;">Get instant updates on market-moving events and analysis.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; vertical-align: top;">
                      <span style="display: inline-block; width: 28px; height: 28px; background-color: #3b82f6; border-radius: 50%; text-align: center; line-height: 28px; color: #ffffff; font-weight: bold; font-size: 14px; margin-right: 12px;">📅</span>
                      <span style="font-size: 15px; color: #334155; font-weight: 600;">Monitor Economic Calendar</span>
                      <p style="margin: 5px 0 0 40px; font-size: 14px; color: #64748b; line-height: 1.5;">Track important economic events and data releases.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; vertical-align: top;">
                      <span style="display: inline-block; width: 28px; height: 28px; background-color: #3b82f6; border-radius: 50%; text-align: center; line-height: 28px; color: #ffffff; font-weight: bold; font-size: 14px; margin-right: 12px;">📈</span>
                      <span style="font-size: 15px; color: #334155; font-weight: 600;">Advanced Charting Tools</span>
                      <p style="margin: 5px 0 0 40px; font-size: 14px; color: #64748b; line-height: 1.5;">Analyze markets with professional-grade charts.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; vertical-align: top;">
                      <span style="display: inline-block; width: 28px; height: 28px; background-color: #3b82f6; border-radius: 50%; text-align: center; line-height: 28px; color: #ffffff; font-weight: bold; font-size: 14px; margin-right: 12px;">🏦</span>
                      <span style="font-size: 15px; color: #334155; font-weight: 600;">Compare Brokers</span>
                      <p style="margin: 5px 0 0 40px; font-size: 14px; color: #64748b; line-height: 1.5;">Find the best trading platforms for your needs.</p>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); transition: all 0.3s;">
                Start Exploring Markets →
              </a>
            </td>
          </tr>

          <!-- Tips Section -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <div style="background-color: #fef3c7; border-radius: 12px; padding: 25px; border-left: 4px solid #f59e0b;">
                <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #92400e; display: flex; align-items: center;">
                  💡 Pro Tip
                </h3>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #78350f;">
                  Subscribe to our daily newsletter to receive market insights, analysis, and breaking news directly in your inbox. Stay ahead of the curve!
                </p>
              </div>
            </td>
          </tr>

          <!-- Support Section -->
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center;">
              <p style="margin: 0 0 15px 0; font-size: 15px; color: #475569; line-height: 1.6;">
                Need help getting started? Our support team is here for you.
              </p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/contact-us" style="color: #3b82f6; text-decoration: none; font-weight: 600; font-size: 15px;">
                Contact Support →
              </a>
            </td>
          </tr>

          <!-- Risk Warning -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <div style="background-color: #fef2f2; border-radius: 12px; padding: 20px; border-left: 4px solid #ef4444;">
                <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #991b1b;">
                  <strong style="color: #dc2626;">⚠️ Risk Warning:</strong> Trading foreign exchange, cryptocurrencies, and other financial instruments carries a high level of risk and may not be suitable for all investors. Please ensure you fully understand the risks involved and seek independent advice if necessary.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px 40px; border-top: 1px solid #e2e8f0;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="text-align: center; padding-bottom: 15px;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="color: #64748b; text-decoration: none; font-size: 13px; margin: 0 10px;">Home</a>
                    <span style="color: #cbd5e1;">|</span>
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/about-us" style="color: #64748b; text-decoration: none; font-size: 13px; margin: 0 10px;">About Us</a>
                    <span style="color: #cbd5e1;">|</span>
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/contact-us" style="color: #64748b; text-decoration: none; font-size: 13px; margin: 0 10px;">Contact</a>
                    <span style="color: #cbd5e1;">|</span>
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/terms" style="color: #64748b; text-decoration: none; font-size: 13px; margin: 0 10px;">Terms</a>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 15px; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 10px 0; font-size: 13px; color: #64748b;">
                      © ${new Date().getFullYear()} UpDownLive Limited. All rights reserved.
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                      You're receiving this email because you registered for an account at UpDownLive.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

export const generateWelcomeEmailText = (userName) => {
  return `
Welcome to UpDownLive, ${userName}!

Thank you for joining our community of traders and investors. We're thrilled to have you on board!

Your account has been successfully created, and you now have access to our comprehensive suite of market tools and real-time financial data.

WHAT YOU CAN DO NOW:

📊 Access Real-Time Market Data
   Track Forex, Gold, Oil, Crypto, and Stock markets live.

📰 Stay Updated with Breaking News
   Get instant updates on market-moving events and analysis.

📅 Monitor Economic Calendar
   Track important economic events and data releases.

📈 Advanced Charting Tools
   Analyze markets with professional-grade charts.

🏦 Compare Brokers
   Find the best trading platforms for your needs.

Get Started: ${process.env.FRONTEND_URL || 'http://localhost:3000'}

💡 PRO TIP:
Subscribe to our daily newsletter to receive market insights, analysis, and breaking news directly in your inbox. Stay ahead of the curve!

Need help getting started? Our support team is here for you.
Contact Support: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/contact-us

⚠️ RISK WARNING:
Trading foreign exchange, cryptocurrencies, and other financial instruments carries a high level of risk and may not be suitable for all investors. Please ensure you fully understand the risks involved and seek independent advice if necessary.

---
© ${new Date().getFullYear()} UpDownLive Limited. All rights reserved.

You're receiving this email because you registered for an account at UpDownLive.
  `.trim();
};
