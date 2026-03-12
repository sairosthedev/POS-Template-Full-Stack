const User = require('../users/user.model');
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return errorResponse(res, 'Invalid email or password', 401);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return errorResponse(res, 'Invalid email or password', 401);

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return successResponse(res, {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    }, 'Login successful');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return errorResponse(res, 'User already exists', 400);

    const user = new User({ name, email, password, role });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return successResponse(res, {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    }, 'User registered successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
