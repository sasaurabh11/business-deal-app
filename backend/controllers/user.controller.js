import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const setCookie = (res, token) => {
  res.cookie('token', token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
  });
};

const register = async (req, res) => {
  try {
    const { username, name, email, password, role } = req.body;
    console.log(username, name, email, password, role);

    if (![username, name, email, password, role].every(Boolean)) {
      return res.status(400).json({ success: false, message: 'Please fill in all fields.' });
    }

    if (!['buyer', 'seller', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role selection is invalid.' });
    }

    const existingUser = await userModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email or username is already registered. Try logging in.' });
    }

    const newUser = await userModel.create({ username, name, email, password, role });
    const token = generateToken(newUser._id);
    setCookie(res, token);

    res.status(201).json({ success: true, message: 'Registration successful!', user: { ...newUser.toObject(), password: undefined }, token });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.', error });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!(email || username) || !password) {
      return res.status(400).json({ success: false, message: 'Either email or username and password are required.' });
    }

    const user = await userModel.findOne({ $or: [{ email }, { username }] }).select('+password');
    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please try again.' });
    }

    const token = generateToken(user._id);
    setCookie(res, token);

    res.status(200).json({ success: true, message: 'Login successful! Welcome back.', user: { ...user.toObject(), password: undefined }, token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'An error occurred while logging in. Please try again later.', error });
  }
};

export { register, loginUser };