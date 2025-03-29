import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
  const { username, name, email, password, role } = req.body;

  if (!username || !name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!['buyer', 'seller'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const newUser = await userModel.create({
      username,
      name,
      email,
      password,
      role
    })

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const cookieOptions = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      httpOnly: true
    }
    res.cookie("token", token, cookieOptions);

    newUser.password = undefined;

    res.status(201).json({ success: true, user: newUser, token, message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error in signup', error });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }
    const user = await userModel.findOne({ email }).select("+password");
    
    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const cookieOptions = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      httpOnly: true
    }
    res.cookie("token", token, cookieOptions);
    user.password = undefined;
    res.status(201).json({ success: true, user: user, token, message: "login successfull" });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error });
  }
};

export { register, loginUser };
