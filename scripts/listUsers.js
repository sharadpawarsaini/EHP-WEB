const path = require('path');
module.paths.push(path.join(__dirname, '../backend/node_modules'));
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const User = mongoose.model('User', new mongoose.Schema({ email: String, role: String }));
    const users = await User.find({}, 'email role');
    console.log('Users in DB:', JSON.stringify(users, null, 2));
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};
listUsers();
