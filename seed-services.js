const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

const services = [
  {
    name: 'Deep Tissue Massage',
    description: 'A therapeutic massage that focuses on realigning deeper layers of muscles and connective tissue.',
    price: 12000,
    duration: 60,
    category: 'Wellness',
    active: true,
  },
  {
    name: 'Business Consultation',
    description: 'One-on-one strategic consulting session for entrepreneurs and business owners.',
    price: 15000,
    duration: 45,
    category: 'Consulting',
    active: true,
  },
  {
    name: 'Personal Training Session',
    description: 'Customized fitness training tailored to your goals with a certified trainer.',
    price: 8000,
    duration: 60,
    category: 'Fitness',
    active: true,
  },
  {
    name: 'Hair Styling & Cut',
    description: 'Professional haircut and styling service with premium products.',
    price: 7500,
    duration: 45,
    category: 'Beauty',
    active: true,
  },
  {
    name: 'Photography Session',
    description: 'Professional portrait or event photography session with edited photos included.',
    price: 25000,
    duration: 120,
    category: 'Creative',
    active: true,
  },
  {
    name: 'Legal Consultation',
    description: 'Initial consultation with an experienced attorney for legal advice and guidance.',
    price: 20000,
    duration: 30,
    category: 'Legal',
    active: true,
  },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully.');

    // Use dynamic model registration to avoid schema issues in script
    const Service = mongoose.models.Service || mongoose.model('Service', new mongoose.Schema({
      name: String,
      description: String,
      price: Number,
      duration: Number,
      category: String,
      active: Boolean,
    }, { timestamps: true }));

    console.log('Clearing existing services...');
    await Service.deleteMany({});
    
    console.log('Inserting services...');
    const createdServices = await Service.insertMany(services);
    console.log(`Successfully seeded ${createdServices.length} services.`);

    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
