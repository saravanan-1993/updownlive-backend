import dotenv from 'dotenv';
dotenv.config();

import { MongoClient } from 'mongodb';

async function checkAdmin() {
  const client = new MongoClient(process.env.DATABASE_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('user');
    
    const adminEmail = process.env.ADMIN_EMAIL?.replace(/"/g, '');
    
    console.log('Looking for user:', adminEmail);
    
    const user = await usersCollection.findOne({ email: adminEmail });
    
    if (user) {
      console.log('User found:');
      console.log('- ID:', user.id);
      console.log('- Email:', user.email);
      console.log('- Name:', user.name);
      console.log('- Role:', user.role);
      console.log('- Created:', user.createdAt);
      console.log('\nFull user object:', JSON.stringify(user, null, 2));
    } else {
      console.log('User not found!');
    }
    
    // List all users
    console.log('\n--- All users in database ---');
    const allUsers = await usersCollection.find({}).toArray();
    allUsers.forEach(u => {
      console.log(`- ${u.email} (role: ${u.role || 'NOT SET'})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkAdmin();
