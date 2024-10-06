const User = require('../models/serverModel'); // Import the User model
const bcrypt = require('bcrypt'); // Import bcrypt for hashing

// Function to handle user signup
const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword, // Store hashed password
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Function to handle user login
const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check for user existence
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Successful login, send user data excluding password
      res.status(200).json({ username: user.username });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

module.exports = {
  signupUser,
  loginUser,
};
