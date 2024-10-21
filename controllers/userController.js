import User from '../models/userModel.js';



export const createUser = async (req, res, next) => {
  try {
    const { name, email, mobile } = req.body;

    // Data validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'Invalid name provided' });
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ message: 'Mobile number must be 10 digits' });
    }

    // Create and save user
    const user = new User({ name, email, mobile });
    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    error.statusCode = 500; 
    next(error); 
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    error.statusCode = 500; 
    next(error); 
  }
};

