// seeds.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Item from './models/Item.js';
import Store from './models/Store.js';
import User from './models/user.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

const seedItems = [
  { sku: 'MILK001', name: 'Milk', category: 'Dairy', unit: 'liters', price: 50 },
  { sku: 'BRD001', name: 'Bread', category: 'Bakery', unit: 'pcs', price: 30 },
  { sku: 'EGG001', name: 'Eggs', category: 'Poultry', unit: 'dozen', price: 60 },
  { sku: 'RICE001', name: 'Rice', category: 'Grains', unit: 'kg', price: 45 },
  { sku: 'OIL001', name: 'Cooking Oil', category: 'Grocery', unit: 'liters', price: 120 },
];

const defaultInventoryItem = (cur) => ({ cur, min: 0, max: 100, rop: 10 });

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected for seeding');

    // Clear existing data
    await Item.deleteMany();
    await Store.deleteMany();
    await User.deleteMany();
    console.log('Cleared existing data.');

    // Create a dummy owner
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const owner = new User({
        name: 'Default Owner',
        email: 'owner@test.com',
        password: hashedPassword,
        role: 'owner'
    });
    await owner.save();
    console.log(`✅ Created dummy owner: owner@test.com / password123`);

    // Create stores with the owner's ID
    const seedStores = [
      { name: 'MG Road Store', location: 'MG Road', pincode: '560001', owner: owner._id, inventory: { MILK001: defaultInventoryItem(5), BRD001: defaultInventoryItem(20) } },
      { name: 'Indiranagar Store', location: 'Indiranagar', pincode: '560002', owner: owner._id, inventory: { MILK001: defaultInventoryItem(10), RICE001: defaultInventoryItem(50) } },
      { name: 'Koramangala Store', location: 'Koramangala', pincode: '560003', owner: owner._id, inventory: { BRD001: defaultInventoryItem(8), EGG001: defaultInventoryItem(10) } },
    ];

    await Item.insertMany(seedItems);
    await Store.insertMany(seedStores);
    console.log(`✅ Seeded ${seedItems.length} items and ${seedStores.length} stores.`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase();