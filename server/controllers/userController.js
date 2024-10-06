const User = require('../models/serverModel'); 
const bcrypt = require('bcrypt'); 


const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = new User({
      username,
      email,
      password: hashedPassword, 
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};


const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      
      res.status(200).json({ username: user.username });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

module.exports = {
  signupUser,
  loginUser,
};
