import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/chatmind_college';
    console.log('[Seed] Connecting to MongoDB:', mongoUri);
    await mongoose.connect(mongoUri);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@chatmind.edu';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const adminName = process.env.ADMIN_NAME || 'System Administrator';

    let admin = await User.findOne({ email: adminEmail.toLowerCase() });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    if (admin) {
      admin.password = hashedPassword;
      admin.role = 'admin';
      admin.name = adminName;
      await admin.save();
      console.log(`[Seed] Existing Admin user updated: ${adminEmail}`);
    } else {
      admin = await User.create({
        name: adminName,
        email: adminEmail.toLowerCase(),
        password: hashedPassword,
        role: 'admin',
      });
      console.log(`[Seed] New Admin user created successfully: ${adminEmail}`);
    }

    console.log('----------------------------------------------------');
    console.log('Admin Credentials for Login:');
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('Role:     admin');
    console.log('----------------------------------------------------');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedAdmin();
