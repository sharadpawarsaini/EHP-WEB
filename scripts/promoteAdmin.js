const path = require('path');
// Add backend node_modules to the search path
module.paths.push(path.join(__dirname, '../backend/node_modules'));

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const promoteToAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      role: String
    }));

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: 'admin' },
      { new: true }
    );

    if (user) {
      console.log(`Successfully promoted ${email} to admin.`);
    } else {
      console.log(`User with email ${email} not found.`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

const email = process.argv[2];
if (!email) {
  console.log('Please provide an email: node promoteAdmin.js user@example.com');
  process.exit(1);
}

promoteToAdmin(email);
