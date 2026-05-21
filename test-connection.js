const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

console.log('Testing MongoDB connection...');
console.log('URI:', MONGODB_URI ? '✅ Found' : '❌ Missing');

async function test() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env.local');
    return;
  }
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Database connected successfully!');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

test();
