import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';

async function resetAdmin() {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL?.replace(/"/g, '');
  const adminPassword = process.env.ADMIN_PASSWORD?.replace(/"/g, '');

  if (!adminEmail || !adminPassword) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set');
    process.exit(1);
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(adminPassword, salt);

  const db = mongoose.connection.db;

  const result = await db.collection('user').updateOne(
    { email: adminEmail },
    { $set: { password: hash, role: 'admin' } },
    { upsert: false }
  );

  if (result.matchedCount === 0) {
    // Create fresh
    await db.collection('user').insertOne({
      name: 'Admin',
      email: adminEmail,
      password: hash,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('Admin created:', adminEmail);
  } else {
    console.log('Admin password updated:', adminEmail);
  }

  await mongoose.disconnect();
}

resetAdmin();
