import Newsletter from '../models/Newsletter.js';
import pkg from 'nodemailer';
const { createTransport } = pkg;

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (existing.isActive) {
        return res.status(400).json({ message: 'Email is already subscribed' });
      } else {
        existing.isActive = true;
        existing.subscribedAt = new Date();
        await existing.save();
        return res.status(200).json({ message: 'Subscription reactivated successfully' });
      }
    }

    const subscriber = new Newsletter({ email });
    await subscriber.save();
    res.status(201).json({ message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ message: 'Failed to subscribe', error: error.message });
  }
};

export const getSubscribers = async (req, res) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.replace(/"/g, '').trim();
    const query = adminEmail ? { email: { $ne: adminEmail } } : {};
    const subscribers = await Newsletter.find(query).sort({ subscribedAt: -1 });
    res.status(200).json({ subscribers });
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({ message: 'Failed to fetch subscribers', error: error.message });
  }
};

export const unsubscribe = async (req, res) => {
  try {
    const { id } = req.params;
    const subscriber = await Newsletter.findById(id);
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    
    // Check if already unsubscribed
    if (!subscriber.isActive) {
      return res.status(200).json({ 
        message: 'Already unsubscribed',
        alreadyUnsubscribed: true 
      });
    }
    
    subscriber.isActive = false;
    await subscriber.save();
    res.status(200).json({ 
      message: 'Unsubscribed successfully',
      alreadyUnsubscribed: false 
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ message: 'Failed to unsubscribe', error: error.message });
  }
};

export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    await Newsletter.findByIdAndDelete(id);
    res.status(200).json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    console.error('Delete subscriber error:', error);
    res.status(500).json({ message: 'Failed to delete subscriber', error: error.message });
  }
};

export const sendBulkEmail = async (req, res) => {
  try {
    const { subject, title, message, images = [] } = req.body;

    if (!subject || !title || !message) {
      return res.status(400).json({ message: 'Subject, title, and message are required' });
    }

    const subscribers = await Newsletter.find({ isActive: true });
    if (subscribers.length === 0) {
      return res.status(400).json({ message: 'No active subscribers found' });
    }

    const transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    // Build image HTML block
    const imagesHtml = Array.isArray(images) && images.length > 0
      ? `<div style="margin: 24px 0; display: flex; flex-wrap: wrap; gap: 12px;">
          ${images.map(url => `
            <img src="${url}" alt="" style="max-width: 100%; width: ${images.length === 1 ? '100%' : '48%'}; border-radius: 8px; object-fit: cover; display: block;" />
          `).join('')}
        </div>`
      : '';

    const emailPromises = subscribers.map(subscriber => {
      const mailOptions = {
        from: `"UpDownLive" <${process.env.SMTP_USER}>`,
        to: subscriber.email,
        subject,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f3f4f6; }
              .container { max-width: 600px; margin: 32px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
              .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 32px 30px; text-align: center; }
              .header h1 { margin: 0; font-size: 26px; font-weight: 700; }
              .content { padding: 32px 30px; }
              .message { white-space: pre-wrap; font-size: 15px; color: #374151; line-height: 1.8; }
              .footer { background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 20px 30px; text-align: center; font-size: 12px; color: #6b7280; }
              .unsubscribe { color: #3b82f6; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>${title}</h1>
              </div>
              <div class="content">
                ${imagesHtml}
                <p class="message">${message}</p>
              </div>
              <div class="footer">
                <p>You're receiving this because you subscribed to UpDownLive newsletter.</p>
                <p><a href="${process.env.FRONTEND_URL}/unsubscribe/${subscriber._id}" class="unsubscribe">Unsubscribe</a></p>
              </div>
            </div>
          </body>
          </html>
        `
      };
      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);
    res.status(200).json({ message: `Email sent successfully to ${subscribers.length} subscribers` });
  } catch (error) {
    console.error('Send bulk email error:', error);
    res.status(500).json({ message: 'Failed to send emails', error: error.message });
  }
};

export const syncUsersToNewsletter = async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const adminEmail = process.env.ADMIN_EMAIL?.replace(/"/g, '').trim();
    const users = await User.find({ email: { $ne: adminEmail } }).select('email createdAt').lean();

    let syncedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      if (!user.email) { skippedCount++; continue; }
      const existing = await Newsletter.findOne({ email: user.email });
      if (existing) { skippedCount++; continue; }
      await new Newsletter({ email: user.email, isActive: true, subscribedAt: user.createdAt || new Date() }).save();
      syncedCount++;
    }

    res.status(200).json({ message: 'User sync completed', synced: syncedCount, skipped: skippedCount, total: users.length });
  } catch (error) {
    console.error('Sync users error:', error);
    res.status(500).json({ message: 'Failed to sync users', error: error.message });
  }
};

export default {
  subscribe,
  getSubscribers,
  syncUsersToNewsletter,
  unsubscribe,
  deleteSubscriber,
  sendBulkEmail
};
