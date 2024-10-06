const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

const User = mongoose.model('User', userSchema);
module.exports = User;
