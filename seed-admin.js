const mongoose = require('mongoose');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

// Define User Schema locally for seeding to avoid ESM/CommonJS issues in standalone script
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: {
    type: String,
    select: true
  },
  role: {
    type: String,
    default: 'user'
  }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seedAdmin() {
  const MONGODB_URI = process.env.MONGODB_URI;
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@bookease.app';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env.local');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Simple hash for demo purposes if bcrypt is not available
    // In a real app, use bcrypt. Moving to crypto for zero-dependency seed.
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(adminPassword, salt, 1000, 64, 'sha512').toString('hex');
    const hashedPassword = `${salt}:${hash}`;

    // Update or create admin
    const admin = await User.findOneAndUpdate(
      { email: adminEmail },
      {
        name: 'Admin',
        password: hashedPassword,
        role: 'admin'
      },
      { upsert: true, new: true }
    );

    console.log(`Admin user ${admin.email} seeded successfully!`);
    console.log('Password stored as salted hash.');
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedAdmin();
