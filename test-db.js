const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://kannada_admin:Kannada2024@cluster.evkpgnd.mongodb.net/kannada_exam_pro?retryWrites=true&w=majority';

async function test() {
  try {
    console.log('Connecting...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ SUCCESS! Connected to MongoDB');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ FAILED:', error.message);
  }
}

test();
