import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../../.env') });

import mongoose from 'mongoose';
import User from '../models/User.js';
import connectDB from '../config/db.js';

export async function initAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL?.replace(/"/g, '').trim();
  const adminPassword = process.env.ADMIN_PASSWORD?.replace(/"/g, '').trim();

  if (!adminEmail || !adminPassword) {
    console.warn('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set — skipping admin init');
    return;
  }

  try {
    await connectDB();
    const existing = await User.findOne({ email: adminEmail }).select('+password');

    if (existing) {
      // Always sync password + role from .env so login always works
      existing.password = adminPassword; // pre-save hook will hash it
      existing.role = 'admin';
      await existing.save();
      console.log(`✅ Admin synced: ${adminEmail}`);
    } else {
      await User.create({ name: 'Admin', email: adminEmail, password: adminPassword, role: 'admin' });
      console.log(`✅ Admin created: ${adminEmail}`);
    }
  } catch (error) {
    console.error('❌ Admin init error:', error.message);
  }
}

// Allow running directly: node src/scripts/initAdmin.js
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initAdmin().then(() => mongoose.disconnect());
}
